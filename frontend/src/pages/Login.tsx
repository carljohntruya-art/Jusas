import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const login = useAuthStore((state) => state.login);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login: Form submitted');
    setError('');
    setSuccessMessage('');
    try {
      await login(email, password);
      console.log('Login: Success, navigating to home');
      // Check if we have a saved redirect path or default to home/menu
      navigate('/'); 
    } catch (err: any) {
      console.error('Login: Error caught', err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white p-8 rounded-3xl shadow-elevated w-full max-w-md border border-primary/10"
        >
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-primary">Welcome Back! 🌴</h1>
            <p className="text-text/60 mt-2">Login to manage your orders.</p>
          </div>

          {successMessage && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 text-center text-sm">
                {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-error p-3 rounded-lg mb-4 text-center text-sm">
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-text mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
            </div>

            <div className="relative">
                <label className="block text-sm font-bold text-text mb-2">Password</label>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-10 text-sm text-text/60 font-bold hover:text-primary"
                >
                    {showPassword ? "HIDE" : "SHOW"}
                </button>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md"
            >
                Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text/60">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign up</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
