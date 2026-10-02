import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleQuickDemo = async (role: 'admin' | 'user') => {
    setLoading(true);
    await quickLogin(role);
    setLoading(false);
    navigate(role === 'admin' ? '/admin' : from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass bg-[#121224] p-8 rounded-3xl border border-purple-500/25 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-xs text-purple-300">Sign in to your Flair Finds account</p>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="p-3.5 bg-purple-950/30 rounded-2xl border border-purple-500/20 space-y-2">
          <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Demo Login Shortcuts:</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="py-2 text-[11px] font-semibold bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white rounded-xl border border-purple-500/30 transition-all text-center"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 text-[11px] font-semibold bg-amber-500/20 hover:bg-amber-600 text-amber-300 hover:text-white rounded-xl border border-amber-500/30 transition-all text-center"
            >
              Demo Admin Panel
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10 text-xs"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 text-xs"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {error && <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3 text-sm font-bold shadow-xl shadow-purple-600/40"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-purple-500/10">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-purple-400 hover:underline font-semibold">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};
