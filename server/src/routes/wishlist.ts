import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

const getUserId = (req: AuthRequest): string => {
  if (req.user?.id) return req.user.id;
  const guestId = req.headers['x-guest-id'] as string;
  return guestId || 'guest_default_user';
};

// GET Wishlist
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const wishlist = db.getWishlist(userId);
    res.json({ success: true, wishlist });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// TOGGLE Wishlist item
router.post('/toggle', (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const product = db.getProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { inWishlist } = db.toggleWishlist(userId, productId);
    const updatedWishlist = db.getWishlist(userId);

    res.json({
      success: true,
      inWishlist,
      wishlist: updatedWishlist,
      message: inWishlist ? 'Added to wishlist' : 'Removed from wishlist'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
