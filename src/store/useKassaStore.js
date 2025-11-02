import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useKassaStore = create(
  persist(
    (set, get) => ({
      kassaId: null,
      cart: [],
      delayedCustomers: [], // kechiktirilgan mijozlar ro'yxati
      total: 0,

      setKassaId: (id) => set({ kassaId: id }),

      addToCart: (product) => {
        const existing = get().cart.find((i) => i.id === product.id);
        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ cart: [...get().cart, { ...product, quantity: 1 }] });
        }
        get().recalcTotal();
      },

      decreaseQuantity: (id) => {
        const updated = get()
          .cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((i) => i.quantity > 0);
        set({ cart: updated });
        get().recalcTotal();
      },

      deleteFromCart: (id) => {
        set({ cart: get().cart.filter((i) => i.id !== id) });
        get().recalcTotal();
      },

      clearCart: () => set({ cart: [], total: 0 }),

      recalcTotal: () => {
        const total = get().cart.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        set({ total });
      },

      // Kechiktirilgan mijozni qo'shish
      addDelayedCustomer: () => {
        const currentCart = get().cart;
        if (currentCart.length === 0) return;
        const newQueue = [
          ...get().delayedCustomers,
          {
            id: Date.now(),
            cart: currentCart,
            createdAt: new Date().toLocaleTimeString(),
          },
        ];
        set({ delayedCustomers: newQueue, cart: [], total: 0 });
      },

      // Kechiktirilgan mijozni qayta yuklash
      restoreCustomer: (id) => {
        const found = get().delayedCustomers.find((d) => d.id === id);
        if (found) {
          set({
            cart: found.cart,
            delayedCustomers: get().delayedCustomers.filter(
              (c) => c.id !== id
            ),
          });
          get().recalcTotal();
        }
      },

      clearAll: () => set({ cart: [], delayedCustomers: [], total: 0 }),
    }),
    {
      name: "kassa-storage", // localStorage da saqlanadi
    }
  )
);
