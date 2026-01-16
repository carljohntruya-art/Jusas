import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { featured, bestseller } = req.query;

    const where: any = {};
    if (featured === 'true') {
      where.isFeatured = true;
    }
    
    // For best sellers, we might want to sort by totalSold
    const orderBy = bestseller === 'true' ? { totalSold: 'desc' } : { id: 'asc' };

    const products = await prisma.product.findMany({
        where,
        orderBy: orderBy as any // Typescript sometimes complains about dynamic orderBy
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create Product
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, stock, imageUrl, isFeatured } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        isFeatured: isFeatured || false,
      }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update Product
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl, isFeatured } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        isFeatured,
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete Product
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Feature Toggle
export const featureProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return; 
    }
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: { isFeatured: !product.isFeatured }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle feature status' });
  }
};

// Duplicate Product
export const duplicateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const original = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!original) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const { id: _, createdAt, updatedAt, ...data } = original;
    const duplicate = await prisma.product.create({
      data: {
        ...data,
        name: `${data.name} (Copy)`
      }
    });
    res.status(201).json(duplicate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate product' });
  }
};

export const updateStock = async (req: AuthRequest, res: Response) => {
  try {
    const { operation, amount = 1 } = req.body;
    const { id } = req.params;

    if (!['increment', 'decrement'].includes(operation)) {
      res.status(400).json({ error: 'Invalid operation' });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    let newStock = product.stock;
    if (operation === 'increment') {
      newStock += amount;
    } else if (operation === 'decrement') {
      newStock = Math.max(0, newStock - amount);
    }

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: { stock: newStock }
    });
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
};
