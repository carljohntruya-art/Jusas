import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  imageCredit?: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const { isAuthenticated } = useAuthStore();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
        // Redirect to login preserving current location
        navigate('/login', { state: { from: `/products/${id}` } });
        return;
    }

    if (!product) return;

    if (quantity > product.stock) {
        alert("Cannot add more items than available in stock!");
        return;
    }

    setAdding(true);
    // Simulate network delay for effect
    setTimeout(() => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: quantity
        });
        setAdding(false);
        alert(`Added ${quantity} ${product.name}(s) to cart!`); // Pending: Replace with Toast
    }, 500);
  };

  if (loading) return <div className="min-h-screen grid place-items-center text-primary">Loading...</div>;
  if (!product) return <div className="min-h-screen grid place-items-center">Product not found. <button onClick={() => navigate(-1)} className="text-secondary underline ml-2">Go back</button></div>;

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      
      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-text/60 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Menu
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           {/* Image Side */}
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
           >
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              {product.imageCredit && (
                  <span className="absolute bottom-2 right-2 text-[10px] text-white/50 bg-black/30 px-2 py-1 rounded">
                      Photo by {product.imageCredit}
                  </span>
              )}
           </motion.div>

           {/* Info Side */}
           <motion.div 
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             className="space-y-6"
           >
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-text text-balance">{product.name}</h1>
              <p className="text-2xl font-bold text-primary">₱{product.price}</p>
              
              <div className="prose text-text/70">
                <p>{product.description}</p>
              </div>

              {/* Controls */}
              <div className="pt-6 border-t border-secondary/20">
                 <div className="flex items-center space-x-6 mb-8">
                    <span className="text-text font-medium">Quantity</span>
                    <div className="flex items-center border border-secondary/30 rounded-full px-4 py-2 space-x-4 bg-white">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="hover:text-primary transition-colors"
                        >
                            <Minus size={18}/>
                        </button>
                        <span className="font-bold w-4 text-center">{quantity}</span>
                        <button 
                           onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                           className="hover:text-primary transition-colors"
                        >
                            <Plus size={18}/>
                        </button>
                    </div>
                    <span className="text-sm text-text/40">{product.stock} available</span>
                 </div>

                 <button 
                   onClick={handleAddToCart}
                   disabled={product.stock === 0 || adding}
                   className="w-full md:w-auto px-8 py-4 bg-accent text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <ShoppingBag /> {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : `Add to Cart — ₱${product.price * quantity}`}
                 </button>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
