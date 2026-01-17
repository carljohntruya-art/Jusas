import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import apiClient from '../api/apiClient';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const { showToast } = useToastStore();
    
    useEffect(() => {
        if (user) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await apiClient.get('/orders');
            setOrders(res.data.orders);
        } catch (error) {
            console.error(error);
            // Don't show toast on every poll fail, maybe just first time
            if (loading) showToast('Failed to load history', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 text-center">
                <h2 className="text-2xl font-bold">Please login to view order history</h2>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background font-body">
            <Navbar />
            <div className="pt-24 pb-12 max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-heading font-bold text-text mb-8">My Orders</h1>

                {loading ? <div className="text-center">Loading...</div> : orders.length === 0 ? (
                    <div className="text-center text-text/60">No orders found yet.</div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-3xl shadow-card border border-transparent hover:border-primary/20 transition-all">
                                <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                                    <div>
                                        <div className="font-bold text-lg">Order #{order.id}</div>
                                        <div className="text-sm text-text/40">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full font-bold text-sm
                                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                                          order.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                    `}>
                                        {order.status}
                                    </div>
                                </div>

                                {order.status === 'CANCELLED' && order.declineReason && (
                                    <div className="mb-4 p-4 bg-red-50 rounded-xl text-red-700 text-sm border border-red-100">
                                        <span className="font-bold">⚠️ Order Cancelled:</span> {order.declineReason}
                                    </div>
                                )}

                                <div className="space-y-2 mb-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.productId || item.id} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                 <img src={item.product?.imageUrl} className="w-10 h-10 rounded-lg bg-gray-100 object-cover" />
                                                 <span className="text-sm font-medium">{item.product?.name || 'Product'} <span className="text-text/40">x{item.quantity}</span></span>
                                            </div>
                                            <span className="font-bold text-sm">₱{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center text-sm font-bold pt-4 border-t border-dashed border-gray-200">
                                    <span className="text-text/60">Total Amount</span>
                                    <span className="text-xl text-primary">₱{order.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
