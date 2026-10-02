import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import { wishlistApi } from '../services/api';
import { useCart } from './CartContext';

interface WishlistContextType {
  wishlist: Product[];
  count: number;
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  moveToCart: (product: Product) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  const fetchWishlist = async () => {
    try {
      const data = await wishlistApi.getWishlist();
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.warn('Error loading wishlist from server, using local fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    try {
      const data = await wishlistApi.toggleWishlist(product.id);
      setWishlist(data.wishlist);
    } catch (err) {
      // Local fallback
      setWishlist(prev => {
        const exists = prev.some(item => item.id === product.id);
        if (exists) {
          return prev.filter(item => item.id !== product.id);
        } else {
          return [...prev, product];
        }
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const data = await wishlistApi.toggleWishlist(productId);
      setWishlist(data.wishlist);
    } catch (err) {
      setWishlist(prev => prev.filter(item => item.id !== productId));
    }
  };

  const moveToCart = async (product: Product) => {
    await addToCart(product, 1);
    await removeFromWishlist(product.id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        count: wishlist.length,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
