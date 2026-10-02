import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types';
import { cartApi } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  loading: boolean;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toastMessage: string | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const data = await cartApi.getCart();
      setCart(data.cart || []);
    } catch (err) {
      console.warn('Error loading cart from server, using local state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = async (product: Product, quantity = 1, size?: string, color?: string) => {
    try {
      const chosenSize = size || product.sizes[0] || 'Standard';
      const chosenColor = color || product.colors[0] || 'Default';
      const data = await cartApi.addToCart(product.id, quantity, chosenSize, chosenColor);
      setCart(data.cart);
      triggerToast(`Added "${product.name}" to your bag!`);
    } catch (err) {
      // Local fallback
      setCart(prev => {
        const existingIdx = prev.findIndex(item => item.productId === product.id && item.size === size);
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          return updated;
        }
        return [...prev, {
          id: `cart_${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          size: size || product.sizes[0],
          color: color || product.colors[0]
        }];
      });
      triggerToast(`Added "${product.name}" to your bag!`);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const data = await cartApi.updateQuantity(cartItemId, quantity);
      setCart(data.cart);
    } catch (err) {
      setCart(prev => {
        if (quantity <= 0) return prev.filter(item => item.id !== cartItemId);
        return prev.map(item => item.id === cartItemId ? { ...item, quantity } : item);
      });
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const data = await cartApi.removeFromCart(cartItemId);
      setCart(data.cart);
      triggerToast('Item removed from cart');
    } catch (err) {
      setCart(prev => prev.filter(item => item.id !== cartItemId));
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCart([]);
    } catch (err) {
      setCart([]);
    }
  };

  const clearToast = () => setToastMessage(null);

  // Calculations
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const originalSubtotal = cart.reduce((sum, item) => sum + (item.product?.originalPrice || item.product?.price || 0) * item.quantity, 0);
  const discount = Math.max(0, originalSubtotal - subtotal);
  const shippingFee = subtotal > 1500 || subtotal === 0 ? 0 : 99; // Free shipping above ₹1500
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        total,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toastMessage,
        clearToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
