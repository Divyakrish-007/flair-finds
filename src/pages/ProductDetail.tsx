import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Share2
} from 'lucide-react';
import { Product, Review } from '../types';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { ReviewSection } from '../components/ReviewSection';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productsApi.getProductById(id);
        setProduct(data.product);
        setSimilarProducts(data.similarProducts || []);
        setReviews(data.reviews || []);
        if (data.product.sizes?.length) setSelectedSize(data.product.sizes[0]);
        if (data.product.colors?.length) setSelectedColor(data.product.colors[0]);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xs text-purple-300">Loading fine fashion details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-slate-400">The fashion piece you are looking for might be out of stock or relocated.</p>
        <Link to="/shop" className="btn-primary inline-flex text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = async () => {
    await addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumbs & Back */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 text-slate-400">
          <Link to="/" className="hover:text-purple-300">Home</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-purple-300">{product.category}</Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Product Media Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4 sticky top-24">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900 border border-purple-500/20 shadow-2xl relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 right-4 discount-badge text-xs px-2.5 py-1">
                {product.discount}% OFF
              </span>
            )}
            <span className="absolute top-4 left-4 badge text-xs px-3 py-1 font-bold rounded-md bg-black/60 text-purple-300 border border-purple-500/30 backdrop-blur-md">
              Available on {product.source}
            </span>
          </div>
        </div>

        {/* Right: Product Buy Box & Details (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-widest text-purple-400 font-bold">
                {product.brand}
              </span>
              <button
                onClick={handleShare}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                title="Share link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Rating & Review count */}
          <div className="flex items-center gap-3 pb-4 border-b border-purple-500/15">
            <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-400">
              <span>{product.rating}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units left)
            </span>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-[#1A1A2E]/80 border border-purple-500/20 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-slate-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-bold text-emerald-400">
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Inclusive of all taxes & doorstep delivery</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">About This Style</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Selected Shade:</span>
                <span className="font-bold text-purple-300">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      selectedColor === c
                        ? 'bg-purple-600/30 text-purple-200 border-purple-500'
                        : 'bg-[#1A1A2E] text-slate-300 border-purple-500/20 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Choose Size:</span>
                <span className="text-purple-400 hover:underline cursor-pointer">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[44px] px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedSize === s
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-[#1A1A2E] text-slate-300 border-purple-500/20 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-semibold text-slate-300">Quantity:</span>
            <div className="flex items-center border border-purple-500/30 rounded-xl bg-[#1A1A2E] overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-purple-500/20"
              >
                -
              </button>
              <span className="px-3 py-1.5 text-xs font-bold text-white min-w-[32px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-purple-500/20"
              >
                +
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-purple-500/15">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="btn-primary justify-center py-3.5 text-sm font-bold shadow-lg shadow-purple-600/30"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30"
              >
                <span>Instant Checkout</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toggleWishlist(product)}
                className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isFavorited
                    ? 'bg-pink-950/40 border-pink-500/50 text-pink-300'
                    : 'bg-[#1A1A2E] border-purple-500/20 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'text-pink-500 fill-pink-500' : ''}`} />
                <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <a
                href={product.sourceUrl || `https://${product.source.toLowerCase()}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-xl border border-purple-500/20 bg-[#1A1A2E] text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                <span>View on {product.source}</span>
              </a>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#0F0F1A] border border-purple-500/10 text-center text-[10px] text-slate-400">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-purple-400" />
              <span>Free Delivery &gt; ₹1500</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-pink-400" />
              <span>7-Day Easy Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Genuine Quality</span>
            </div>
          </div>

        </div>

      </div>

      {/* Reviews Section */}
      <section className="pt-12 border-t border-purple-500/15">
        <ReviewSection
          productId={product.id}
          initialReviews={reviews}
          averageRating={product.rating}
          reviewCount={product.reviewCount}
        />
      </section>

      {/* Similar / Related Products */}
      {similarProducts.length > 0 && (
        <section className="pt-8 border-t border-purple-500/15 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Style Pairings</span>
              <h3 className="text-xl font-bold text-white">Similar Fashion Products</h3>
            </div>
            <Link to={`/shop?category=${product.category}`} className="text-xs text-purple-400 hover:underline">
              See More
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similarProducts.map((simProd) => (
              <ProductCard key={simProd.id} product={simProd} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
