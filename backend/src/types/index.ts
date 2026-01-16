import { Prisma, PrismaClient } from '@prisma/client';
import { Request } from 'express';

export interface CartItemInput {
  productId: number;
  quantity: number;
  price?: number;
  name?: string;
  imageUrl?: string;
}

export type TransactionClient = Prisma.TransactionClient;

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
