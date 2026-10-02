import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Profile: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-slate-400">Please log in to access your profile settings and order history.</p>
        <Link to="/login" className="btn-primary inline-flex text-xs">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Profile Card */}
      <div className="glass bg-[#121224] p-6 sm:p-8 rounded-3xl border border-purple-500/25 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-purple-600/40 flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              isAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`}>
              {isAdmin ? 'Administrator' : 'Fashion Club Member'}
            </span>
          </div>
          <p className="text-xs text-purple-300">{user.email}</p>
          <p className="text-[11px] text-slate-400">Account Active • AI Recommendations Enabled</p>
        </div>

        <button
          onClick={logout}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 p-2 rounded-xl bg-red-950/20 border border-red-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Link
          to="/orders"
          className="p-5 rounded-2xl glass bg-[#1A1A2E]/70 border border-purple-500/20 hover:border-purple-500/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Order History</p>
              <p className="text-sm font-bold text-white">Track Deliveries</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </Link>

        <Link
          to="/wishlist"
          className="p-5 rounded-2xl glass bg-[#1A1A2E]/70 border border-purple-500/20 hover:border-purple-500/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Saved Wishlist</p>
              <p className="text-sm font-bold text-white">{wishlistCount} Saved Styles</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </Link>

        <Link
          to="/cart"
          className="p-5 rounded-2xl glass bg-[#1A1A2E]/70 border border-purple-500/20 hover:border-purple-500/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Shopping Bag</p>
              <p className="text-sm font-bold text-white">{itemCount} Items Ready</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </Link>

      </div>

      {/* Admin Shortcuts if Admin */}
      {isAdmin && (
        <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Administrative Privileges</span>
            </div>
            <Link
              to="/admin"
              className="btn-primary text-xs py-2 px-4 bg-gradient-to-r from-amber-600 to-orange-600 shadow-amber-600/30"
            >
              Open Admin Dashboard
            </Link>
          </div>
          <p className="text-xs text-slate-300">
            You have full access to manage products, view and update customer orders, view registered users, and moderate reviews.
          </p>
        </div>
      )}

    </div>
  );
};
