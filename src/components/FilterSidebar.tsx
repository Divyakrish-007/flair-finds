import React from 'react';
import { Filter, RotateCcw, Star, X } from 'lucide-react';
import { ProductCategory, Gender, PlatformSource } from '../types';

interface FilterSidebarProps {
  selectedCategories: ProductCategory[];
  onToggleCategory: (category: ProductCategory) => void;
  selectedGenders: Gender[];
  onToggleGender: (gender: Gender) => void;
  selectedPriceRange: string;
  onSelectPriceRange: (range: string) => void;
  minRating: number | null;
  onSelectRating: (rating: number | null) => void;
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  availableBrands: string[];
  selectedSources: PlatformSource[];
  onToggleSource: (source: PlatformSource) => void;
  onClearFilters: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategories,
  onToggleCategory,
  selectedGenders,
  onToggleGender,
  selectedPriceRange,
  onSelectPriceRange,
  minRating,
  onSelectRating,
  selectedBrands,
  onToggleBrand,
  availableBrands,
  selectedSources,
  onToggleSource,
  onClearFilters,
  isMobileDrawer,
  onCloseMobileDrawer
}) => {
  const categories: ProductCategory[] = [
    'Dresses',
    'Tops',
    'Shirts',
    'T-Shirts',
    'Jeans',
    'Trousers',
    'Shoes',
    'Bags',
    'Watches',
    'Jewellery',
    'Accessories'
  ];

  const genders: Gender[] = ['Women', 'Men', 'Unisex'];

  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 – ₹1,000', value: '500-1000' },
    { label: '₹1,000 – ₹2,500', value: '1000-2500' },
    { label: '₹2,500 – ₹5,000', value: '2500-5000' },
    { label: 'Above ₹5,000', value: '5000-999999' },
  ];

  const sources: PlatformSource[] = ['Amazon', 'Flipkart', 'Meesho', 'Snapdeal'];

  const totalActiveFilters = 
    selectedCategories.length +
    selectedGenders.length +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    (minRating ? 1 : 0) +
    selectedBrands.length +
    selectedSources.length;

  return (
    <div className={`space-y-6 ${isMobileDrawer ? 'p-6' : 'p-5 glass rounded-2xl border border-purple-500/20'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Filter className="w-4 h-4 text-purple-400" />
          <span>Filters</span>
          {totalActiveFilters > 0 && (
            <span className="bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {totalActiveFilters}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {totalActiveFilters > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          {isMobileDrawer && onCloseMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Category</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const checked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleCategory(cat)}
                  className="custom-checkbox"
                />
                <span className={checked ? 'text-purple-300 font-semibold' : ''}>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2.5 pt-3 border-t border-purple-500/10">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Gender</h4>
        <div className="space-y-1.5">
          {genders.map((g) => {
            const checked = selectedGenders.includes(g);
            return (
              <label
                key={g}
                className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleGender(g)}
                  className="custom-checkbox"
                />
                <span className={checked ? 'text-purple-300 font-semibold' : ''}>{g}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Ranges */}
      <div className="space-y-2.5 pt-3 border-t border-purple-500/10">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Price Range</h4>
        <div className="space-y-1.5">
          {priceRanges.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
            >
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === range.value}
                onChange={() => onSelectPriceRange(range.value)}
                className="accent-purple-600 w-4 h-4 cursor-pointer"
              />
              <span className={selectedPriceRange === range.value ? 'text-purple-300 font-semibold' : ''}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-2.5 pt-3 border-t border-purple-500/10">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Customer Rating</h4>
        <div className="space-y-1.5">
          {[4, 3].map((r) => (
            <label
              key={r}
              className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
            >
              <input
                type="radio"
                name="minRating"
                checked={minRating === r}
                onChange={() => onSelectRating(minRating === r ? null : r)}
                className="accent-purple-600 w-4 h-4 cursor-pointer"
              />
              <div className="flex items-center gap-1">
                <span>{r}★ & above</span>
                <div className="flex text-amber-400">
                  {Array.from({ length: r }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
            </label>
          ))}
          {minRating && (
            <button
              onClick={() => onSelectRating(null)}
              className="text-[11px] text-purple-400 hover:underline pt-1 block"
            >
              Clear rating filter
            </button>
          )}
        </div>
      </div>

      {/* Sources */}
      <div className="space-y-2.5 pt-3 border-t border-purple-500/10">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Platform Source</h4>
        <div className="space-y-1.5">
          {sources.map((s) => {
            const checked = selectedSources.includes(s);
            return (
              <label
                key={s}
                className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleSource(s)}
                  className="custom-checkbox"
                />
                <span className={checked ? 'text-purple-300 font-semibold' : ''}>{s}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      {availableBrands && availableBrands.length > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-purple-500/10">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Brands</h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {availableBrands.map((b) => {
              const checked = selectedBrands.includes(b);
              return (
                <label
                  key={b}
                  className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleBrand(b)}
                    className="custom-checkbox"
                  />
                  <span className={checked ? 'text-purple-300 font-semibold' : ''}>{b}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
