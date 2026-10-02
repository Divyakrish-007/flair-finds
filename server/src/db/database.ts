import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, User, Review, Order } from '../../src/types/index.js';
import { initialProducts, initialUsers, initialReviews, initialOrders } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.resolve(DATA_DIR, 'flairfinds_db.json');

export interface DBWishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface DBCartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface DBSchema {
  users: (User & { passwordHash: string })[];
  products: Product[];
  wishlists: DBWishlistItem[];
  carts: DBCartItem[];
  orders: Order[];
  reviews: Review[];
}

class Database {
  private data: DBSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DBSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      } catch (err) {
        console.error('Error reading DB file, re-initializing from seed:', err);
      }
    }

    const initialDb: DBSchema = {
      users: initialUsers,
      products: initialProducts,
      wishlists: [
        { id: 'w_01', userId: 'usr_demo_02', productId: 'prod_001', createdAt: new Date().toISOString() },
        { id: 'w_02', userId: 'usr_demo_02', productId: 'prod_014', createdAt: new Date().toISOString() },
      ],
      carts: [
        { id: 'c_01', userId: 'usr_demo_02', productId: 'prod_005', quantity: 1, size: 'L', color: 'Onyx Black' }
      ],
      orders: initialOrders,
      reviews: initialReviews,
    };

    this.saveData(initialDb);
    return initialDb;
  }

  private saveData(data: DBSchema) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  private persist() {
    this.saveData(this.data);
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(product: Omit<Product, 'id'>): Product {
    const id = `prod_${Date.now()}`;
    const newProduct: Product = { ...product, id };
    this.data.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.persist();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      // Also cleanup wishlist and cart references
      this.data.wishlists = this.data.wishlists.filter(w => w.productId !== id);
      this.data.carts = this.data.carts.filter(c => c.productId !== id);
      this.persist();
      return true;
    }
    return false;
  }

  // --- USERS ---
  public getUsers(): (User & { passwordHash: string })[] {
    return this.data.users;
  }

  public getUserById(id: string): (User & { passwordHash: string }) | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public addUser(user: Omit<User & { passwordHash: string }, 'id'>): User {
    const id = `usr_${Date.now()}`;
    const newUser = { ...user, id, createdAt: new Date().toISOString() };
    this.data.users.push(newUser);
    this.persist();
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  // --- WISHLIST ---
  public getWishlist(userId: string): Product[] {
    const items = this.data.wishlists.filter(w => w.userId === userId);
    return items
      .map(item => this.data.products.find(p => p.id === item.productId))
      .filter((p): p is Product => Boolean(p));
  }

  public toggleWishlist(userId: string, productId: string): { inWishlist: boolean; count: number } {
    const existingIdx = this.data.wishlists.findIndex(w => w.userId === userId && w.productId === productId);
    let inWishlist = false;

    if (existingIdx !== -1) {
      this.data.wishlists.splice(existingIdx, 1);
      inWishlist = false;
    } else {
      this.data.wishlists.push({
        id: `w_${Date.now()}`,
        userId,
        productId,
        createdAt: new Date().toISOString()
      });
      inWishlist = true;
    }

    this.persist();
    const count = this.data.wishlists.filter(w => w.userId === userId).length;
    return { inWishlist, count };
  }

  // --- CART ---
  public getCart(userId: string) {
    const items = this.data.carts.filter(c => c.userId === userId);
    return items
      .map(item => {
        const product = this.data.products.find(p => p.id === item.productId);
        if (!product) return null;
        return {
          id: item.id,
          productId: item.productId,
          product,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        };
      })
      .filter(Boolean);
  }

  public addToCart(userId: string, productId: string, quantity = 1, size?: string, color?: string) {
    const existing = this.data.carts.find(
      c => c.userId === userId && c.productId === productId && c.size === size && c.color === color
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.data.carts.push({
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId,
        productId,
        quantity,
        size,
        color
      });
    }

    this.persist();
    return this.getCart(userId);
  }

  public updateCartQuantity(userId: string, cartItemId: string, quantity: number) {
    const item = this.data.carts.find(c => c.id === cartItemId && c.userId === userId);
    if (item) {
      if (quantity <= 0) {
        this.data.carts = this.data.carts.filter(c => c.id !== cartItemId);
      } else {
        item.quantity = quantity;
      }
      this.persist();
    }
    return this.getCart(userId);
  }

  public removeFromCart(userId: string, cartItemId: string) {
    this.data.carts = this.data.carts.filter(c => !(c.id === cartItemId && c.userId === userId));
    this.persist();
    return this.getCart(userId);
  }

  public clearCart(userId: string) {
    this.data.carts = this.data.carts.filter(c => c.userId !== userId);
    this.persist();
    return [];
  }

  // --- ORDERS ---
  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId);
    }
    return this.data.orders;
  }

  public getOrderById(orderId: string): Order | undefined {
    return this.data.orders.find(o => o.id === orderId);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'date'>): Order {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString(),
      trackingNumber: `FLAIR-TRK-${Math.floor(10000 + Math.random() * 90000)}`
    };

    this.data.orders.unshift(newOrder);

    // Clear cart for this user
    this.clearCart(orderData.userId);

    this.persist();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.status = status;
    this.persist();
    return order;
  }

  // --- REVIEWS ---
  public getReviewsByProduct(productId: string): Review[] {
    return this.data.reviews.filter(r => r.productId === productId);
  }

  public getAllReviews(): Review[] {
    return this.data.reviews;
  }

  public addReview(review: Omit<Review, 'id' | 'date'>): Review {
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    this.data.reviews.unshift(newReview);

    // Recalculate product rating and review count
    const prodReviews = this.getReviewsByProduct(review.productId);
    const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    this.updateProduct(review.productId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: prodReviews.length
    });

    this.persist();
    return newReview;
  }

  public deleteReview(reviewId: string): boolean {
    const rev = this.data.reviews.find(r => r.id === reviewId);
    if (!rev) return false;

    this.data.reviews = this.data.reviews.filter(r => r.id !== reviewId);
    // Recalculate
    const prodReviews = this.getReviewsByProduct(rev.productId);
    const avgRating = prodReviews.length > 0 
      ? prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length
      : 4.5;
    this.updateProduct(rev.productId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: prodReviews.length
    });

    this.persist();
    return true;
  }

  // --- STATS ---
  public getAdminStats() {
    const totalRevenue = this.data.orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
    const totalOrders = this.data.orders.length;
    const totalProducts = this.data.products.length;
    const totalUsers = this.data.users.length;
    const recentOrders = this.data.orders.slice(0, 5);

    // Category breakdown
    const catMap: Record<string, { count: number; revenue: number }> = {};
    for (const p of this.data.products) {
      if (!catMap[p.category]) {
        catMap[p.category] = { count: 0, revenue: 0 };
      }
      catMap[p.category].count += 1;
    }

    // Add revenue estimations from orders
    for (const ord of this.data.orders) {
      for (const item of ord.items) {
        const prod = this.data.products.find(p => p.id === item.productId);
        if (prod && catMap[prod.category]) {
          catMap[prod.category].revenue += item.price * item.quantity;
        }
      }
    }

    const popularCategories = Object.entries(catMap).map(([category, info]) => ({
      category,
      count: info.count,
      revenue: info.revenue
    })).sort((a, b) => b.count - a.count);

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders,
      popularCategories
    };
  }
}

export const db = new Database();
