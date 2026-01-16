import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get User Cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    // Fetch user's cart from database
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                stock: true
              }
            }
          }
        }
      }
    });
    
    if (!cart) {
      // Create empty cart for user if doesn't exist
      const newCart = await prisma.cart.create({
        data: { userId },
        include: { items: true }
      });
      return res.json({ cart: newCart, items: [] });
    }
    
    res.json({ cart, items: cart.items });
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add to Cart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { productId, quantity } = req.body;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        let cart = await prisma.cart.findUnique({ where: { userId } });

        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        // Check if item exists
        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId }
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        } else {
            await prisma.cartItem.create({
                data: { cartId: cart.id, productId, quantity }
            });
        }

        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        console.error('Add to cart failed:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

// Update Cart Item
export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params; // CartItem ID
        const { quantity } = req.body;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Verify ownership
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: Number(id) },
            include: { cart: true }
        });

        if (!cartItem || cartItem.cart.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized access to cart item' });
        }

        if (quantity <= 0) {
            await prisma.cartItem.delete({ where: { id: Number(id) } });
        } else {
            await prisma.cartItem.update({
                where: { id: Number(id) },
                data: { quantity }
            });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
};

// Remove Cart Item
export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: Number(id) },
            include: { cart: true }
        });

        if (!cartItem || cartItem.cart.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized access to cart item' });
        }

        await prisma.cartItem.delete({ where: { id: Number(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item' });
    }
};

// Merge Guest Cart
export const mergeCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { guestCart } = req.body; // Array of {productId, quantity}
    
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Get or create user cart
    let userCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    });
    
    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId },
        include: { items: true }
      });
    }
    
    if (guestCart && Array.isArray(guestCart)) {
        // Merge guest cart items into user cart
        for (const guestItem of guestCart) {
            const existingItem = userCart.items.find(
                item => item.productId === guestItem.productId
            );
            
            if (existingItem) {
                // Update quantity
                await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { 
                    quantity: existingItem.quantity + guestItem.quantity 
                }
                });
            } else {
                // Add new item
                await prisma.cartItem.create({
                data: {
                    cartId: userCart.id,
                    productId: guestItem.productId,
                    quantity: guestItem.quantity
                }
                });
            }
        }
    }
    
    res.json({ 
      success: true, 
      message: 'Cart merged successfully' 
    });
  } catch (error) {
    console.error('Cart merge failed:', error);
    res.status(500).json({ error: 'Failed to merge cart' });
  }
};
