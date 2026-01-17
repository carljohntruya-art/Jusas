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
    console.log('AuthStore: Initiating logout');
    
    // STEP 1: Immediately clear client state (synchronous)
    set({ user: null, isAuthenticated: false, isLoading: false });
    useCartStore.getState().clearCart();
    localStorage.clear(); // Nuclear option - clears everything
    
    // STEP 2: Clear cookies (sync)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    
    // STEP 3: Call logout API (don't wait for it, non-blocking)
    apiClient.post(`${AUTH_ROUTE}/logout`).catch((err) => {
      console.warn('Logout API failed, but client state already cleared', err);
    });
    
    // STEP 4: Hard redirect (this kills all React state)
    console.log('AuthStore: Redirecting to home');
    window.location.href = '/';
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
