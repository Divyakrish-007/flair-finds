import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import ordersRoutes from './routes/orders.js';
import reviewsRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-guest-id', 'x-admin-key']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Flair Finds API',
    tagline: 'Find Your Style. Find Your Flair.',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred. Please try again.'
  });
});

app.listen(PORT, () => {
  console.log(`\n✨ FLAIR FINDS API SERVER ✨`);
  console.log(`🚀 Running on: http://localhost:${PORT}`);
  console.log(`🛍️ Health check: http://localhost:${PORT}/api/health\n`);
});
