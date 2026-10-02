import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="product-card flex flex-col justify-between h-[360px] p-3 animate-pulse">
      <div className="w-full aspect-[3/4] bg-purple-950/30 rounded-lg skeleton mb-3"></div>
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-purple-950/40 rounded skeleton"></div>
        <div className="h-4 w-4/5 bg-purple-950/40 rounded skeleton"></div>
        <div className="h-3 w-1/4 bg-purple-950/40 rounded skeleton"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-1/3 bg-purple-950/40 rounded skeleton"></div>
          <div className="h-8 w-8 rounded-xl bg-purple-950/40 skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
