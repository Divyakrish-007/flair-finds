import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Star, Check, AlertCircle } from 'lucide-react';
import { Review } from '../../types';
import { adminApi } from '../../services/api';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const data = await adminApi.getReviews();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Delete this customer review?')) return;
    try {
      await adminApi.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      setToast('Review successfully removed from system.');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      alert('Error deleting review');
    }
  };

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
          Review Moderation <span className="text-purple-400 text-base font-normal">({reviews.length})</span>
        </h1>
        <p className="text-xs text-slate-400">Monitor customer feedback quality and remove flagged or inappropriate demo reviews</p>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-3xl glass bg-[#121224]/80 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-xs">{rev.userName}</span>
                <span className="text-[10px] text-purple-300 font-mono">Product #{rev.productId}</span>
                <span className="text-[10px] text-slate-500">{rev.date}</span>
              </div>

              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-600'}`}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <button
              onClick={() => handleDeleteReview(rev.id)}
              className="p-2.5 rounded-xl bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold flex-shrink-0"
              title="Delete Review"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
