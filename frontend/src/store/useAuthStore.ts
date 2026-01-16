import { create } from 'zustand';
import axios from 'axios';
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

// Config Axios to allow cookies
axios.defaults.withCredentials = true;
const API_URL = 'http://localhost:3000/api/auth';
const CART_API = 'http://localhost:3000/api/cart';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading to check auth on mount

  login: async (email, password) => {
    try {
      console.log('AuthStore: Attempting login for', email);
      const res = await axios.post(`${API_URL}/login`, { email, password });
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
            await axios.post(`${CART_API}/merge`, { guestCart }, { withCredentials: true });
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
      const res = await axios.post(`${API_URL}/register`, { email, password, name });
      // DO NOT set user state - allow redirect to login
      return res.data;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false });
      useCartStore.getState().clearCart(); // Clear sensitive user cart data
    } catch (error) {
      console.error('Logout failed', error);
    }
  },

  checkAuth: async () => {
    try {
      console.log('AuthStore: Checking auth...');
      const res = await axios.get(`${API_URL}/me`);
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
