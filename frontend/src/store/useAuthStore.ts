import { create } from 'zustand';
import apiClient from '../api/apiClient';
import { useCartStore } from './useCartStore';

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Routes
const AUTH_ROUTE = '/auth';
const CART_ROUTE = '/cart';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading to check auth on mount

  login: async (email, password) => {
    try {
      console.log('AuthStore: Attempting login for', email);
      const res = await apiClient.post(`${AUTH_ROUTE}/login`, { email, password });
      console.log('AuthStore: Login success, setting user', res.data.user);
      
      const user = res.data.user;
      set({ user, isAuthenticated: true });

      // Handle Cart Merging
      const currentCartItems = useCartStore.getState().items;
      if (currentCartItems.length > 0) {
        // Map frontend items to simplified format for merge
        const guestCart = currentCartItems.map(item => ({
             productId: item.productId,
             quantity: item.quantity
        }));
        
        try {
            await apiClient.post(`${CART_ROUTE}/merge`, { guestCart });
        } catch (mergeError) {
            console.error('Cart merge failed:', mergeError);
        }
      }
      
      // Sync with server cart (now merged)
      await useCartStore.getState().syncCart();
      
    } catch (error) {
      console.error('AuthStore: Login failed', error);
      throw error;
    }
  },

  register: async (email, password, name) => {
    try {
      const res = await apiClient.post(`${AUTH_ROUTE}/register`, { email, password, name });
      // DO NOT set user state - allow redirect to login
      return res.data;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.post(`${AUTH_ROUTE}/logout`);
    } catch (error) {
      console.warn('Logout API call failed, but clearing local state');
    } finally {
      // ALWAYS clear local state
      set({ user: null, isAuthenticated: false });
      useCartStore.getState().clearCart();
      localStorage.removeItem('auth_user');
      
      // Clear any other auth-related storage
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Only force reload if on a protected page
      const protectedPaths = ['/admin', '/orders', '/cart', '/account'];
      const currentPath = window.location.pathname;
      
      if (protectedPaths.some(path => currentPath.startsWith(path))) {
        // On protected page → force reload to home
        window.location.href = '/';
      } else {
        // On public page → just redirect
        window.location.href = '/';
      }
    }
  },

  checkAuth: async () => {
    try {
      console.log('AuthStore: Checking auth...');
      const res = await apiClient.get(`${AUTH_ROUTE}/me`);
      console.log('AuthStore: Auth check success', res.data.user);
      const user = res.data.user;
      set({ user, isAuthenticated: true, isLoading: false });
      
      // If auth restored, sync cart
      useCartStore.getState().syncCart();

    } catch (error) {
       console.log('AuthStore: Auth check failed/clean', error);
       set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
