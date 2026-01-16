import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create Order (Transactional)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, total, paymentMethod, userId, shippingAddress, contactNumber, paymentProof, deliveryTime } = req.body;

    // Start Transaction
    const result = await prisma.$transaction(async (tx) => {
        // 1. Check stock for all items
        for (const item of items) {
           const product = await tx.product.findUnique({ where: { id: item.id } });
           if (!product || product.stock < item.quantity) {
               throw new Error(`Insufficient stock for product: ${item.name}`);
           }
        }

        // 2. Deduct Stock & Increment Sold
        for (const item of items) {
            await tx.product.update({
                where: { id: item.id },
                data: {
                    stock: { decrement: item.quantity },
                    totalSold: { increment: item.quantity }
                }
            });
        }

        // 3. Create Order Header
        const order = await tx.order.create({
            data: {
                total,
                paymentMethod,
                shippingAddress,
                contactNumber,
                paymentProof,
                deliveryTime,
                userId: userId || null, // Allow guest if not provided (though frontend should enforce)
                status: 'PENDING',
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: { items: true } // Return items in response
        });
        
        return order;
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message || 'Failed to create order' });
  }
};

// Get Orders (Admin or User History)
export const getOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        const isAdmin = role === 'admin';
        
        // Build where clause based on user role
        const whereClause: any = isAdmin 
          ? {}  // Admin can see all orders
          : { userId };  // Users can only see their own orders
        
        // Allow admin to filter by specific user via query param
        if (isAdmin && req.query.userId) {
            whereClause.userId = Number(req.query.userId);
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: { 
                items: {
                    include: { product: true }
                }, 
                user: {
                    select: { name: true, email: true }
                } 
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, declineReason } = req.body; // APPROVED, DELIVERED, CANCELLED

        const order = await prisma.order.update({
            where: { id: Number(id) },
            data: { status, declineReason }
        });

        res.json(order);
    } catch (error) {
         res.status(500).json({ error: 'Failed to update order' });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = req.user?.id;
    const role = req.user?.role;
    const isAdmin = role === 'admin';
    
    if (isNaN(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: { select: { email: true, name: true } }
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check ownership
    // @ts-ignore
    if (!isAdmin && order.userId !== userId) {
      return res.status(403).json({ 
        error: 'Access denied: You can only view your own orders' 
      });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

