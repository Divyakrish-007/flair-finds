import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../services/api';
import { PaymentMethod, Order } from '../types';

export const Checkout: React.FC = () => {
  const { cart, subtotal, discount, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || 'Priya Sharma');
  const [email, setEmail] = useState(user?.email || 'user@flairfinds.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Flat 402, Sunshine Heights, Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8910');

  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-slate-400">Add products to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="btn-primary inline-flex text-xs">
          Explore Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !address || !pincode || !phone) {
      setError('Please fill in all shipping address fields.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        source: item.product.source,
      }));

      const payload = {
        items: orderItems,
        shippingAddress: {
          fullName,
          email,
          phone,
          address,
          city,
          state,
          pincode,
        },
        paymentMethod,
        subtotal,
        discount,
        shippingFee,
        total,
      };

      const data = await ordersApi.checkout(payload);
      setConfirmedOrder(data.order);
      await clearCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Checkout Success Modal / View */}
      {confirmedOrder ? (
        <div className="max-w-xl mx-auto p-8 rounded-3xl glass bg-[#121224] border border-emerald-500/30 text-center space-y-6 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-purple-400 font-bold">Flair Finds Demo Order</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order Placed Successfully!</h1>
            <p className="text-xs text-slate-300">
              Your mock order has been confirmed. A confirmation has been registered in the database.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A2E] border border-purple-500/15 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Order ID:</span>
              <strong className="text-purple-300 font-mono">{confirmedOrder.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Order Date:</span>
              <span className="text-white">{new Date(confirmedOrder.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Method:</span>
              <span className="text-white">{confirmedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tracking Code:</span>
              <span className="text-emerald-400 font-mono">{confirmedOrder.trackingNumber}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-purple-500/10 text-sm font-bold">
              <span className="text-white">Total Amount:</span>
              <span className="text-emerald-400">₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="btn-primary text-xs py-3 justify-center flex-1"
            >
              <Truck className="w-4 h-4" />
              <span>Track in My Orders</span>
            </button>
            <Link
              to="/shop"
              className="btn-secondary text-xs py-3 justify-center flex-1"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="pb-4 border-b border-purple-500/15">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Mock Checkout</h1>
            <p className="text-xs text-slate-400">Complete your simulated order with zero real payments</p>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Shipping & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shipping Address */}
              <div className="p-6 rounded-3xl glass bg-[#1A1A2E]/80 border border-purple-500/20 space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-400" />
                  <span>1. Delivery Shipping Address</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-300 block mb-1 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-300 block mb-1 font-medium">Street Address / Apartment</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-300 block mb-1 font-medium">Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-6 rounded-3xl glass bg-[#1A1A2E]/80 border border-purple-500/20 space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-pink-400" />
                  <span>2. Payment Option (Demo Mock Payment)</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['UPI', 'Card', 'Cash on Delivery'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3.5 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === method
                          ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                          : 'bg-[#0F0F1A] border-purple-500/15 text-slate-400 hover:text-white'
                      }`}
                    >
                      {method === 'UPI' && <Smartphone className="w-5 h-5 text-emerald-400" />}
                      {method === 'Card' && <CreditCard className="w-5 h-5 text-purple-400" />}
                      {method === 'Cash on Delivery' && <Banknote className="w-5 h-5 text-amber-400" />}
                      <span>{method}</span>
                    </button>
                  ))}
                </div>

                {/* Subform for UPI */}
                {paymentMethod === 'UPI' && (
                  <div className="p-3 bg-[#0F0F1A] rounded-xl border border-purple-500/15 space-y-1 text-xs">
                    <label className="text-slate-300 font-medium">Virtual UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="input-field text-xs"
                      placeholder="username@bank"
                    />
                  </div>
                )}

                {/* Subform for Card */}
                {paymentMethod === 'Card' && (
                  <div className="p-3 bg-[#0F0F1A] rounded-xl border border-purple-500/15 space-y-2 text-xs">
                    <div>
                      <label className="text-slate-300 font-medium">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'Cash on Delivery' && (
                  <p className="text-[11px] text-slate-400 bg-purple-950/20 p-2.5 rounded-xl border border-purple-500/15">
                    💵 Pay in cash or via QR code upon parcel arrival.
                  </p>
                )}
              </div>

              {error && <p className="text-xs text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-500/30">{error}</p>}
            </div>

            {/* Right: Order Summary & Trigger (5 cols) */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="glass bg-[#1A1A2E]/90 p-6 rounded-3xl border border-purple-500/25 shadow-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-purple-400" />
                  <span>Order Items ({cart.length})</span>
                </h3>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded-lg bg-slate-900 border border-purple-500/20"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{item.product.name}</p>
                        <p className="text-[10px] text-slate-400">
                          Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}
                        </p>
                        <p className="text-[10px] text-purple-300">Via {item.product.source}</p>
                      </div>
                      <span className="font-bold text-emerald-400">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-purple-500/15 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>- ₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-400">Free</strong> : `₹${shippingFee}`}</span>
                  </div>
                  <div className="pt-2 border-t border-purple-500/15 flex justify-between text-base font-bold text-white">
                    <span>Total Amount</span>
                    <span className="text-emerald-400">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary justify-center py-3.5 text-sm font-bold shadow-xl shadow-purple-600/40"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Processing Order...' : `Place Mock Order (₹${total.toLocaleString('en-IN')})`}</span>
                </button>

                <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Safe Demo Environment. No real charges.</span>
                </div>
              </div>
            </div>

          </form>
        </>
      )}

    </div>
  );
};
