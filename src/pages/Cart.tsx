import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  ArrowLeft,
  PackageOpen
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { 
    cart, 
    itemCount, 
    subtotal, 
    discount, 
    shippingFee, 
    total, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Looks like you haven't added any styles yet. Discover trending collections or ask Flair AI to find your flair!
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link to="/shop" className="btn-primary text-xs py-2.5 px-6">
            Explore Shop Catalog
          </Link>
          <Link to="/ai-stylist" className="btn-secondary text-xs py-2.5 px-6">
            Ask Flair AI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-purple-500/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            Shopping Bag <span className="text-purple-400 text-lg font-normal">({itemCount} items)</span>
          </h1>
          <p className="text-xs text-slate-400">Review your fashion selections before completing mock checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass bg-[#1A1A2E]/70 border border-purple-500/15 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                {/* Product Thumbnail & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <Link
                    to={`/product/${product.id}`}
                    className="w-20 h-24 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-purple-500/20"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-purple-300 font-bold">
                      {product.brand} • <span className="text-slate-400 font-normal">Via {product.source}</span>
                    </span>
                    <Link
                      to={`/product/${product.id}`}
                      className="text-sm font-bold text-white hover:text-purple-300 transition-colors block line-clamp-1"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      {item.size && (
                        <span className="bg-[#0F0F1A] px-2 py-0.5 rounded border border-purple-500/20">
                          Size: <strong>{item.size}</strong>
                        </span>
                      )}
                      {item.color && (
                        <span className="bg-[#0F0F1A] px-2 py-0.5 rounded border border-purple-500/20">
                          Color: <strong>{item.color}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-bold text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-[11px] text-slate-500 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total & Remove */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-500/10">
                  <div className="flex items-center border border-purple-500/30 rounded-xl bg-[#0F0F1A] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-purple-500/20"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-white min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-purple-500/20"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">
                      ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:underline pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="glass bg-[#1A1A2E]/90 p-6 rounded-3xl border border-purple-500/25 shadow-2xl space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-400" />
              <span>Order Summary</span>
            </h2>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount Savings</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-400 uppercase text-[11px]">Free</strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              {shippingFee > 0 && (
                <p className="text-[10px] text-purple-300 bg-purple-950/40 p-2 rounded-lg border border-purple-500/20">
                  💡 Add items worth ₹{(1500 - subtotal).toLocaleString('en-IN')} more to unlock <strong>FREE Delivery</strong>!
                </p>
              )}

              <div className="pt-3 border-t border-purple-500/15 flex justify-between text-base font-bold text-white">
                <span>Total Amount</span>
                <span className="text-emerald-400">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary justify-center py-3.5 text-sm font-bold shadow-xl shadow-purple-600/40"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-3 border-t border-purple-500/10 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe & Secure Mock Checkout</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
