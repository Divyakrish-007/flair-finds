import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Send, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0A0A14] border-t border-purple-500/15 text-slate-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-purple-500/10">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/10">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">AI Smart Recommendations</h4>
              <p className="text-xs text-slate-400">Tailored outfits fitted to your personal taste</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/10">
            <div className="w-12 h-12 rounded-xl bg-pink-600/20 flex items-center justify-center text-pink-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Verified Sources</h4>
              <p className="text-xs text-slate-400">Curated from Amazon, Flipkart, Meesho & more</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/10">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Free Express Delivery</h4>
              <p className="text-xs text-slate-400">On all eligible orders above ₹1,500</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400">7-day easy exchange & refund policy</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-purple-500/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-serif text-white">
                FLAIR <span className="gradient-text">FINDS</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Flair Finds is your intelligent fashion discovery ecosystem. We unite top fashion catalogs across leading marketplaces into one seamless AI-guided shopping experience.
            </p>

            {/* Platform Badges */}
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-wider text-purple-300 font-semibold mb-2">Integrated Platforms</p>
              <div className="flex flex-wrap gap-2">
                <span className="source-amazon px-2.5 py-1 rounded-md text-xs font-medium">Amazon</span>
                <span className="source-flipkart px-2.5 py-1 rounded-md text-xs font-medium">Flipkart</span>
                <span className="source-meesho px-2.5 py-1 rounded-md text-xs font-medium">Meesho</span>
                <span className="source-snapdeal px-2.5 py-1 rounded-md text-xs font-medium">Snapdeal</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop?category=Dresses" className="hover:text-purple-400 transition-colors">Dresses & Gowns</Link></li>
              <li><Link to="/shop?category=Tops" className="hover:text-purple-400 transition-colors">Tops & Blouses</Link></li>
              <li><Link to="/shop?category=T-Shirts" className="hover:text-purple-400 transition-colors">Graphic & Oversized Tees</Link></li>
              <li><Link to="/shop?category=Shirts" className="hover:text-purple-400 transition-colors">Linen & Oxford Shirts</Link></li>
              <li><Link to="/shop?category=Jeans" className="hover:text-purple-400 transition-colors">Denim & Cargo Jeans</Link></li>
              <li><Link to="/shop?category=Shoes" className="hover:text-purple-400 transition-colors">Sneakers, Boots & Heels</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-purple-400 transition-colors">Watches & Jewellery</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Discovery</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/ai-stylist" className="text-pink-400 hover:text-pink-300 transition-colors font-medium flex items-center gap-1"><Sparkles className="w-3 h-3" /> Flair AI Stylist</Link></li>
              <li><Link to="/shop?trending=true" className="hover:text-purple-400 transition-colors">Trending Fashion Picks</Link></li>
              <li><Link to="/shop?featured=true" className="hover:text-purple-400 transition-colors">Editor's Choice</Link></li>
              <li><Link to="/wishlist" className="hover:text-purple-400 transition-colors">My Wishlist</Link></li>
              <li><Link to="/orders" className="hover:text-purple-400 transition-colors">Order Status & Tracking</Link></li>
              <li><Link to="/admin" className="text-amber-400/80 hover:text-amber-300 transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Stay Stylish</h3>
            <p className="text-xs text-slate-400 mb-3">Get VIP drop alerts and AI style tips in your inbox.</p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <span>🎉 You are on the Flair Finds VIP List!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#1A1A2E] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-purple-500/25 focus:border-purple-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full btn-primary text-xs justify-center py-2 shadow-md shadow-purple-600/20"
                >
                  <Send className="w-3 h-3" /> Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Flair Finds. "Find Your Style. Find Your Flair." All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for fashion lovers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
