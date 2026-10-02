import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  ArrowLeft, 
  Shield, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const links = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Product Catalog', path: '/admin/products', icon: Package },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Registered Users', path: '/admin/users', icon: Users },
    { name: 'Review Moderation', path: '/admin/reviews', icon: MessageSquare },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0F0F1A] border-b md:border-b-0 md:border-r border-purple-500/15 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          
          {/* Admin Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white">FLAIR ADMIN</span>
            </div>
            <p className="text-[10px] text-amber-300">Management Control Center</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`sidebar-link ${active ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Return to Store button */}
        <div className="pt-6 border-t border-purple-500/15 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-purple-300 hover:text-white p-2.5 rounded-xl hover:bg-purple-950/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
          <div className="text-[10px] text-slate-500 px-2">
            Logged in as: <span className="text-slate-300">{user?.name || 'Admin'}</span>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>

    </div>
  );
};
