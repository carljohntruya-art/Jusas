import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { requireAdmin, authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/stats', getDashboardStats);

export default router;
