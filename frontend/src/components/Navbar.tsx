import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <img src="/jusas-logo.png" alt="Jusas Logo" className="h-12 w-auto" />
            <span className="font-heading text-2xl text-primary font-bold hidden sm:block">Jusas</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-text hover:text-primary transition-colors font-medium">Home</Link>
            <Link to="/menu" className="text-text hover:text-primary transition-colors font-medium">Menu</Link>
            <Link to="/about" className="text-text hover:text-primary transition-colors font-medium">About</Link>
            {user?.role === 'admin' && (
               <Link to="/admin" className="text-primary font-bold hover:text-primary/80 transition-colors">Admin</Link>
            )}
          </div>

          {/* Icons & Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {user?.role !== 'admin' && (
              <Link to="/cart" className="relative text-text hover:text-primary transition-colors">
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-primary">Hi, {user?.name?.split(' ')[0]}</span>
                    <button 
                        onClick={() => logout()}
                        className="p-2 text-text/60 hover:text-error transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            ) : (
                <Link to="/login" className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-opacity-90 transition-all shadow-md">
                  Login
                </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-text hover:text-primary">
              {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background border-b border-secondary/20"
          >
            <div className="px-4 pt-2 pb-8 space-y-2">
              <Link to="/" className="block py-3 text-lg font-medium text-text hover:text-primary min-h-[44px]">Home</Link>
              <Link to="/menu" className="block py-3 text-lg font-medium text-text hover:text-primary min-h-[44px]">Menu</Link>
              <Link to="/about" className="block py-3 text-lg font-medium text-text hover:text-primary min-h-[44px]">About</Link>
              
              {/* ✅ FIX #1: Order History for authenticated customers (mobile only) */}
              {isAuthenticated && user?.role !== 'admin' && (
                <Link to="/orders" className="block py-3 text-lg font-medium text-text hover:text-primary min-h-[44px]">
                  My Orders
                </Link>
              )}
              
              {/* Admin-only link on mobile */}
              {user?.role === 'admin' && (
                <Link to="/admin" className="block py-3 text-lg font-bold text-primary hover:text-primary/80 min-h-[44px] border-t border-secondary/20 mt-2 pt-4">
                  Admin Dashboard
                </Link>
              )}
              
              <div className="pt-4 pb-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-secondary/20">
              {user?.role !== 'admin' && (
                <Link to="/cart" className="flex items-center justify-center text-text hover:text-primary min-h-[44px] px-4">
                   <ShoppingBag size={24} className="mr-2"/> Cart ({cartCount})
                </Link>
              )}
                {isAuthenticated ? (
                    <button onClick={() => logout()} className="px-6 py-3 min-h-[44px] bg-secondary/10 text-text rounded-full font-medium">
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="px-6 py-3 min-h-[44px] bg-primary text-white rounded-full font-medium hover:bg-opacity-90 text-center">
                      Login
                    </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
