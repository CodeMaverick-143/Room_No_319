import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product: Product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If the item already exists in the cart, update its quantity
        return {
          items: state.items.map((item) => 
            item.id === product.id 
              ? { ...item, cartQuantity: item.cartQuantity + quantity } 
              : item
          )
        };
      } else {
        // Otherwise, add the new item to the cart
        return {
          items: [...state.items, { ...product, cartQuantity: quantity }]
        };
      }
    });
  },

  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId)
    }));
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state) => ({
      items: state.items.map((item) => 
        item.id === productId 
          ? { ...item, cartQuantity: quantity } 
          : item
      )
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.cartQuantity, 
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce(
      (count, item) => count + item.cartQuantity, 
      0
    );
  },
}));