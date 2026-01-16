import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

const API_URL = 'http://localhost:3000/api/cart';

export interface CartItem {
  id: number; // Product ID for guest, or CartItem ID for user? 
  // Wait, existing store uses Product ID as 'id' for items. 
  // Backend separation: CartItem ID vs Product ID.
  // Frontend mostly cares about Product ID for display, but needs CartItem ID for updates?
  // Let's stick to Product ID for now or adjust.
  // Actually, backend returns CartItem which has ID.
  // For Guest: we generate a stable ID or just use Product ID.
  // Let's normalize: 'id' in frontend item = Product ID? 
  // Backend returns: { id: CartItemId, productId: ProductId, ... }
  // To avoid confusion: let's keep 'id' as Product ID for frontend convenience if possible, 
  // OR map backend CartItem ID to a local property.
  // BETTER: 'id' = Product ID (unique per cart). 
  // BUT backend update/delete uses CartItem ID.
  // Let's adjust interface:
  cartItemId?: number; // Backend ID
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      syncCart: async () => {
        try {
          const res = await axios.get(API_URL, { withCredentials: true });
          // Map backend items to frontend format
          const backendItems = res.data.items.map((item: any) => ({
            cartItemId: item.id,
            productId: item.productId, // Ensure backend returns productId
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            imageUrl: item.product.imageUrl || item.product.image // Handle various image fields
          }));
          set({ items: backendItems });
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      },

      addItem: async (newItem) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await axios.post(`${API_URL}/items`, {
              productId: newItem.productId || newItem.id, // Handle if passed as id
              quantity: newItem.quantity
            }, { withCredentials: true });
            await get().syncCart();
          } catch (error) {
           console.error('Failed to add item (server):', error);
          }
        } else {
            // Guest Logic
            set((state) => {
                const existing = state.items.find((i) => i.productId === (newItem.productId || newItem.id));
                if (existing) {
                    return {
                        items: state.items.map((i) =>
                            i.productId === (newItem.productId || newItem.id)
                                ? { ...i, quantity: i.quantity + newItem.quantity }
                                : i
                        ),
                    };
                }
                // Normalize new item
                const itemToAdd = { ...newItem, productId: newItem.productId || newItem.id };
                return { items: [...state.items, itemToAdd] };
            });
        }
      },

      removeItem: async (productId) => {
        const { isAuthenticated } = useAuthStore.getState();
         // Find item to get CartItemId if needed
        const item = get().items.find(i => i.productId === productId);
        
        if (isAuthenticated) {
            if (!item?.cartItemId) return; // Should have it if synced
            try {
                await axios.delete(`${API_URL}/items/${item.cartItemId}`, { withCredentials: true });
                await get().syncCart();
            } catch (error) {
                console.error('Failed to remove item (server):', error);
            }
        } else {
            set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
        }
      },

      updateQuantity: async (productId, quantity) => {
        const { isAuthenticated } = useAuthStore.getState();
        const item = get().items.find(i => i.productId === productId);

        if (isAuthenticated) {
            if (!item?.cartItemId) return;
            try {
                 await axios.put(`${API_URL}/items/${item.cartItemId}`, { quantity }, { withCredentials: true });
                 await get().syncCart();
            } catch (error) {
                console.error('Failed to update quantity (server):', error);
            }
        } else {
            set((state) => ({
                items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
            }));
        }
      },

      clearCart: () => set({ items: [] }),

      total: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    }),
    {
      name: 'jusas-cart',
    }
  )
);
