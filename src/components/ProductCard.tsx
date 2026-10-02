import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ExternalLink, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

  const getSourceBadgeClass = (source: string) => {
    switch (source) {
      case 'Amazon': return 'source-amazon';
      case 'Flipkart': return 'source-flipkart';
      case 'Meesho': return 'source-meesho';
      case 'Snapdeal': return 'source-snapdeal';
      default: return 'bg-purple-900/30 text-purple-300 border-purple-500/20';
    }
  };

  return (
    <div className="product-card group flex flex-col justify-between h-full relative">
      
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Source Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className={`badge text-[10px] font-bold px-2 py-0.5 rounded-md ${getSourceBadgeClass(product.source)}`}>
            {product.source}
          </span>
        </div>

        {/* Discount Badge (Top Right below wishlist if discount > 0) */}
        {product.discount > 0 && (
          <div className="absolute top-2.5 right-11 z-10">
            <span className="discount-badge">
              {product.discount}% OFF
            </span>
          </div>
        )}

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full glass bg-black/40 flex items-center justify-center text-slate-200 hover:text-pink-400 hover:scale-110 active:scale-95 transition-all shadow-md"
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'text-pink-500 fill-pink-500' : 'text-slate-300'}`} />
        </button>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 glass bg-black/70 hover:bg-purple-900/80 text-white text-xs font-semibold py-1.5 px-3 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap z-10"
          >
            <Eye className="w-3.5 h-3.5 text-purple-300" />
            Quick Preview
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-purple-300 font-semibold mb-1">
            <span className="uppercase tracking-wider">{product.brand}</span>
            <span className="text-slate-400 font-normal">{product.category}</span>
          </div>

          {/* Product Name */}
          <Link 
            to={`/product/${product.id}`}
            className="text-sm font-semibold text-slate-100 hover:text-purple-300 line-clamp-1 transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded text-[11px] font-bold text-amber-400">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-2 border-t border-purple-500/10 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              Via <span className="font-medium text-slate-300">{product.source}</span>
            </p>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="p-2 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 hover:border-transparent transition-all shadow-sm active:scale-95 flex items-center justify-center"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
