import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Allow admin endpoints with admin check or demo header
const checkAdminAccess = (req: AuthRequest, res: Response, next: Function) => {
  const adminSecret = req.headers['x-admin-key'];
  if (adminSecret === 'demo_admin_secret') {
    return next();
  }
  requireAdmin(req, res, next as any);
};

// GET Admin Stats
router.get('/stats', checkAdminAccess, (req: AuthRequest, res: Response) => {
  try {
    const stats = db.getAdminStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all orders
router.get('/orders', checkAdminAccess, (req: AuthRequest, res: Response) => {
  try {
    const orders = db.getOrders();
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE order status
router.put('/orders/:id/status', checkAdminAccess, (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status value' });
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order: updated, message: `Order status updated to ${status}` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all registered users
router.get('/users', checkAdminAccess, (req: AuthRequest, res: Response) => {
  try {
    const users = db.getUsers().map(({ passwordHash: _, ...safeUser }) => safeUser);
    res.json({ success: true, users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADD product
router.post('/products', checkAdminAccess, (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      brand,
      category,
      gender,
      description,
      price,
      originalPrice,
      discount,
      image,
      source,
      sizes,
      colors,
      stock,
      tags
    } = req.body;

    if (!name || !brand || !category || !price) {
      return res.status(400).json({ success: false, message: 'Name, brand, category, and price are required' });
    }

    const newProduct = db.addProduct({
      name,
      brand,
      category,
      gender: gender || 'Unisex',
      description: description || `${name} by ${brand}`,
      price: Number(price),
      originalPrice: Number(originalPrice || price * 1.5),
      discount: Number(discount || 20),
      rating: 4.8,
      reviewCount: 1,
      image: image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
      source: source || 'Amazon',
      sizes: Array.isArray(sizes) ? sizes : ['S', 'M', 'L', 'XL'],
      colors: Array.isArray(colors) ? colors : ['Black', 'White'],
      stock: Number(stock || 25),
      tags: Array.isArray(tags) ? tags : [category.toLowerCase(), brand.toLowerCase()],
      isTrending: true,
      isFeatured: false,
    });

    res.status(201).json({ success: true, product: newProduct, message: 'Product created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE product
router.put('/products/:id', checkAdminAccess, (req: AuthRequest, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product: updated, message: 'Product updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE product
router.delete('/products/:id', checkAdminAccess, (req: AuthRequest, res: Response) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all reviews for moderation
router.get('/reviews', checkAdminAccess, (req: AuthRequest, res: Response) => {
  try {
    const reviews = db.getAllReviews();
    res.json({ success: true, reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE inappropriate review
router.delete('/reviews/:id', checkAdminAccess, (req: AuthRequest, res: Response) => {
  try {
    const deleted = db.deleteReview(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review removed' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
