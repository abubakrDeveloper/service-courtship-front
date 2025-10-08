// store/shopStore.js
import { create } from "zustand";

export const useShopStore = create((set, get) => ({
  product: {},
  prices: [],
  images: [],
  
  setProduct: (data) => set({ product: { ...get().product, ...data } }),
  setPrices: (prices) => set({ prices }),
  addImage: (img) => set({ images: [...get().images, img] }),
  removeImage: (img) => set({ images: get().images.filter(i => i !== img) }),
  resetAll: () => set({ product: {}, prices: [], images: [] }),
}));
