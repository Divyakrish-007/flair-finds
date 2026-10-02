import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'flairfinds_super_secret_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
    name: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'user' | 'admin'; name: string };
    const user = db.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired session token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  authenticateToken(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }
    next();
  });
};

export const generateToken = (payload: { id: string; email: string; role: string; name: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
