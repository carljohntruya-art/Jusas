import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from '../config/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  redirectTo = ROUTES.LOGIN
}) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure auth store is initialized
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        replace 
        state={{ 
          from: location,
          message: 'Please login to access this page'
        }} 
      />
    );
  }

  // Check admin role if required
  if (requireAdmin && user?.role !== 'admin') {
    return (
      <Navigate 
        to={ROUTES.HOME}
        replace 
        state={{ 
          from: location,
          message: 'Admin access required'
        }} 
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
