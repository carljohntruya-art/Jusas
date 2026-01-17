import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import OrderHistory from './pages/OrderHistoryPage';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import Toast from './components/ui/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import { ROUTES } from './config/routes';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Toast />
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.MENU} element={<Menu />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.PRODUCT} element={<ProductDetails />} />
          
          <Route path={ROUTES.CART} element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          
          <Route path={ROUTES.ADMIN} element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path={ROUTES.ORDERS} element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
