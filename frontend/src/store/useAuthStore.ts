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
      set({ user: null, isAuthenticated: false });
      useCartStore.getState().clearCart(); // Clear sensitive user cart data
    } catch (error) {
      console.error('Logout failed', error);
    }
  },

  checkAuth: async (retries = 2) => {
    try {
      console.log(`AuthStore: Checking auth... (Retries left: ${retries})`);
      const res = await apiClient.get(`${AUTH_ROUTE}/me`);
      console.log('AuthStore: Auth check success', res.data.user);
      const user = res.data.user;
      set({ user, isAuthenticated: true, isLoading: false });
      
      // If auth restored, sync cart
      useCartStore.getState().syncCart();

    } catch (error: any) {
       // Only retry on non-401 errors (transient network issues)
       if (retries > 0 && error.response?.status !== 401) {
          console.warn('AuthStore: Auth check failed due to transient error, retrying...', error.message);
          return useAuthStore.getState().checkAuth(retries - 1);
       }
       
       console.log('AuthStore: Auth check failed/Unauthorized', error.response?.status || error.message);
       set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
