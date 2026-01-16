import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useCartStore } from '../store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import axios from 'axios';

const Cart = () => {
  const { items, removeItem, updateQuantity, total, clearCart, syncCart } = useCartStore(); // Deconstruct syncCart
  const { user, isAuthenticated } = useAuthStore(); // Deconstruct isAuthenticated
  const { showToast } = useToastStore();
  const cartTotal = total();
  const shipping = 50; 
  const finalTotal = cartTotal + shipping;
  const navigate = useNavigate(); // Add navigate

  // Sync cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
        syncCart();
    }
  }, [isAuthenticated]);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'gcash'>('cod');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form States
  const [codDetails, setCodDetails] = useState({
      address: '',
      contact: '',
      deliveryTime: 'ASAP'
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const handleFileUpload = async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('paymentProof', file);
      
      try {
          const res = await axios.post('http://localhost:3000/api/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          return res.data.fileUrl;
      } catch (error) {
          console.error("Upload failed", error);
          throw new Error("Upload failed");
      }
  };

  const handleCheckout = async () => {
    if (!items.length) return;

    // Auth Check
    if (!isAuthenticated) {
        showToast("Please login to proceed to checkout", 'error');
        navigate('/login');
        return;
    }

    setLoading(true);
    try {
        let proofUrl = '';

        if (paymentMethod === 'gcash') {
            if (!paymentProof) {
                 showToast("Please upload payment proof", 'error');
                 setLoading(false);
                 return;
            }
            // Upload first
            setUploading(true);
            try {
                proofUrl = await handleFileUpload(paymentProof);
                setUploading(false);
            } catch (err) {
                showToast("Failed to upload proof. Please try again.", 'error');
                setUploading(false);
                setLoading(false);
                return;
            }
        } else {
             if (!codDetails.address || !codDetails.contact) {
                showToast("Please fill in all delivery details", 'error');
                setLoading(false);
                return;
            }
        }

        const payload: any = {
            items,
            total: finalTotal,
            paymentMethod: paymentMethod.toUpperCase(),
            userId: user?.id,
            shippingAddress: paymentMethod === 'cod' ? codDetails.address : undefined,
            contactNumber: paymentMethod === 'cod' ? codDetails.contact : undefined,
            deliveryTime: paymentMethod === 'cod' ? codDetails.deliveryTime : undefined,
            paymentProof: proofUrl || undefined
        };

        const res = await axios.post('http://localhost:3000/api/orders', payload, { withCredentials: true });

        showToast(`Order Placed Successfully! ID: ${res.data.id}`, 'success');
        clearCart();
        navigate('/order-history'); // Redirect to history
    } catch (error) {
        showToast("Failed to place order. Please try again.", 'error');
    } finally {
        setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background font-body">
        <Navbar />
        <div className="pt-32 pb-12 max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-heading font-bold text-text mb-4">Your cart is empty</h2>
            <Link to="/menu" className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all">
                Browse Menu
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      
      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold text-text mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="bg-white rounded-3xl p-4 shadow-card flex items-center gap-4"
                    >
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="font-heading font-bold text-lg text-text">{item.name}</h3>
                            <p className="text-primary font-bold">₱{item.price}</p>
                        </div>

                        <div className="flex items-center gap-3">
                             <div className="flex items-center border border-secondary/20 rounded-full px-3 py-1 space-x-3">
                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-text/60 hover:text-primary"><Minus size={16}/></button>
                                <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-text/60 hover:text-primary"><Plus size={16}/></button>
                             </div>
                             <button onClick={() => removeItem(item.id)} className="p-2 text-error/60 hover:text-error hover:bg-error/10 rounded-full transition-colors">
                                 <Trash2 size={20} />
                             </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Summary & Checkout Form */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-elevated sticky top-28">
                    <h2 className="font-heading font-bold text-2xl text-text mb-6">Payment Details</h2>

                    {/* Method Selector */}
                    <div className="flex gap-2 mb-6">
                        <button 
                            onClick={() => setPaymentMethod('cod')}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-400'}`}
                        >
                            Cash on Delivery
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('gcash')}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${paymentMethod === 'gcash' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-400'}`}
                        >
                            GCash
                        </button>
                    </div>

                    {/* Forms */}
                    <div className="mb-6 space-y-4">
                        {paymentMethod === 'cod' ? (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-text/60 mb-1">Shipping Address</label>
                                    <textarea 
                                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary outline-none text-sm"
                                        rows={3}
                                        placeholder="Complete Address..."
                                        value={codDetails.address}
                                        onChange={(e) => setCodDetails({...codDetails, address: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text/60 mb-1">Contact Number</label>
                                    <input 
                                        type="tel"
                                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary outline-none text-sm"
                                        placeholder="0912 345 6789"
                                        value={codDetails.contact}
                                        onChange={(e) => setCodDetails({...codDetails, contact: e.target.value})}
                                    />
                                </div>
                                <div className="text-xs text-text/60 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                    <p className="font-bold">COD Terms:</p>
                                    <p>Min. order ₱200. Delivery fee ₱50.</p>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-sm">
                                    <p className="font-bold text-blue-800 mb-2">Send Payment to:</p>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-blue-600">Name:</span>
                                        <span className="font-bold font-mono">Christian James Cañete</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-blue-600">GCash No:</span>
                                        <span className="font-bold font-mono text-lg">0917-123-4567</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-text/60 mb-1">Upload Proof</label>
                                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors relative
                                        ${paymentProof ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}
                                    `}>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            {paymentProof ? (
                                                <>
                                                    <div className="bg-primary text-white p-2 rounded-full"><Upload size={16}/></div>
                                                    <span className="text-sm font-bold text-primary truncate max-w-[200px]">{paymentProof.name}</span>
                                                    <span className="text-xs text-text/40">Click to replace</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={24} className="text-text/30 mb-1"/>
                                                    <span className="text-sm text-text/60 font-bold">Click to Upload Screenshot</span>
                                                    <span className="text-xs text-text/40">JPG, PNG supported</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Totals */}
                    <div className="space-y-4 mb-6 border-t border-dashed border-secondary/30 pt-4">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>₱{cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Shipping</span>
                            <span>₱{shipping}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl text-text">
                            <span>Total</span>
                            <span className="text-primary">₱{finalTotal}</span>
                        </div>
                    </div>

                    <button 
                       onClick={handleCheckout}
                       disabled={loading || uploading}
                       className="w-full py-4 bg-primary text-white rounded-2xl font-bold font-heading shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (uploading ? 'Uploading Proof...' : 'Processing...') : `Place Order — ₱${finalTotal}`} <ArrowRight size={20}/>
                    </button>
                    <p className="text-center text-xs text-text/40 mt-4">Secure Checkout</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
