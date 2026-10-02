import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ShoppingBag, 
  Check, 
  RefreshCw, 
  Layers, 
  Palette, 
  IndianRupee,
  Compass,
  ArrowRight
} from 'lucide-react';
import { OutfitRecommendation, Product } from '../types';
import { aiApi } from '../services/api';
import { useCart } from '../context/CartContext';

interface OutfitBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutfitBuilderModal: React.FC<OutfitBuilderModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();

  const [gender, setGender] = useState<'Women' | 'Men'>('Women');
  const [occasion, setOccasion] = useState('College');
  const [style, setStyle] = useState('Casual');
  const [budget, setBudget] = useState(4500);
  const [preferredColor, setPreferredColor] = useState('Black');
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState<OutfitRecommendation | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const occasions = ['College', 'Party Wear', 'Casual Outing', 'Formal / Office', 'Date Night', 'Vacation', 'Festive / Wedding'];
  const styles = ['Casual', 'Streetwear', 'Chic & Minimal', 'Elegant Glam', 'Bohemian', 'Smart Formal'];
  const colors = ['Black', 'White', 'Navy Blue', 'Emerald Green', 'Lavender', 'Rose Pink', 'Mocha Tan', 'Gold'];

  const handleGenerateOutfit = async () => {
    setLoading(true);
    setAddedSuccess(false);
    try {
      const data = await aiApi.buildOutfit({
        gender,
        occasion,
        style,
        budget,
        preferredColor
      });
      setOutfit(data.recommendation);
    } catch (err) {
      console.error('Error generating outfit:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = async () => {
    if (!outfit) return;
    const items = Object.values(outfit.items).filter((p): p is Product => Boolean(p));
    for (const item of items) {
      await addToCart(item, 1);
    }
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-overlay p-4">
      <div className="modal-content max-w-3xl w-full bg-[#121224] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-[#1A1A2E] to-purple-950 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Compass className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Build My Outfit <span className="gradient-text font-serif italic">By Flair AI</span>
              </h2>
              <p className="text-xs text-purple-300">Curate a synchronized 4-piece look in seconds</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#1A1A2E]/70 p-4 rounded-2xl border border-purple-500/15">
            
            {/* Gender Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Target Wardrobe</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Women', 'Men'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      gender === g
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-[#0F0F1A] text-slate-400 border-purple-500/20 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Occasion / Event</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-[#0F0F1A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-purple-500/30 outline-none"
              >
                {occasions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Style Vibe */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Style Aesthetic</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-[#0F0F1A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-purple-500/30 outline-none"
              >
                {styles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Preferred Accent Color */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Dominant / Accent Color</label>
              <select
                value={preferredColor}
                onChange={(e) => setPreferredColor(e.target.value)}
                className="w-full bg-[#0F0F1A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-purple-500/30 outline-none"
              >
                {colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div className="md:col-span-2 pt-2">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-300">Outfit Budget Limit</span>
                <span className="font-bold text-emerald-400">₹{budget.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1500"
                max="12000"
                step="500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Budget (₹1.5k)</span>
                <span>Mid-Range (₹6k)</span>
                <span>Luxury (₹12k)</span>
              </div>
            </div>

          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateOutfit}
            disabled={loading}
            className="w-full btn-primary justify-center py-3 text-sm font-bold shadow-lg shadow-purple-600/30"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
            <span>{loading ? 'Styling Your Look...' : 'Generate Personalized Outfit Look'}</span>
          </button>

          {/* Generated Look Result */}
          {outfit && (
            <div className="space-y-4 pt-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Your Recommended {outfit.occasion} Look</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                      {outfit.style}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Curated pieces with color synchronization</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Complete Look Price</p>
                  <p className="text-base font-bold text-emerald-400">
                    ₹{outfit.totalPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* 4-Item Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(outfit.items).map(([slot, item]) => {
                  if (!item) return null;
                  return (
                    <div
                      key={slot}
                      className="bg-[#1A1A2E] rounded-xl p-2.5 border border-purple-500/20 flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-900 mb-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-purple-400 font-bold block mb-0.5">
                          {slot}
                        </span>
                        <p className="text-xs font-semibold text-white line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.brand}</p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-purple-500/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-300">
                          {item.source}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Styling Tips */}
              {outfit.stylingTips && (
                <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-1.5">
                  <p className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    Flair AI Styling Notes:
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                    {outfit.stylingTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add Entire Outfit to Cart */}
              <button
                onClick={handleAddAllToCart}
                disabled={addedSuccess}
                className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white hover:opacity-95 shadow-emerald-500/30'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Entire Outfit Added to Your Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add Entire Outfit to Bag (₹{outfit.totalPrice.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
