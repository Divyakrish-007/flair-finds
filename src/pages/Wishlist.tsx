import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export const Wishlist: React.FC = () => {
  const { wishlist, count, removeFromWishlist, moveToCart } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-pink-950/40 border border-pink-500/20 flex items-center justify-center text-pink-400 mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-400">
          Save items that speak to your style by clicking the heart icon on any product.
        </p>
        <Link to="/shop" className="btn-primary inline-flex text-xs">
          Discover Styles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-purple-500/15 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            My Saved Wishlist <span className="text-pink-400 text-lg font-normal">({count})</span>
          </h1>
          <p className="text-xs text-slate-400">Curated pieces you've saved for later</p>
        </div>
        <Link to="/shop" className="text-xs text-purple-400 hover:underline flex items-center gap-1">
          <span>Continue Browsing</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="product-card flex flex-col justify-between"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
              <Link to={`/product/${product.id}`} className="block w-full h-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </Link>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full glass bg-black/60 text-pink-400 hover:text-white"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 space-y-2">
              <div>
                <p className="text-[10px] uppercase text-purple-300 font-bold">{product.brand}</p>
                <Link
                  to={`/product/${product.id}`}
                  className="text-xs font-semibold text-white hover:text-purple-300 line-clamp-1 block"
                >
                  {product.name}
                </Link>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400">{product.source}</span>
              </div>

              <button
                onClick={() => moveToCart(product)}
                className="w-full btn-primary justify-center text-xs py-2 font-semibold shadow-md shadow-purple-600/20"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
