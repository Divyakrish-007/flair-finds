import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { AdminStats } from '../../types';
import { adminApi } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data.stats);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-purple-300">
        Loading management analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard Overview</h1>
        <p className="text-xs text-slate-400">Live store metrics and category distribution across integrated sources</p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl glass bg-[#1A1A2E]/80 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            ₹{stats?.totalRevenue.toLocaleString('en-IN') || 0}
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% from last month
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl glass bg-[#1A1A2E]/80 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            {stats?.totalOrders || 0}
          </p>
          <p className="text-[10px] text-purple-300">Active fulfillments</p>
        </div>

        {/* Total Products */}
        <div className="p-5 rounded-2xl glass bg-[#1A1A2E]/80 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Live Products</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            {stats?.totalProducts || 0}
          </p>
          <p className="text-[10px] text-blue-300">Across 4 platforms</p>
        </div>

        {/* Total Users */}
        <div className="p-5 rounded-2xl glass bg-[#1A1A2E]/80 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Registered Users</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            {stats?.totalUsers || 0}
          </p>
          <p className="text-[10px] text-pink-300">Active accounts</p>
        </div>

      </div>

      {/* Grid: Popular Categories & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Popular Categories (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass bg-[#1A1A2E]/80 border border-purple-500/20 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Category Performance</span>
          </h2>

          <div className="space-y-3">
            {stats?.popularCategories.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{cat.category}</span>
                  <span className="text-purple-300">{cat.count} items ({cat.revenue > 0 ? `₹${cat.revenue.toLocaleString('en-IN')}` : 'In Stock'})</span>
                </div>
                <div className="w-full bg-[#0F0F1A] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (cat.count / (stats.totalProducts || 1)) * 100 * 2.5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass bg-[#1A1A2E]/80 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-pink-400" />
              <span>Recent Customer Orders</span>
            </h2>
            <Link to="/admin/orders" className="text-xs text-purple-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-2xl bg-[#0F0F1A]/80 border border-purple-500/10 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{ord.id}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      ord.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300' :
                      ord.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-purple-500/20 text-purple-300'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {ord.shippingAddress?.fullName} • {new Date(ord.date).toLocaleDateString()}
                  </p>
                </div>

                <span className="font-bold text-emerald-400 text-sm">
                  ₹{ord.total.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
