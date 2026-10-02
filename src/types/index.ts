export type PlatformSource = 'Amazon' | 'Flipkart' | 'Meesho' | 'Snapdeal';

export type Gender = 'Women' | 'Men' | 'Unisex';

export type ProductCategory =
  | 'Dresses'
  | 'Tops'
  | 'Shirts'
  | 'T-Shirts'
  | 'Jeans'
  | 'Trousers'
  | 'Shoes'
  | 'Bags'
  | 'Watches'
  | 'Jewellery'
  | 'Accessories';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  gender: Gender;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  source: PlatformSource;
  sourceUrl?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  tags: string[];
  isTrending?: boolean;
  isFeatured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery' | 'UPI' | 'Card';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  source: PlatformSource;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  status: OrderStatus;
  date: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FilterState {
  searchQuery: string;
  categories: ProductCategory[];
  genders: Gender[];
  priceRange: [number, number];
  minRating: number | null;
  brands: string[];
  sources: PlatformSource[];
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount';
}

export interface OutfitRecommendation {
  occasion: string;
  style: string;
  preferredColor?: string;
  budget: number;
  totalPrice: number;
  items: {
    top?: Product;
    bottom?: Product;
    shoes?: Product;
    accessory?: Product;
  };
  stylingTips: string[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  outfitRecommendation?: OutfitRecommendation;
  quickReplies?: string[];
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  popularCategories: { category: string; count: number; revenue: number }[];
}
