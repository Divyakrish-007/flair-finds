import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { Product, OutfitRecommendation } from '../../src/types/index.js';

const router = Router();

// Helper to extract numbers for budget queries like "under 2000", "below 1500", "< 3000"
const extractBudget = (query: string): number | null => {
  const match = query.match(/(?:under|below|less than|<|budget of|within|upto|up to)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i) ||
                query.match(/(\d+)\s*(?:₹|rs\.?|inr)?\s*(?:or less|budget|max)/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
};

// Helper to extract color keywords
const extractColor = (query: string): string | null => {
  const colors = ['black', 'white', 'blue', 'navy', 'green', 'emerald', 'red', 'pink', 'rose', 'gold', 'yellow', 'brown', 'tan', 'beige', 'grey', 'gray', 'purple', 'lavender', 'orange'];
  const lower = query.toLowerCase();
  for (const c of colors) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(lower)) {
      return c;
    }
  }
  return null;
};

// Helper to extract gender
const extractGender = (query: string): 'Women' | 'Men' | 'Unisex' | null => {
  const lower = query.toLowerCase();
  if (/\b(women|woman|girl|ladies|female)\b/i.test(lower)) return 'Women';
  if (/\b(men|man|boy|gentlemen|male)\b/i.test(lower)) return 'Men';
  if (/\b(unisex)\b/i.test(lower)) return 'Unisex';
  return null;
};

// Helper to extract category or product type
const extractCategory = (query: string): string | null => {
  const lower = query.toLowerCase();
  if (/\b(dress|dresses|frock|gown)\b/i.test(lower)) return 'Dresses';
  if (/\b(t-shirt|tshirt|tee|graphic tee)\b/i.test(lower)) return 'T-Shirts';
  if (/\b(shirt|shirts|flannel|formal shirt)\b/i.test(lower)) return 'Shirts';
  if (/\b(jeans|denim|cargos)\b/i.test(lower)) return 'Jeans';
  if (/\b(trousers|chinos|pants|palazzo)\b/i.test(lower)) return 'Trousers';
  if (/\b(shoes|sneakers|boots|heels|sandals|footwear)\b/i.test(lower)) return 'Shoes';
  if (/\b(bag|bags|handbag|backpack|tote|clutch)\b/i.test(lower)) return 'Bags';
  if (/\b(watch|watches|smartwatch)\b/i.test(lower)) return 'Watches';
  if (/\b(jewellery|jewelry|necklace|earrings|jhumka)\b/i.test(lower)) return 'Jewellery';
  if (/\b(sunglasses|shades|belt|scarf|accessories)\b/i.test(lower)) return 'Accessories';
  return null;
};

// Smart Rule-Based Engine
const processWithRuleEngine = (userMessage: string) => {
  const lower = userMessage.toLowerCase();
  const allProducts = db.getProducts();

  const budget = extractBudget(userMessage);
  const color = extractColor(userMessage);
  const gender = extractGender(userMessage);
  const category = extractCategory(userMessage);

  // Check for outfit recommendation request
  const isOutfitRequest = /\b(outfit|look|wear|college function|farewell|party wear|build outfit|complete outfit)\b/i.test(lower);

  let filtered = [...allProducts];

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (gender) {
    filtered = filtered.filter(p => p.gender === gender || p.gender === 'Unisex');
  }

  if (budget) {
    filtered = filtered.filter(p => p.price <= budget);
  }

  if (color) {
    filtered = filtered.filter(p => 
      p.colors.some(c => c.toLowerCase().includes(color)) ||
      p.name.toLowerCase().includes(color) ||
      p.description.toLowerCase().includes(color)
    );
  }

  // Keywords filter (occasion/style: party, college, formal, wedding, casual, etc.)
  const keywords = ['party', 'college', 'formal', 'casual', 'wedding', 'summer', 'winter', 'cocktail', 'office', 'ethnic'];
  const matchedKeywords = keywords.filter(k => lower.includes(k));
  if (matchedKeywords.length > 0 && !category) {
    filtered = filtered.filter(p => 
      matchedKeywords.some(kw => 
        p.tags.some(t => t.toLowerCase().includes(kw)) ||
        p.description.toLowerCase().includes(kw) ||
        p.name.toLowerCase().includes(kw)
      )
    );
  }

  // If no items matched specific criteria, relax filters
  if (filtered.length === 0) {
    filtered = allProducts.filter(p => {
      if (budget && p.price > budget * 1.2) return false;
      return true;
    }).slice(0, 4);
  }

  // Sort by rating & popularity
  filtered.sort((a, b) => b.rating - a.rating);
  const recommended = filtered.slice(0, 4);

  // Generate dynamic conversational response
  let replyText = '';
  if (isOutfitRequest) {
    replyText = `I've styled a coordinated look for you! Check out these handpicked pieces that balance modern flair with effortless style.`;
  } else if (category && budget) {
    replyText = `Here are the best **${category}** matching your criteria under **₹${budget.toLocaleString('en-IN')}**:`;
  } else if (category) {
    replyText = `Here are our top trending **${category}** carefully tailored for your flair:`;
  } else if (color) {
    replyText = `I found these stylish pieces in **${color}** tones that look fantastic:`;
  } else if (budget) {
    replyText = `Here are our highest-rated picks under **₹${budget.toLocaleString('en-IN')}**:`;
  } else {
    replyText = `Based on what you're looking for, I recommend these popular styles from our catalog:`;
  }

  return {
    text: replyText,
    recommendedProducts: recommended,
    quickReplies: [
      'Suggest casual outfits for college',
      'Party dress under ₹2500',
      'White sneakers under ₹4500',
      'Build my complete outfit'
    ]
  };
};

