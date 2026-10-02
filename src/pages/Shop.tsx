import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  ShoppingBag, 
  Sparkles, 
  RotateCcw,
  PackageOpen
} from 'lucide-react';
import { Product, ProductCategory, Gender, PlatformSource } from '../types';
import { productsApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
    searchParams.get('category') ? (searchParams.get('category')!.split(',') as ProductCategory[]) : []
  );
  const [selectedGenders, setSelectedGenders] = useState<Gender[]>(
    searchParams.get('gender') ? (searchParams.get('gender')!.split(',') as Gender[]) : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<PlatformSource[]>([]);
  const [sortBy, setSortBy] = useState<string>('recommended');

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Synchronize URL query params with state on load
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);

    const cat = searchParams.get('category');
    if (cat) setSelectedCategories(cat.split(',') as ProductCategory[]);

    const trending = searchParams.get('trending');
    const featured = searchParams.get('featured');
    if (trending === 'true') setSortBy('recommended');
  }, [searchParams]);

  // Fetch Products whenever filters or sorting changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          sortBy,
        };

        if (searchQuery.trim()) params.q = searchQuery.trim();
        if (selectedCategories.length > 0) params.category = selectedCategories.join(',');
        if (selectedGenders.length > 0) params.gender = selectedGenders.join(',');
        if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');
        if (selectedSources.length > 0) params.source = selectedSources.join(',');
        if (minRating) params.minRating = minRating;

        if (selectedPriceRange !== 'all') {
          const [min, max] = selectedPriceRange.split('-');
          if (min) params.minPrice = min;
          if (max) params.maxPrice = max;
        }

        const data = await productsApi.getProducts(params);
        setProducts(data.products || []);
        setTotalCount(data.count || 0);
        if (data.facets?.brands) {
          setAvailableBrands(data.facets.brands);
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [
    searchQuery,
    selectedCategories,
    selectedGenders,
    selectedPriceRange,
    minRating,
    selectedBrands,
    selectedSources,
    sortBy
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchQuery.trim()) {
        prev.set('q', searchQuery.trim());
      } else {
        prev.delete('q');
      }
      return prev;
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams(prev => {
      prev.delete('q');
      return prev;
    });
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedPriceRange('all');
    setMinRating(null);
    setSelectedBrands([]);
    setSelectedSources([]);
    setSortBy('recommended');
    setSearchParams({});
  };

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleGender = (g: Gender) => {
    setSelectedGenders(prev =>
      prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]
    );
  };

  const toggleBrand = (b: string) => {
    setSelectedBrands(prev =>
      prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]
    );
  };

  const toggleSource = (s: PlatformSource) => {
    setSelectedSources(prev =>
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            Fashion Catalog <span className="gradient-text font-serif italic">Flair Finds</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing <strong className="text-purple-300">{totalCount}</strong> styles across top fashion brands & marketplaces
          </p>
        </div>

        {/* Search Input in Top Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, brand, color, occasion, or 'dress under 2000'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A2E] text-xs text-white placeholder-slate-400 pl-9 pr-8 py-2.5 rounded-xl border border-purple-500/25 focus:border-purple-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="btn-primary text-xs py-2.5 px-4">
            Search
          </button>
        </form>
      </div>

      {/* Control Bar: Active filters, Sorting, Mobile Filter Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1A1A2E]/50 p-3 rounded-2xl border border-purple-500/15 text-xs">
        
        {/* Left: Mobile Toggle & Active Tag Count */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 text-purple-300 rounded-lg border border-purple-500/30 font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {(searchQuery || selectedCategories.length > 0 || selectedGenders.length > 0 || selectedPriceRange !== 'all' || minRating || selectedBrands.length > 0 || selectedSources.length > 0) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 hidden sm:inline">Active Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 text-[11px]">
                  "{searchQuery}"
                  <button onClick={handleClearSearch}><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedCategories.map(cat => (
                <span key={cat} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 text-[11px]">
                  {cat}
                  <button onClick={() => toggleCategory(cat)}><X className="w-3 h-3" /></button>
                </span>
              ))}

              <button
                onClick={handleClearAllFilters}
                className="text-[11px] text-pink-400 hover:text-pink-300 underline font-medium ml-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Right: Sorting Selector */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0F0F1A] text-xs text-white px-3 py-1.5 rounded-xl border border-purple-500/30 outline-none cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
            <option value="newest">Newest Arrivals</option>
            <option value="discount">Biggest Discount %</option>
          </select>
        </div>

      </div>

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar (3 cols) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <FilterSidebar
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            selectedGenders={selectedGenders}
            onToggleGender={toggleGender}
            selectedPriceRange={selectedPriceRange}
            onSelectPriceRange={setSelectedPriceRange}
            minRating={minRating}
            onSelectRating={setMinRating}
            selectedBrands={selectedBrands}
            onToggleBrand={toggleBrand}
            availableBrands={availableBrands}
            selectedSources={selectedSources}
            onToggleSource={toggleSource}
            onClearFilters={handleClearAllFilters}
          />
        </div>

        {/* Product Grid (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {loading ? (
            <ProductGridSkeleton count={9} />
          ) : products.length === 0 ? (
            /* No Products Found Empty State */
            <div className="p-12 text-center rounded-3xl glass bg-[#1A1A2E]/50 border border-purple-500/20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-600/15 flex items-center justify-center text-purple-400 mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                We couldn't find any fashion items matching your criteria. Try adjusting your search query, removing active filters, or clearing your search.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="btn-primary text-xs font-semibold py-2 px-5 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-[#121224] shadow-2xl overflow-y-auto z-10">
            <FilterSidebar
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              selectedGenders={selectedGenders}
              onToggleGender={toggleGender}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
              minRating={minRating}
              onSelectRating={setMinRating}
              selectedBrands={selectedBrands}
              onToggleBrand={toggleBrand}
              availableBrands={availableBrands}
              selectedSources={selectedSources}
              onToggleSource={toggleSource}
              onClearFilters={handleClearAllFilters}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
