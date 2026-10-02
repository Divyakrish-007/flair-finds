import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIChatbot } from './components/AIChatbot';
import { OutfitBuilderModal } from './components/OutfitBuilderModal';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';
import { Orders } from './pages/Orders';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { AIAssistantPage } from './pages/AIAssistantPage';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminReviews } from './pages/admin/AdminReviews';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState(false);
  const { toastMessage, clearToast } = useCart();

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-white">
      
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl glass bg-[#121224]/95 border border-purple-500/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 animate-slide-left">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
          <span>{toastMessage}</span>
          <button onClick={clearToast} className="text-slate-400 hover:text-white text-sm ml-2">✕</button>
        </div>
      )}

      {/* Outfit Builder Modal */}
      <OutfitBuilderModal
        isOpen={isOutfitModalOpen}
        onClose={() => setIsOutfitModalOpen(false)}
      />

      {/* Customer Navbar */}
      {!isAdminRoute && (
        <Navbar onOpenOutfitBuilder={() => setIsOutfitModalOpen(true)} />
      )}

      {/* Main Routed Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenOutfitBuilder={() => setIsOutfitModalOpen(true)} />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai-stylist" element={<AIAssistantPage onOpenOutfitBuilder={() => setIsOutfitModalOpen(true)} />} />

          {/* Admin Nested Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Routes>
      </main>

      {/* Floating AI Chatbot on Customer pages */}
      {!isAdminRoute && (
        <AIChatbot onOpenOutfitBuilder={() => setIsOutfitModalOpen(true)} />
      )}

      {/* Footer on Customer pages */}
      {!isAdminRoute && <Footer />}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
