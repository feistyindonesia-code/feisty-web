import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Menu, CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (menu: Menu, quantity?: number) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (menu: Menu, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.menu.id === menu.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.menu.id === menu.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { menu, quantity }],
          };
        });
        get().openCart();
      },

      removeItem: (menuId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.menu.id !== menuId),
        }));
      },

      updateQuantity: (menuId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(menuId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.menu.id === menuId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.menu.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'feisty-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);