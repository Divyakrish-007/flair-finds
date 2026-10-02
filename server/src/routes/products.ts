import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { Product } from '../../src/types/index.js';

const router = Router();

// GET all products with search, filters, sorting
router.get('/', (req: Request, res: Response) => {
  try {
    let products = [...db.getProducts()];

    const {
      q,
      category,
      gender,
      minPrice,
      maxPrice,
      minRating,
      brand,
      source,
      sortBy,
      featured,
      trending,
      limit
    } = req.query;

    // Search query parsing (name, category, brand, description, tags, colors)
    if (q && typeof q === 'string' && q.trim()) {
      const searchTerms = q.toLowerCase().trim().split(/\s+/);
      
      products = products.filter(p => {
        const searchableText = [
          p.name,
          p.brand,
          p.category,
          p.gender,
          p.description,
          p.source,
          ...(p.tags || []),
          ...(p.colors || [])
        ].join(' ').toLowerCase();

        // Must match all entered terms
        return searchTerms.every(term => {
          // Check for price query like 'under 2000' or '<2000'
          if (term.startsWith('under') || term.startsWith('<')) {
            const num = parseInt(term.replace(/[^0-9]/g, ''));
            if (!isNaN(num)) return p.price <= num;
          }
          return searchableText.includes(term);
        });
      });
    }

    // Category filter (support comma-separated)
    if (category && typeof category === 'string') {
      const cats = category.split(',').map(c => c.trim().toLowerCase());
      products = products.filter(p => cats.includes(p.category.toLowerCase()));
    }

    // Gender filter (support comma-separated)
    if (gender && typeof gender === 'string') {
      const genders = gender.split(',').map(g => g.trim().toLowerCase());
      products = products.filter(p => 
        genders.includes(p.gender.toLowerCase()) || p.gender.toLowerCase() === 'unisex'
      );
    }

    // Brand filter (support comma-separated)
    if (brand && typeof brand === 'string') {
      const brands = brand.split(',').map(b => b.trim().toLowerCase());
      products = products.filter(p => brands.includes(p.brand.toLowerCase()));
    }

    // Source filter (Amazon, Flipkart, etc.)
    if (source && typeof source === 'string') {
      const sources = source.split(',').map(s => s.trim().toLowerCase());
      products = products.filter(p => sources.includes(p.source.toLowerCase()));
    }

    // Min Price
    if (minPrice && !isNaN(Number(minPrice))) {
      products = products.filter(p => p.price >= Number(minPrice));
    }

    // Max Price
    if (maxPrice && !isNaN(Number(maxPrice))) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    // Min Rating
    if (minRating && !isNaN(Number(minRating))) {
      products = products.filter(p => p.rating >= Number(minRating));
    }

    // Featured only
    if (featured === 'true') {
      products = products.filter(p => p.isFeatured);
    }

    // Trending only
    if (trending === 'true') {
      products = products.filter(p => p.isTrending);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        products.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'discount':
        products.sort((a, b) => b.discount - a.discount);
        break;
      case 'recommended':
      default:
        // Score by a blend of rating, discount, and trending
        products.sort((a, b) => {
          const scoreA = a.rating * 10 + a.discount + (a.isTrending ? 20 : 0) + (a.isFeatured ? 15 : 0);
          const scoreB = b.rating * 10 + b.discount + (b.isTrending ? 20 : 0) + (b.isFeatured ? 15 : 0);
          return scoreB - scoreA;
        });
        break;
    }

    // Limit
    if (limit && !isNaN(Number(limit))) {
      products = products.slice(0, Number(limit));
    }

    // Extract available filters for facet count
    const allProducts = db.getProducts();
    const availableBrands = Array.from(new Set(allProducts.map(p => p.brand))).sort();
    const availableCategories = Array.from(new Set(allProducts.map(p => p.category))).sort();

    res.json({
      success: true,
      count: products.length,
      products,
      facets: {
        brands: availableBrands,
        categories: availableCategories,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching products' });
  }
});

// GET single product by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find similar products based on category, gender, or shared tags
    const allProducts = db.getProducts();
    const similarProducts = allProducts
      .filter(p => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
      .slice(0, 4);

    const reviews = db.getReviewsByProduct(product.id);

    res.json({
      success: true,
      product,
      similarProducts,
      reviews
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching product' });
  }
});

export default router;
