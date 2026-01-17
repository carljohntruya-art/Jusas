import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import apiClient from '../api/apiClient';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  isFeatured: boolean;
}

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    apiClient.get('/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
                 <h1 className="text-4xl font-heading font-bold text-text">Our Menu</h1>
                 <p className="text-text/60 mt-2">Find your perfect tropical blend.</p>
            </div>
            
            <div className="mt-6 md:mt-0 relative w-full md:w-96">
                <Search className="absolute left-4 top-3.5 text-text/40" size={20} />
                <input 
                  type="text" 
                  placeholder="Search smoothies..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                />
            </div>
        </div>

        {/* Grid */}
        {loading ? (
           <div className="text-center py-20">Loading fresh contents... 🍍</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
