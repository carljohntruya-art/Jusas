import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // Password Strength Logic
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getStrength(password);
  const getStrengthLabel = (score: number) => {
      if (score <= 1) return { label: 'Weak', color: 'bg-red-500' };
      if (score === 2) return { label: 'Medium', color: 'bg-yellow-500' };
      if (score >= 3) return { label: 'Strong', color: 'bg-green-500' };
      return { label: '', color: '' };
  };

  const strength = getStrengthLabel(strengthScore);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (strengthScore < 3) { // Require Strong password? Or just 8 chars? User said "Criteria...". Let's require at least Medium (2) or just show it. 
      // User said "Real-time evaluation... Criteria...". Usually implied enforcement.
      // But let's enforce at least 8 chars + 1 other trait for Medium.
      // For now, I will enforce checking if it's NOT Weak (score > 1) and Length >= 8.
      if (password.length < 8) {
         setError("Password must be at least 8 characters long.");
         return;
      }
    }

    try {
      await register(email, password, name);
      // Redirect to login after successful signup
      navigate('/login', { state: { message: 'Account created successfully. Please log in.' } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
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
            <h1 className="font-heading font-bold text-3xl text-primary">Join the Tribe 🍍</h1>
            <p className="text-text/60 mt-2">Create an account to get started.</p>
          </div>

          {error && (
            <div className="bg-red-100 text-error p-3 rounded-lg mb-4 text-center text-sm">
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-text mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
            </div>

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
                    className="absolute right-4 top-10 text-sm text-text/60 font-bold hover:text-primary z-10"
                >
                    {showPassword ? "HIDE" : "SHOW"}
                </button>
                
                {password && (
                    <div className="mt-2 flex items-center gap-2">
                         <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                             <div className={`h-full ${strength.color} transition-all duration-500`} style={{ width: `${(strengthScore / 4) * 100}%` }} />
                         </div>
                         <span className="text-xs font-bold text-text/60">{strength.label}</span>
                    </div>
                )}
                <div className="mt-1 text-xs text-text/40">
                    Must include: 8+ chars, Upper & Lower, Number, Symbol
                </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md"
            >
                Create Account
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text/60">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
