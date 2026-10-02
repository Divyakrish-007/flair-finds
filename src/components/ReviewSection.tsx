import React, { useState } from 'react';
import { Star, MessageSquare, Check, User } from 'lucide-react';
import { Review } from '../types';
import { reviewsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  initialReviews,
  averageRating,
  reviewCount,
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a short review text.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await reviewsApi.addReview({
        productId,
        rating,
        comment: comment.trim(),
        userName: authorName.trim() || 'Verified Fashion Buyer',
      });

      setReviews([data.review, ...reviews]);
      setComment('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-500/15">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span>Customer Reviews & Ratings</span>
          </h3>
          <p className="text-xs text-slate-400">Verified thoughts from fashion shoppers</p>
        </div>

        <div className="flex items-center gap-3 bg-[#1A1A2E] px-4 py-2.5 rounded-2xl border border-purple-500/20">
          <span className="text-2xl font-bold text-white">{averageRating}</span>
          <div>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(averageRating) ? 'fill-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-slate-400">{reviews.length} customer ratings</p>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="p-5 rounded-2xl glass bg-[#1A1A2E]/70 border border-purple-500/20 space-y-4">
        <h4 className="text-sm font-bold text-white">Write a Customer Review</h4>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Thank you! Your verified review has been submitted and posted.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Rating Stars Selector */}
            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-semibold">Your Overall Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-500 hover:scale-125 transition-all"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-purple-300 font-semibold ml-2">
                  {rating === 5 ? '⭐⭐⭐⭐⭐ Outstanding' : rating === 4 ? '⭐⭐⭐⭐ Very Good' : rating === 3 ? '⭐⭐⭐ Average' : 'Needs Improvement'}
                </span>
              </div>
            </div>

            {/* Author Name */}
            {!user && (
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya S."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#0F0F1A] text-xs text-white px-3.5 py-2 rounded-xl border border-purple-500/20 focus:border-purple-500 outline-none"
                />
              </div>
            )}

            {/* Review Comment */}
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">Your Detailed Feedback</label>
              <textarea
                rows={3}
                placeholder="How was the fit, fabric quality, style, and finish? What occasion did you wear it to?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full bg-[#0F0F1A] text-xs text-white p-3 rounded-xl border border-purple-500/20 focus:border-purple-500 outline-none resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs font-semibold py-2 px-5"
            >
              {loading ? 'Submitting Review...' : 'Post Verified Review'}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No reviews yet for this product. Be the first to share your flair!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl bg-[#1A1A2E]/40 border border-purple-500/10 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 text-xs font-bold">
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{rev.userName}</p>
                    <p className="text-[10px] text-slate-400">{rev.date}</p>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-600'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
