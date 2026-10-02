import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

const getUserId = (req: AuthRequest): string => {
  if (req.user?.id) return req.user.id;
  const guestId = req.headers['x-guest-id'] as string;
  return guestId || 'guest_default_user';
};

// GET orders for current user
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const orders = db.getOrders(userId);
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single order by ID
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE Mock Checkout Order
router.post('/checkout', (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { items, shippingAddress, paymentMethod, subtotal, discount = 0, shippingFee = 0, total } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Incomplete shipping address provided' });
    }

    const calculatedTotal = total || (subtotal - discount + shippingFee);

    const order = db.createOrder({
      userId,
      items,
      subtotal: subtotal || calculatedTotal,
      discount,
      shippingFee,
      total: calculatedTotal,
      status: 'Confirmed',
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
    });

    res.status(201).json({
      success: true,
      order,
      message: 'Order Placed Successfully!'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
