import { useState, useEffect } from 'react';
import { X, Save, Type, DollarSign, Package, Image as ImageIcon, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    product?: any; // If present, we are editing
}

const ProductModal = ({ isOpen, onClose, onSubmit, product }: ProductModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        imageCredit: '',
        isFeatured: false
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                stock: product.stock.toString(),
                imageUrl: product.imageUrl,
                imageCredit: product.imageCredit || '',
                isFeatured: product.isFeatured
            });
        } else {
            // Reset for new product
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                imageUrl: '',
                imageCredit: '',
                isFeatured: false
            });
        }
    }, [product, isOpen]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="font-heading font-bold text-2xl text-text">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <X size={24} className="text-text/60"/>
                        </button>
                    </div>

                    {/* Scrollable Form */}
                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Basics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-text mb-2 flex items-center gap-2">
                                        <Type size={16} className="text-primary"/> Name
                                    </label>
                                    <input 
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary outline-none text-sm transition-all"
                                        placeholder="Tropical Paradise Smoothie"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text mb-2 flex items-center gap-2">
                                        <DollarSign size={16} className="text-secondary"/> Price
                                    </label>
                                    <input 
                                        name="price"
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-secondary outline-none text-sm transition-all"
                                        placeholder="150.00"
                                    />
                                </div>
                            </div>

                            {/* Stock & Image */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-text mb-2 flex items-center gap-2">
                                        <Package size={16} className="text-accent"/> Stock
                                    </label>
                                    <input 
                                        name="stock"
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent outline-none text-sm transition-all"
                                        placeholder="50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text mb-2 flex items-center gap-2">
                                        <ImageIcon size={16} className="text-purple-500"/> Image URL
                                    </label>
                                    <input 
                                        name="imageUrl"
                                        required
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-purple-500 outline-none text-sm transition-all"
                                        placeholder="https://images.unsplash.com..."
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-text mb-2 flex items-center gap-2">
                                    <AlignLeft size={16} className="text-orange-500"/> Description
                                </label>
                                <textarea 
                                    name="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-orange-500 outline-none text-sm transition-all resize-none"
                                    placeholder="Describe the smoothie ingredients and taste..."
                                />
                            </div>

                            {/* Featured Toggle */}
                            <div className="flex items-center gap-4 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                <input 
                                    type="checkbox"
                                    id="isFeatured"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                                />
                                <label htmlFor="isFeatured" className="font-bold text-text text-sm cursor-pointer select-none">
                                    Mark as Featured Product (Shows on Request Section)
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-text/60 hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            form="product-form"
                            disabled={loading}
                            className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={20}/>
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductModal;
