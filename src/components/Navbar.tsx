import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Search, 
  Menu, 
  X, 
  Bot, 
  Shield, 
  LogOut,
  ChevronDown,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  onOpenOutfitBuilder?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOutfitBuilder }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass border-b border-purple-500/20 bg-[#0F0F1A]/90 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-purple-900/60 py-1 px-4 text-center text-xs text-purple-200 border-b border-purple-500/10 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
        <span>Use code <strong>FLAIR50</strong> for up to 50% OFF | Free shipping on orders over ₹1,500</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-serif tracking-tight text-white flex items-center gap-1">
                FLAIR <span className="gradient-text">FINDS</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-purple-300 font-medium">
                Find Your Style. Find Your Flair.
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              placeholder="Search dresses, Nike shoes, oversized tees, party wear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A2E]/80 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-10 py-2 rounded-full border border-purple-500/25 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </form>

          {/* Nav Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link 
              to="/" 
              className={`transition-colors hover:text-purple-400 ${isActive('/') ? 'text-purple-400 font-semibold' : 'text-slate-300'}`}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`transition-colors hover:text-purple-400 ${isActive('/shop') ? 'text-purple-400 font-semibold' : 'text-slate-300'}`}
            >
              Shop
            </Link>
            <Link 
              to="/ai-stylist" 
              className={`flex items-center gap-1.5 transition-colors hover:text-pink-400 ${isActive('/ai-stylist') ? 'text-pink-400 font-semibold' : 'text-slate-300'}`}
            >
              <Bot className="w-4 h-4 text-pink-400 animate-bounce" />
              <span>AI Assistant</span>
            </Link>
            {onOpenOutfitBuilder && (
              <button
                onClick={onOpenOutfitBuilder}
                className="flex items-center gap-1.5 text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-full hover:bg-purple-500/25 transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Build Outfit</span>
              </button>
            )}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="relative p-2 rounded-full hover:bg-purple-500/10 text-slate-300 hover:text-pink-400 transition-colors"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-pink-500 fill-pink-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 rounded-full hover:bg-purple-500/10 text-slate-300 hover:text-purple-400 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile / Auth */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-purple-500/10 text-slate-300 hover:text-white border border-purple-500/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 glass bg-[#1A1A2E] border border-purple-500/20 rounded-xl shadow-2xl py-2 z-50 animate-fade-in"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-purple-500/10">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-purple-400 truncate">{user?.email}</p>
                      </div>

                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-purple-500/15 hover:text-white transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                        My Profile
                      </Link>

                      <Link 
                        to="/orders" 
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-purple-500/15 hover:text-white transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                        My Orders
                      </Link>

                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          className="flex items-center gap-2 px-4 py-2 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors font-medium border-t border-purple-500/10 mt-1 pt-2"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left border-t border-purple-500/10 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-500/40 text-purple-300 hover:bg-purple-500/20 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex text-xs font-semibold px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-all shadow-md shadow-purple-500/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-purple-500/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, brands, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A2E] text-sm text-slate-100 placeholder-slate-400 pl-10 pr-8 py-2 rounded-full border border-purple-500/25 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass bg-[#0F0F1A]/95 border-b border-purple-500/20 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-purple-500/15"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-purple-500/15"
          >
            Shop All Catalog
          </Link>
          <Link
            to="/ai-stylist"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-pink-400 hover:bg-pink-500/15"
          >
            <Bot className="w-5 h-5" />
            Flair AI Fashion Assistant
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-purple-500/15"
          >
            <span>My Wishlist</span>
            <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-purple-500/15"
          >
            <span>My Cart</span>
            <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{itemCount}</span>
          </Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-purple-500/20 space-y-2">
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-purple-500/15"
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-purple-500/15"
              >
                Profile Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-amber-400 font-semibold hover:bg-amber-500/15"
                >
                  Admin Control Panel
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-purple-500/20 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm font-semibold rounded-lg border border-purple-500/30 text-purple-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
