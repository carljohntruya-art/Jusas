import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        // 1. Total Revenue
        const orders = await prisma.order.findMany({
            where: { status: { not: 'CANCELLED' } },
            select: { total: true }
        });
        const totalRevenue = orders.reduce((acc: number, order: { total: number }) => acc + order.total, 0);

        // 2. Total Orders
        const totalOrders = await prisma.order.count();

        // 3. Top Selling Products
        const topProducts = await prisma.product.findMany({
            orderBy: { totalSold: 'desc' },
            take: 5,
            select: { name: true, totalSold: true }
        });

        // 4. Recent Sales (Last 7 days grouped)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentOrders = await prisma.order.findMany({
            where: { 
                status: { not: 'CANCELLED' },
                createdAt: { gte: sevenDaysAgo }
            },
            select: { createdAt: true, total: true }
        });

        // Group by Date for Chart
        const salesByDate: Record<string, number> = {};
        recentOrders.forEach((order: { createdAt: Date; total: number }) => {
            const date = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
            salesByDate[date] = (salesByDate[date] || 0) + order.total;
        });

        // Convert to array
        const chartData = Object.keys(salesByDate).map((date: string) => ({
            date,
            amount: salesByDate[date]
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        res.json({
            totalRevenue,
            totalOrders,
            topProducts,
            recentSales: chartData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};
