import { create } from "zustand";

export const useShopStore = create((set) => ({
  productList: [],
  formValues: {},
  images: [], // ⬅️ Yuklangan rasmlar ro‘yxati

  addProduct: (product) =>
    set((state) => ({ productList: [...state.productList, product] })),

  removeProduct: (index) =>
    set((state) => ({
      productList: state.productList.filter((_, i) => i !== index),
    })),

  setProductList: (list) => set({ productList: list }),

  setFormValues: (values) => set({ formValues: values }),
  clearFormValues: () => set({ formValues: {} }),

  // ✅ Rasm bilan ishlash
  addImage: (path) =>
    set((state) => ({
      images: [...state.images, path],
    })),
  removeImage: (path) =>
    set((state) => ({
      images: state.images.filter((img) => img !== path),
    })),
  clearImages: () => set({ images: [] }),
}));
