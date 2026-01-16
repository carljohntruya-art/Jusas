import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus, getOrderById } from '../controllers/orderController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';
import { ensureOrderOwnership } from '../middleware/orderMiddleware';

const router = Router();

router.use(authenticateToken); // Protect all order routes

router.post('/', createOrder);
router.get('/', getOrders); 
router.get('/:id', ensureOrderOwnership, getOrderById);
router.put('/:id/status', requireAdmin, updateOrderStatus);

export default router;
