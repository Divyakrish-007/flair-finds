import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Compass, 
  ShoppingBag, 
  Star, 
  Search, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  Zap,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { productsApi, aiApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

interface HomeProps {
  onOpenOutfitBuilder: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenOutfitBuilder }) => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: { name: string; category: ProductCategory; image: string; tag: string }[] = [
    {
      name: 'Dresses & Gowns',
      category: 'Dresses',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
      tag: 'Cocktail & Maxi'
    },
    {
      name: 'Men\'s Shirts',
      category: 'Shirts',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
      tag: 'Linen & Oxford'
    },
    {
      name: 'Denim & Jeans',
      category: 'Jeans',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      tag: 'Vintage Wide & Slim'
    },
    {
      name: 'Sneakers & Shoes',
      category: 'Shoes',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
      tag: 'Retro & Athletic'
    },
    {
      name: 'Tops & Blouses',
      category: 'Tops',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
      tag: 'Chic Ribbed & Silk'
    },
    {
      name: 'Graphic Tees',
      category: 'T-Shirts',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      tag: 'Oversized Streetwear'
    },
    {
      name: 'Luxury Bags',
      category: 'Bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      tag: 'Crossbody & Totes'
    },
    {
      name: 'Watches & Jewellery',
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
      tag: '18K Gold & Chrono'
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, featuredRes] = await Promise.all([
          productsApi.getProducts({ trending: true, limit: 8 }),
          productsApi.getProducts({ featured: true, limit: 4 })
        ]);
        setTrendingProducts(trendingRes.products || []);
        setFeaturedProducts(featuredRes.products || []);
      } catch (err) {
        console.error('Error fetching homepage products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:py-24 hero-gradient rounded-b-[2.5rem] border-b border-purple-500/20">
        {/* Glow ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-600/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
                <span>Next-Gen AI Fashion Discovery Platform</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                Discover Your Style With{' '}
                <span className="gradient-text font-serif italic block sm:inline">Flair Finds</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Explore fashion products, discover new styles, and let AI help you find what fits your taste across top marketplaces in one unified experience.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="btn-primary text-sm px-7 py-3.5 shadow-xl shadow-purple-600/40 text-white font-bold"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </Link>

                <Link
                  to="/ai-stylist"
                  className="btn-secondary text-sm px-6 py-3.5 font-bold"
                >
                  <Bot className="w-4 h-4 text-pink-400" />
                  <span>Ask Flair AI</span>
                </Link>

                <button
                  onClick={onOpenOutfitBuilder}
                  className="text-sm px-5 py-3.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 transition-all font-semibold flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Build My Outfit</span>
                </button>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-purple-500/20 text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">35+</p>
                  <p className="text-[11px] text-slate-400">Curated Brands</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-pink-400">4 Sources</p>
                  <p className="text-[11px] text-slate-400">Amazon & Flipkart</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-400">Instant</p>
                  <p className="text-[11px] text-slate-400">AI Styling Advice</p>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Presentation */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                
                {/* Main Card */}
                <div className="glass bg-[#1A1A2E]/90 p-4 rounded-3xl border border-purple-500/30 shadow-2xl relative z-10 card-hover">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 relative">
                    <img
                      src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
                      alt="Floral A-Line Midi Dress"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                      <span className="source-amazon text-[10px] font-bold px-2 py-0.5 rounded w-max mb-1">
                        Trending on Amazon
                      </span>
                      <h3 className="text-white text-base font-bold">Floral Cocktail Midi Dress</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-emerald-400 font-bold text-lg">₹1,899</span>
                        <span className="text-xs text-slate-400 line-through">₹3,499 (45% off)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating AI Bubble (Top Left) */}
                <div className="absolute -top-4 -left-6 z-20 glass bg-[#121224]/95 border border-purple-500/40 p-3 rounded-2xl shadow-xl max-w-[200px] animate-float">
                  <div className="flex items-center gap-2 text-pink-400 text-xs font-bold mb-1">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Flair AI Recommendation</span>
                  </div>
                  <p className="text-[11px] text-slate-200">
                    "Style with gold layered necklace & nude strappy heels."
                  </p>
                </div>

                {/* Floating Rating Pill (Bottom Right) */}
                <div className="absolute -bottom-4 -right-4 z-20 glass bg-[#121224]/95 border border-amber-500/30 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">4.8 / 5.0 Rating</p>
                    <p className="text-[10px] text-slate-400">1,200+ Reviews</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Categories</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
          >
            <span>Explore All 11+ Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.category}
              to={`/shop?category=${cat.category}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 border border-purple-500/15 card-hover"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">{cat.tag}</span>
                <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Hot Drops & Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Trending on Flair Finds</h2>
          </div>
          <Link
            to="/shop?trending=true"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="products-grid">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Interactive AI Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#1A1A2E] to-pink-950 border border-purple-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3 py-1 rounded-full text-xs font-bold">
                <Bot className="w-3.5 h-3.5" />
                <span>AI Style Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Not sure what to buy?
              </h2>
              <p className="text-sm sm:text-base text-purple-200 max-w-xl">
                Tell our AI stylist your budget, the occasion, or your preferred vibe, and get instant personalized outfit combinations tailored for you.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/ai-stylist"
                  className="btn-primary px-6 py-3 text-sm font-bold shadow-lg shadow-purple-600/30"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask Flair AI</span>
                </Link>
                <button
                  onClick={onOpenOutfitBuilder}
                  className="btn-secondary px-6 py-3 text-sm font-bold"
                >
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>Launch 4-Piece Outfit Builder</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="glass bg-[#121224] p-5 rounded-2xl border border-purple-500/30 space-y-3 max-w-xs w-full text-xs">
                <p className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  Popular Prompts:
                </p>
                <div className="space-y-2">
                  <Link
                    to="/ai-stylist"
                    className="block p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-slate-200 text-[11px] border border-purple-500/20"
                  >
                    "Party wear outfit under ₹2,500"
                  </Link>
                  <Link
                    to="/ai-stylist"
                    className="block p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-slate-200 text-[11px] border border-purple-500/20"
                  >
                    "Casual college look with sneakers"
                  </Link>
                  <Link
                    to="/ai-stylist"
                    className="block p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-slate-200 text-[11px] border border-purple-500/20"
                  >
                    "Formal office shirt with tailored chinos"
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Flair Finds? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 block">Our Edge</span>
          <h2 className="text-3xl font-extrabold text-white">Why Flair Finds?</h2>
          <p className="text-xs text-slate-400 mt-2">Engineered to make finding your signature look fast, fun, and affordable.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#1A1A2E]/70 border border-purple-500/20 space-y-3 card-hover">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Smart Search</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find exact products by searching colors, occasion types, budgets (e.g., "dress under 2000"), or brands seamlessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1A2E]/70 border border-purple-500/20 space-y-3 card-hover">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Recommendations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time conversational recommendations based on your preferences, budget constraints, and wardrobe goals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1A2E]/70 border border-purple-500/20 space-y-3 card-hover">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multiple Shopping Sources</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare items from Amazon, Flipkart, Meesho, and Snapdeal side-by-side with transparent pricing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1A2E]/70 border border-purple-500/20 space-y-3 card-hover">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Persistent Wishlist</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Save your favorite fashion pieces with one click and effortlessly move them to your cart when ready.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1A2E]/70 border border-purple-500/20 space-y-3 card-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Easy Cart & Mock Checkout</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adjust sizes, quantity, calculate savings, and experience a realistic checkout with instant order generation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1A2E]/70 border border-purple-500/20 space-y-3 card-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Personalized Experience</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adaptive suggestions that evolve as you browse, search, review, and build looks over time.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
