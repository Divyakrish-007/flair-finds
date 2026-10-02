import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET reviews for a product
router.get('/product/:productId', (req, res: Response) => {
  try {
    const reviews = db.getReviewsByProduct(req.params.productId);
    res.json({ success: true, reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST review
router.post('/add', (req: AuthRequest, res: Response) => {
  try {
    const { productId, rating, comment, userName } = req.body;
    const userId = req.user?.id || 'demo_reviewer_' + Math.random().toString(36).substr(2, 4);
    const authorName = req.user?.name || userName || 'Fashion Enthusiast';

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product, rating, and review text are required' });
    }

    const numericRating = Math.min(5, Math.max(1, Number(rating)));

    const newReview = db.addReview({
      productId,
      userId,
      userName: authorName,
      rating: numericRating,
      comment
    });

    res.status(201).json({
      success: true,
      review: newReview,
      message: 'Review submitted successfully!'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
