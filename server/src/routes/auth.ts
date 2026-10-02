import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = db.addUser({
      name,
      email,
      passwordHash,
      role: 'user',
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.status(201).json({
      success: true,
      token,
      user,
      message: 'Account registered successfully!'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const userWithHash = db.getUserByEmail(email);
    if (!userWithHash) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, userWithHash.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const { passwordHash: _, ...safeUser } = userWithHash;
    const token = generateToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      name: safeUser.name,
    });

    res.json({
      success: true,
      token,
      user: safeUser,
      message: 'Login successful'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
});

// Current User Profile
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const userWithHash = db.getUserById(req.user!.id);
    if (!userWithHash) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { passwordHash: _, ...safeUser } = userWithHash;
    res.json({
      success: true,
      user: safeUser
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
});

export default router;