// AI Chatbot endpoint
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const ruleBasedResult = processWithRuleEngine(message);

    // If Gemini key is available, we could enhance the natural language summary
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Flair AI, an ultra-stylish fashion advisor for Flair Finds e-commerce. Keep response concise (under 2 sentences), energetic, and stylish. User query: "${message}". Available products recommended: ${ruleBasedResult.recommendedProducts.map(p => p.name).join(', ')}.`
              }]
            }]
          })
        });

        if (response.ok) {
          const data: any = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return res.json({
              success: true,
              text: generatedText.trim(),
              recommendedProducts: ruleBasedResult.recommendedProducts,
              quickReplies: ruleBasedResult.quickReplies
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, gracefully using rule-based engine:', geminiError);
      }
    }

    // Always fallback smoothly to rule-based engine
    res.json({
      success: true,
      text: ruleBasedResult.text,
      recommendedProducts: ruleBasedResult.recommendedProducts,
      quickReplies: ruleBasedResult.quickReplies
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      text: "I'm having a brief connection pause, but here are some of our trending fashion picks you might love!",
      recommendedProducts: db.getProducts().slice(0, 4)
    });
  }
});

// "Build My Outfit" Recommender
router.post('/build-outfit', (req: Request, res: Response) => {
  try {
    const { occasion = 'Casual', style = 'Modern', budget = 5000, preferredColor, gender = 'Women' } = req.body;

    const allProducts = db.getProducts();
    const targetGender = gender === 'Men' ? 'Men' : 'Women';

    const genderPool = allProducts.filter(p => p.gender === targetGender || p.gender === 'Unisex');

    // Pick top/dress
    const topCandidates = genderPool.filter(p => 
      ['Dresses', 'Tops', 'Shirts', 'T-Shirts'].includes(p.category) &&
      (preferredColor ? p.colors.some(c => c.toLowerCase().includes(preferredColor.toLowerCase())) : true)
    );
    const top = topCandidates[Math.floor(Math.random() * (topCandidates.length || 1))] || genderPool.find(p => ['Tops', 'Shirts', 'Dresses'].includes(p.category));

    // Pick bottom
    const bottomCandidates = genderPool.filter(p => ['Jeans', 'Trousers'].includes(p.category));
    const bottom = bottomCandidates[Math.floor(Math.random() * (bottomCandidates.length || 1))] || genderPool.find(p => ['Jeans', 'Trousers'].includes(p.category));

    // Pick shoes
    const shoeCandidates = genderPool.filter(p => p.category === 'Shoes');
    const shoes = shoeCandidates[Math.floor(Math.random() * (shoeCandidates.length || 1))] || genderPool.find(p => p.category === 'Shoes');

    // Pick accessory/bag/jewellery/watch
    const accCandidates = genderPool.filter(p => ['Bags', 'Accessories', 'Watches', 'Jewellery'].includes(p.category));
    const accessory = accCandidates[Math.floor(Math.random() * (accCandidates.length || 1))] || genderPool.find(p => ['Accessories', 'Bags'].includes(p.category));

    const items: OutfitRecommendation['items'] = {};
    if (top) items.top = top;
    // Only include bottom if top is not a full-length dress
    if (bottom && top?.category !== 'Dresses') items.bottom = bottom;
    if (shoes) items.shoes = shoes;
    if (accessory) items.accessory = accessory;

    const totalPrice = Object.values(items).reduce((sum, item) => sum + (item ? item.price : 0), 0);

    const stylingTips = [
      `Tuck the top gently or roll the sleeves for an effortless ${style.toLowerCase()} silhouette.`,
      `Color harmony: balanced with subtle ${preferredColor || 'neutral'} accents.`,
      `Complete the aesthetic with layered minimal jewellery and clean footwear.`
    ];

    const recommendation: OutfitRecommendation = {
      occasion,
      style,
      preferredColor,
      budget: Number(budget),
      totalPrice,
      items,
      stylingTips
    };

    res.json({
      success: true,
      recommendation
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Personalized "Recommended For You" endpoint
router.post('/recommendations', (req: Request, res: Response) => {
  try {
    const { viewedCategories = [], recentSearchTerms = [] } = req.body;
    const allProducts = db.getProducts();

    if (!viewedCategories.length && !recentSearchTerms.length) {
      // Return Trending Picks
      const trending = allProducts.filter(p => p.isTrending || p.isFeatured).slice(0, 8);
      return res.json({
        success: true,
        type: 'trending',
        title: 'Trending Picks For You',
        products: trending
      });
    }

    const matched = allProducts.filter(p => {
      const catMatch = viewedCategories.some((c: string) => c.toLowerCase() === p.category.toLowerCase());
      const tagMatch = recentSearchTerms.some((term: string) => 
        p.tags.some(t => t.toLowerCase().includes(term.toLowerCase())) ||
        p.name.toLowerCase().includes(term.toLowerCase())
      );
      return catMatch || tagMatch;
    });

    const results = matched.length >= 4 ? matched.slice(0, 8) : allProducts.filter(p => p.isTrending).slice(0, 8);

    res.json({
      success: true,
      type: 'personalized',
      title: 'Recommended For You',
      products: results
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
