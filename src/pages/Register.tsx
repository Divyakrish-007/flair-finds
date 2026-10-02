import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError(null);
    setLoading(true);

    const res = await register(name, email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass bg-[#121224] p-8 rounded-3xl border border-purple-500/25 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
          <p className="text-xs text-purple-300">Join Flair Finds & unlock AI styling intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-10 text-xs"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

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
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 text-xs"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-purple-500/10">
          <span>Already have an account? </span>
          <Link to="/login" className="text-purple-400 hover:underline font-semibold">
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
};
