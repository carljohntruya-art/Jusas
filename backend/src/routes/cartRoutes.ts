import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, mergeCart } from '../controllers/cartController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All cart routes require authentication
router.use(authenticateToken);

router.get('/', getCart);
router.post('/items', addToCart);
router.post('/merge', mergeCart);
router.put('/items/:id', updateCartItem);
router.delete('/items/:id', removeFromCart);

export default router;
