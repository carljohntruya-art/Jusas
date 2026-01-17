import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }
    
    // Check existing
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        res.status(400).json({ error: 'Email already exists' });
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // DO NOT auto-login, just return success
    res.status(201).json({ 
        message: 'Account created successfully. Please log in.', 
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  console.log('Backend: Login attempt for', req.body.email);
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
        console.log('Backend: Missing fields');
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('Backend: User not found');
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
        console.log('Backend: Invalid password');
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }

    console.log(`Backend: Login successful for ${user.email}, generating token. Environment: ${process.env.NODE_ENV}`);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    const isProduction = process.env.NODE_ENV === 'production';
    
    console.log('Backend: Auth Cookie Configuration:', { 
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        env: process.env.NODE_ENV
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
    });

    res.json({ message: 'Logged in', user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Backend: Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = (req: AuthRequest, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};

export const me = (req: AuthRequest, res: Response) => {
   // User is attached by middleware
   res.json({ user: req.user });
};
