import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { useState } from 'react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    isFeatured: boolean;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const { showToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [localStock, setLocalStock] = useState(product.stock);

  // Admin view: Stock controls
  const AdminStockControls = () => {
    const adjustStock = async (operation: 'increment' | 'decrement') => {
      try {
        setLoading(true);
        const amount = 1;
        const res = await axios.patch(`http://localhost:3000/api/products/${product.id}/stock`, {
          operation,
          amount
        });
        
        if (res.data.success) {
           setLocalStock(res.data.product.stock);
           showToast(`Stock updated: ${res.data.product.stock}`, 'success');
        } else {
           showToast('Failed to verify stock update', 'error');
        }
      } catch (error) {
        showToast('Error updating stock', 'error');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="flex items-center justify-between w-full bg-gray-50 p-2 rounded-xl mt-4">
        <span className="text-xs font-bold text-text/60">Stock:</span>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => adjustStock('decrement')} 
                disabled={loading || localStock <= 0}
                className="w-8 h-8 flex items-center justify-center bg-white shadow-sm border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 font-bold text-text"
            >
                -
            </button>
            <span className="font-bold w-6 text-center">{localStock}</span>
            <button 
                onClick={() => adjustStock('increment')} 
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center bg-white shadow-sm border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 font-bold text-text"
            >
                +
            </button>
        </div>
      </div>
    );
  };

  // Customer view: Add to Cart button
  const CustomerAddToCart = () => {
    const handleAddToCart = () => {
      if (localStock <= 0) {
        showToast('This item is out of stock', 'error');
        return;
      }
      
      // We don't decrement stock here, just add to cart.
      // Ideally validation happens at checkout.
      addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl
      });
      showToast(`${product.name} added to cart!`, 'success');
    };
    
    return (
      <button 
        onClick={handleAddToCart}
        disabled={localStock <= 0}
        className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 group mt-4
            ${localStock <= 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white'
            }
        `}
      >
        <ShoppingCart size={20} className={localStock > 0 ? "group-hover:scale-110 transition-transform" : ""} /> 
        {localStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-transparent hover:border-primary/20 flex flex-col h-full" // Added h-full
    >
      <div className="relative aspect-video overflow-hidden group">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.isFeatured && (
            <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Featured</span>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-heading font-bold text-xl text-text leading-tight">{product.name}</h3>
            <span className="font-bold text-lg text-primary whitespace-nowrap">₱{product.price}</span>
        </div>
        <p className="text-text/60 text-sm mb-2 flex-grow">{product.description}</p>
        
        {/* Role-based rendering */}
        {user?.role === 'admin' ? <AdminStockControls /> : <CustomerAddToCart />}
      </div>
    </motion.div>
  );
};

export default ProductCard;
