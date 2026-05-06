import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, ApiResponse } from '../types';
import { hashPassword, comparePassword } from './password';
import { generateToken } from './jwt';

const router = Router();
const prisma = new PrismaClient();

interface LoginBody {
  email: string;
  password: string;
}

interface SignupBody {
  email: string;
  password: string;
  name: string;
}

router.post('/signup', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body as SignupBody;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        token,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});

router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body as LoginBody;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Missing email or password' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.post('/logout', (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/me', (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  res.json({ success: true, data: req.user });
});

export default router;
