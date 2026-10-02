import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, Check, MapPin, Search } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { adminApi } from '../../services/api';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await adminApi.getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const data = await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
      setToast(`Order ${orderId} updated to ${newStatus}`);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      alert('Error updating status');
    }
  };

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-slide-left">
          <Check className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-purple-500/15">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          Customer Orders Management <span className="text-purple-400 text-base font-normal">({orders.length})</span>
        </h1>
        <p className="text-xs text-slate-400">View real-time customer purchases and advance order dispatch statuses</p>
      </div>

      {/* Search */}
      <div className="max-w-md relative">
        <input
          type="text"
          placeholder="Filter by Order ID, Customer name or Status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A1A2E] text-xs text-white placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-purple-500/25 outline-none"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Orders List / Table */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className="glass bg-[#121224]/80 p-5 rounded-3xl border border-purple-500/20 shadow-xl space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-purple-500/10 gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white text-sm">{ord.id}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(ord.date).toLocaleDateString()} • {new Date(ord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-purple-300 font-semibold mt-0.5">
                  Buyer: {ord.shippingAddress?.fullName} ({ord.shippingAddress?.email})
                </p>
              </div>

              {/* Status Update Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Fulfillment Status:</span>
                <select
                  value={ord.status}
                  onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                    ord.status === 'Delivered' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' :
                    ord.status === 'Shipped' ? 'bg-blue-950/60 border-blue-500 text-blue-300' :
                    ord.status === 'Processing' ? 'bg-amber-950/60 border-amber-500 text-amber-300' :
                    'bg-purple-950/60 border-purple-500 text-purple-300'
                  }`}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ord.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0F0F1A] border border-purple-500/10 text-xs">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-10 h-12 object-cover rounded-lg bg-slate-900 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold truncate">{item.productName}</p>
                    <p className="text-[10px] text-slate-400">
                      Qty: {item.quantity} {item.size ? `| ${item.size}` : ''} ({item.source})
                    </p>
                    <p className="text-xs font-bold text-emerald-400">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Address & Total Amount */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-purple-500/10 text-xs gap-2">
              <div className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span>
                  {ord.shippingAddress?.address}, {ord.shippingAddress?.city} - {ord.shippingAddress?.pincode}
                </span>
              </div>
              <div className="font-bold text-sm text-white">
                Total: <span className="text-emerald-400">₹{ord.total.toLocaleString('en-IN')}</span> ({ord.paymentMethod})
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
