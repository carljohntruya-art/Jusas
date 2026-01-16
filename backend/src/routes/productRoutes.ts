import { Router } from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    featureProduct,
    duplicateProduct,
    updateStock
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/feature', featureProduct);
router.patch('/:id/stock', updateStock);
router.post('/:id/duplicate', duplicateProduct);

export default router;
