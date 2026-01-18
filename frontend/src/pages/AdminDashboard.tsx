import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import apiClient from '../api/apiClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, LayoutDashboard, Package, Plus, Edit, Trash2, Copy } from 'lucide-react';
import ProductModal from '../components/ProductModal';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const fetchData = async () => {
        try {
            const statsRes = await apiClient.get('/admin/stats');
            setStats(statsRes.data);
            const ordersRes = await apiClient.get('/orders');
            setOrders(ordersRes.data);
            const prodRes = await apiClient.get('/products');
            setProducts(prodRes.data);
        } catch (error) {
            console.error("Failed to load admin data", error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            await fetchData();
            setLoading(false);
        };
        loadInitialData();
        
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (id: number, status: string) => {
        let reason = null;
        if (status === 'CANCELLED') {
             reason = prompt("Enter reason for declining:");
             if (!reason) return; // Cancel if no reason provided
        }

        try {
            await apiClient.put(`/orders/${id}/status`, { status, declineReason: reason });
            // Immediate update (optimistic)
            setOrders(orders.map(o => o.id === id ? { ...o, status, declineReason: reason } : o));
        } catch (error) {
            alert("Failed to update status");
        }
    };
    
    // ... existing product functions ...
    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await apiClient.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert("Failed to delete product");
        }
    };

    const handleDuplicateProduct = async (id: number) => {
        try {
            const res = await apiClient.post(`/products/${id}/duplicate`);
            setProducts([...products, res.data]);
        } catch (error) {
            alert("Failed to duplicate product");
        }
    };

    const handleToggleFeature = async (id: number, currentStatus: boolean) => {
        // Optimistic UI
        setProducts(products.map(p => p.id === id ? { ...p, isFeatured: !currentStatus } : p));
        try {
            await apiClient.patch(`/products/${id}/feature`);
        } catch (error) {
            // Revert on error
            setProducts(products.map(p => p.id === id ? { ...p, isFeatured: currentStatus } : p));
            alert("Failed to toggle feature");
        }
    };

    const handleSaveProduct = async (data: any) => {
        try {
            if (editingProduct) {
                const res = await apiClient.put(`/products/${editingProduct.id}`, data);
                setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
            } else {
                const res = await apiClient.post(`/products`, data);
                setProducts([...products, res.data]);
            }
        } catch (error) {
            throw error; // Let modal handle error
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-background font-body">
            <Navbar />
            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-heading font-bold text-text mb-8">Admin Dashboard</h1>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-card flex items-center space-x-4">
                        <div className="p-4 bg-primary/10 text-primary rounded-xl">
                            <DollarSign size={32} />
                        </div>
                        <div>
                            <div className="text-text/60 font-medium">Total Revenue</div>
                            <div className="text-3xl font-bold text-text">₱{stats?.totalRevenue.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-card flex items-center space-x-4">
                         <div className="p-4 bg-secondary/10 text-secondary rounded-xl">
                            <LayoutDashboard size={32} />
                        </div>
                        <div>
                            <div className="text-text/60 font-medium">Total Orders</div>
                            <div className="text-3xl font-bold text-text">{stats?.totalOrders}</div>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-card flex items-center space-x-4">
                         <div className="p-4 bg-accent/10 text-accent rounded-xl">
                            <Package size={32} />
                        </div>
                        <div>
                            <div className="text-text/60 font-medium">Best Seller</div>
                            <div className="text-xl font-bold text-text truncate max-w-[150px]">{stats?.topProducts[0]?.name || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Charts & Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                     <div className="bg-white p-6 rounded-3xl shadow-elevated">
                        <h2 className="font-heading font-bold text-xl mb-6">Recent Sales Trend</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.recentSales}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                    <YAxis tickLine={false} axisLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => `₱${value}`} />
                                    <Tooltip 
                                        cursor={{fill: '#F3F4F6'}}
                                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                    />
                                    <Bar dataKey="amount" fill="#00B39F" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                     </div>

                     <div className="bg-white p-6 rounded-3xl shadow-elevated">
                        <h2 className="font-heading font-bold text-xl mb-6">Top Products</h2>
                        <div className="space-y-4">
                            {stats?.topProducts.map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-background rounded-xl">
                                    <div className="flex items-center space-x-4">
                                        <span className={`font-bold text-lg w-6 ${i === 0 ? 'text-accent' : 'text-text/40'}`}>#{i + 1}</span>
                                        <span className="font-medium text-text">{p.name}</span>
                                    </div>
                                    <span className="font-bold text-primary">{p.totalSold} sold</span>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-3xl shadow-elevated overflow-hidden mb-12">
                     <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-heading font-bold text-xl">Recent Orders</h2>
                        <button onClick={() => fetchData()} className="text-sm text-primary font-bold hover:underline">Refresh</button>
                     </div>
                     <div className="overflow-x-auto">
                         <table className="w-full text-left">
                             <thead className="bg-gray-50 text-gray-500 font-medium">
                                 <tr>
                                     <th className="p-4">Order ID</th>
                                     <th className="p-4">Customer</th>
                                     <th className="p-4">Total</th>
                                     <th className="p-4">Payment</th>
                                     <th className="p-4">Status</th>
                                     <th className="p-4">Action</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100">
                                 {orders.map((order) => (
                                     <tr key={order.id} className="hover:bg-gray-50/50">
                                         <td className="p-4 font-bold">#{order.id}</td>
                                         <td className="p-4">
                                            <div className="font-bold">{order.user?.name || `Guest`}</div>
                                            <div className="text-xs text-text/40">{order.contactNumber || 'No Contact'}</div>
                                            {order.status === 'CANCELLED' && order.declineReason && (
                                                <div className="text-xs text-red-500 font-bold mt-1">Reason: {order.declineReason}</div>
                                            )}
                                         </td>
                                         <td className="p-4">₱{order.total}</td>
                                         <td className="p-4 text-sm">
                                            <span className="font-bold">{order.paymentMethod}</span>
                                            {/* ✅ FIX #6: Payment Proof Preview */}
                                            {order.paymentProof && (
                                                <div className="mt-2">
                                                    <img 
                                                        src={order.paymentProof} 
                                                        alt="Payment Proof" 
                                                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:opacity-80 transition"
                                                        onClick={() => window.open(order.paymentProof, '_blank')}
                                                        title="Click to enlarge"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(order.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                         </td>
                                         <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold
                                                ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                                                  order.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                                                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                            `}>
                                                {order.status}
                                            </span>
                                         </td>
                                         <td className="p-4 flex gap-2">
                                            {order.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => handleStatusUpdate(order.id, 'APPROVED')} className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90">Approve</button>
                                                    <button onClick={() => handleStatusUpdate(order.id, 'CANCELLED')} className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200">Decline</button>
                                                </>
                                            )}
                                            {order.status === 'APPROVED' && (
                                                <button onClick={() => handleStatusUpdate(order.id, 'DELIVERED')} className="text-xs bg-success text-white px-3 py-1 rounded hover:bg-success/90">Mark Delivered</button>
                                            )}
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-3xl shadow-elevated overflow-hidden">
                     <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-heading font-bold text-xl">Inventory Management</h2>
                        <button 
                            onClick={handleAddProduct}
                            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all"
                        >
                            <Plus size={18} /> Add Product
                        </button>
                     </div>
                     <div className="overflow-x-auto">
                         <table className="w-full text-left">
                             <thead className="bg-gray-50 text-gray-500 font-medium">
                                 <tr>
                                     <th className="p-4">Product</th>
                                     <th className="p-4">Price</th>
                                     <th className="p-4">Stock</th>
                                     <th className="p-4">Featured</th>
                                     <th className="p-4 text-right">Actions</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100">
                                 {products.map((p) => (
                                     <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                         <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                                <span className="font-medium text-text">{p.name}</span>
                                            </div>
                                         </td>
                                         <td className="p-4">₱{p.price}</td>
                                         <td className="p-4">
                                             <span className={`font-bold ${p.stock < 10 ? 'text-error' : 'text-success'}`}>{p.stock}</span>
                                         </td>
                                         <td className="p-4">
                                             <input 
                                               type="checkbox" 
                                               checked={p.isFeatured} 
                                               onChange={() => handleToggleFeature(p.id, p.isFeatured)}
                                               className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer"
                                             />
                                         </td>
                                         <td className="p-4 text-right">
                                             <div className="flex justify-end gap-2">
                                                 <button onClick={() => handleDuplicateProduct(p.id)} title="Duplicate" className="p-2 text-text/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                     <Copy size={18} />
                                                 </button>
                                                 <button onClick={() => handleEditProduct(p)} title="Edit" className="p-2 text-text/40 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
                                                     <Edit size={18} />
                                                 </button>
                                                 <button onClick={() => handleDeleteProduct(p.id)} title="Delete" className="p-2 text-text/40 hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                                                     <Trash2 size={18} />
                                                 </button>
                                             </div>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                </div>

                <ProductModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSaveProduct}
                    product={editingProduct}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;


