import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Star } from 'lucide-react';

const BestSellers = () => {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                // Fetch best sellers (backend sorts by totalSold)
                const res = await apiClient.get('/products?bestseller=true');
                setProducts(res.data.slice(0, 3)); // Top 3
            } catch (error) {
                console.error("Failed to fetch best sellers");
            }
        };
        fetchBestSellers();
    }, []);

    if (products.length === 0) return null;

    return (
        <section className="py-20 bg-background relative">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                     <div>
                         <h2 className="text-4xl font-heading font-bold text-text mb-2">Customer Favorites 🏆</h2>
                         <p className="text-text/70">Top rated and most loved by our tribe.</p>
                     </div>
                     <Link to="/menu" className="hidden md:block text-primary font-bold hover:underline">View Full Menu</Link>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {products.map((product, i) => (
                         <motion.div 
                             key={product.id}
                             initial={{ opacity: 0, x: 20 }}
                             whileInView={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-all border-[3px] border-[#2ECC71]"
                         >
                             <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                 <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex flex-col justify-center">
                                 <div className="flex items-center space-x-1 text-accent mb-1">
                                     <Star size={14} fill="currentColor" />
                                     <span className="text-xs font-bold">BEST SELLER</span>
                                 </div>
                                 <h3 className="font-heading font-bold text-lg text-text leading-tight mb-1">{product.name}</h3>
                                 <p className="text-primary font-bold">₱{product.price}</p>
                             </div>
                         </motion.div>
                     ))}
                 </div>
                 
                 <div className="mt-8 text-center md:hidden">
                    <Link to="/menu" className="text-primary font-bold hover:underline">View Full Menu</Link>
                 </div>
             </div>
        </section>
    );
};

export default BestSellers;
