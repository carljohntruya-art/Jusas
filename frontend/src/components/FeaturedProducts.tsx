import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await apiClient.get('/products?featured=true');
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-white/50 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-primary mb-4">Featured Smoothies</h2>
          <p className="text-text/70 max-w-xl mx-auto">Hand-picked favorites that our customers can't get enough of.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-3xl p-4 shadow-card hover:shadow-elevated transition-all duration-300 border-[3px] border-[#FBBF24] hover:scale-[1.02] flex flex-col h-full"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button 
                  onClick={() => addToCart({ ...product, quantity: 1 })}
                  className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-colors z-20 cursor-pointer"
                >
                  <ShoppingCart size={20} />
                </button>
                 <Link to={`/product/${product.id}`} className="absolute inset-0 z-10" />
              </div>
              
              <div className="px-2 flex-1 flex flex-col">
                 <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-heading font-bold text-xl text-text mb-1 hover:text-primary transition-colors">{product.name}</h3>
                 </Link>
                 <p className="text-sm text-text/60 mb-3 text-ellipsis overflow-hidden line-clamp-2 flex-grow">{product.description}</p>
                 <div className="flex justify-between items-center mt-auto">
                   <span className="font-bold text-lg text-accent">₱{product.price}</span>
                   <span className="text-xs text-text/40">5.0 ★</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
