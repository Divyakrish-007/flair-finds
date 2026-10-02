import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper to get userId or fallback to guest header
const getUserId = (req: AuthRequest): string => {
  if (req.user?.id) return req.user.id;
  const guestId = req.headers['x-guest-id'] as string;
  return guestId || 'guest_default_user';
};

// GET Cart
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const cart = db.getCart(userId);
    res.json({ success: true, cart });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADD to Cart
router.post('/add', (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { productId, quantity = 1, size, color } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = db.getProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updatedCart = db.addToCart(userId, productId, quantity, size, color);
    res.json({ success: true, cart: updatedCart, message: 'Added to cart' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE Cart Quantity
router.put('/update', (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { cartItemId, quantity } = req.body;

    if (!cartItemId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'cartItemId and quantity are required' });
    }

    const updatedCart = db.updateCartQuantity(userId, cartItemId, Number(quantity));
    res.json({ success: true, cart: updatedCart });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// REMOVE from Cart
router.delete('/remove/:cartItemId', (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { cartItemId } = req.params;
    const updatedCart = db.removeFromCart(userId, cartItemId);
    res.json({ success: true, cart: updatedCart, message: 'Item removed from cart' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CLEAR Cart
router.delete('/clear', (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const cart = db.clearCart(userId);
    res.json({ success: true, cart, message: 'Cart cleared' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
