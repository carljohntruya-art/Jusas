import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Middleware to ensure users can only access their own orders
export const ensureOrderOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = req.user?.id;
    const role = req.user?.role;
    const isAdmin = role === 'admin';
    
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (isNaN(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }
    
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (!isAdmin && order.userId !== userId) {
      return res.status(403).json({ 
        error: 'Access denied: You can only view your own orders' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Order ownership check failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
