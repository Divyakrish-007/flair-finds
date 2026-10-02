import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  ArrowRight,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { ordersApi } from '../services/api';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersApi.getOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-purple-600 border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xs text-purple-300">Retrieving your order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Orders Found</h2>
        <p className="text-xs text-slate-400">You haven't placed any orders yet. Ready to find your flair?</p>
        <Link to="/shop" className="btn-primary inline-flex text-xs">
          Explore Fashion Catalog
        </Link>
      </div>
    );
  }

  const steps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-purple-500/15">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          My Order History <span className="text-purple-400 text-lg font-normal">({orders.length})</span>
        </h1>
        <p className="text-xs text-slate-400">Track current shipments and view previous receipts</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const currentStep = getStatusStepIndex(order.status);

          return (
            <div
              key={order.id}
              className="glass bg-[#1A1A2E]/80 border border-purple-500/20 rounded-3xl p-6 shadow-xl space-y-6"
            >
              {/* Order Header Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-purple-500/15 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white font-mono">{order.id}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      order.status === 'Processing' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Payment: {order.paymentMethod}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Total Paid</p>
                  <p className="text-lg font-bold text-emerald-400">
                    ₹{order.total.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Status Tracker Progress Bar */}
              {order.status !== 'Cancelled' && (
                <div className="py-2">
                  <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                    {/* Background line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-purple-950 -translate-y-1/2 z-0"></div>
                    
                    {/* Active line */}
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-1.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                              : 'bg-[#0F0F1A] border border-purple-500/30 text-slate-500'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] font-semibold ${
                            isCompleted ? 'text-white' : 'text-slate-500'
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {order.trackingNumber && (
                    <p className="text-center text-[10px] text-purple-300 mt-4">
                      Courier Tracking: <span className="font-mono font-bold text-white">{order.trackingNumber}</span> (Express Surface)
                    </p>
                  )}
                </div>
              )}

              {/* Items List in Order */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ordered Items ({order.items?.length || 0})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-[#0F0F1A]/80 border border-purple-500/15"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-14 h-16 object-cover rounded-xl bg-slate-900 border border-purple-500/20 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] uppercase tracking-wider text-purple-400 font-semibold">
                          Via {item.source}
                        </span>
                        <p className="text-xs font-bold text-white truncate">{item.productName}</p>
                        <p className="text-[10px] text-slate-400">
                          Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}
                        </p>
                        <p className="text-xs font-bold text-emerald-400 mt-0.5">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Summary */}
              {order.shippingAddress && (
                <div className="text-xs text-slate-400 flex items-start gap-2 pt-2 border-t border-purple-500/10">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Delivering to: <strong className="text-slate-200">{order.shippingAddress.fullName}</strong>, {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode} (Ph: {order.shippingAddress.phone})
                  </span>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};
