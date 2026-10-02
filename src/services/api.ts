import axios from 'axios';
import type { Product, User, CartItem, Order, Review, AdminStats, OutfitRecommendation, AIMessage } from '../types';

const API_BASE = '/api';

// Create unique guest ID stored in localStorage if not logged in
const getGuestId = () => {
  let guestId = localStorage.getItem('flair_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('flair_guest_id', guestId);
  }
  return guestId;
};

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token and guest ID
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('flair_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-guest-id'] = getGuestId();
  config.headers['x-admin-key'] = 'demo_admin_secret'; // Fallback for seamless demo admin exploration
  return config;
});

export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },
  getCurrentUser: async (): Promise<{ user: User }> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const productsApi = {
  getProducts: async (params?: Record<string, any>): Promise<{ products: Product[]; count: number; facets: any }> => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getProductById: async (id: string): Promise<{ product: Product; similarProducts: Product[]; reviews: Review[] }> => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
};

export const cartApi = {
  getCart: async (): Promise<{ cart: CartItem[] }> => {
    const res = await api.get('/cart');
    return res.data;
  },
  addToCart: async (productId: string, quantity = 1, size?: string, color?: string): Promise<{ cart: CartItem[] }> => {
    const res = await api.post('/cart/add', { productId, quantity, size, color });
    return res.data;
  },
  updateQuantity: async (cartItemId: string, quantity: number): Promise<{ cart: CartItem[] }> => {
    const res = await api.put('/cart/update', { cartItemId, quantity });
    return res.data;
  },
  removeFromCart: async (cartItemId: string): Promise<{ cart: CartItem[] }> => {
    const res = await api.delete(`/cart/remove/${cartItemId}`);
    return res.data;
  },
  clearCart: async (): Promise<{ cart: CartItem[] }> => {
    const res = await api.delete('/cart/clear');
    return res.data;
  },
};

export const wishlistApi = {
  getWishlist: async (): Promise<{ wishlist: Product[] }> => {
    const res = await api.get('/wishlist');
    return res.data;
  },
  toggleWishlist: async (productId: string): Promise<{ inWishlist: boolean; wishlist: Product[] }> => {
    const res = await api.post('/wishlist/toggle', { productId });
    return res.data;
  },
};

export const ordersApi = {
  getOrders: async (): Promise<{ orders: Order[] }> => {
    const res = await api.get('/orders');
    return res.data;
  },
  getOrderById: async (id: string): Promise<{ order: Order }> => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  checkout: async (orderData: any): Promise<{ order: Order; message: string }> => {
    const res = await api.post('/orders/checkout', orderData);
    return res.data;
  },
};

export const reviewsApi = {
  getReviews: async (productId: string): Promise<{ reviews: Review[] }> => {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data;
  },
  addReview: async (reviewData: { productId: string; rating: number; comment: string; userName?: string }): Promise<{ review: Review }> => {
    const res = await api.post('/reviews/add', reviewData);
    return res.data;
  },
};

export const aiApi = {
  chat: async (message: string): Promise<{ text: string; recommendedProducts: Product[]; quickReplies: string[] }> => {
    const res = await api.post('/ai/chat', { message });
    return res.data;
  },
  buildOutfit: async (options: { occasion: string; style: string; budget: number; preferredColor?: string; gender?: string }): Promise<{ recommendation: OutfitRecommendation }> => {
    const res = await api.post('/ai/build-outfit', options);
    return res.data;
  },
  getRecommendations: async (options?: { viewedCategories?: string[]; recentSearchTerms?: string[] }): Promise<{ products: Product[]; title: string; type: string }> => {
    const res = await api.post('/ai/recommendations', options || {});
    return res.data;
  },
};

export const adminApi = {
  getStats: async (): Promise<{ stats: AdminStats }> => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getOrders: async (): Promise<{ orders: Order[] }> => {
    const res = await api.get('/admin/orders');
    return res.data;
  },
  updateOrderStatus: async (orderId: string, status: string): Promise<{ order: Order }> => {
    const res = await api.put(`/admin/orders/${orderId}/status`, { status });
    return res.data;
  },
  getUsers: async (): Promise<{ users: User[] }> => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  addProduct: async (productData: Partial<Product>): Promise<{ product: Product }> => {
    const res = await api.post('/admin/products', productData);
    return res.data;
  },
  updateProduct: async (id: string, updates: Partial<Product>): Promise<{ product: Product }> => {
    const res = await api.put(`/admin/products/${id}`, updates);
    return res.data;
  },
  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },
  getReviews: async (): Promise<{ reviews: Review[] }> => {
    const res = await api.get('/admin/reviews');
    return res.data;
  },
  deleteReview: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete(`/admin/reviews/${id}`);
    return res.data;
  },
};

export default api;
