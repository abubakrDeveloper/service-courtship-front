import { create } from "zustand";

export const useProductStore = create((set) => ({
  itemList: [],
  formValues: {},
  images: [], // ⬅️ Yuklangan rasmlar ro‘yxati
  editingIndex: null,

  addProduct: (product) =>
    set((state) => ({ itemList: [...state.itemList, product] })),

  removeProduct: (index) =>
    set((state) => ({
      itemList: state.itemList.filter((_, i) => i !== index),
    })),

  setProductList: (list) => set({ itemList: list }),

  setFormValues: (values) => set((state) => ({ formValues: { ...state.formValues, ...values } })),
  clearFormValues: () => set({ formValues: {} }),
  setEditingIndex: (index) => set({ editingIndex: index }),
  updateProduct: (index, updatedProduct) =>
    set((state) => {
      const newList = [...state.itemList];
      newList[index] = updatedProduct;
      return { itemList: newList };
    }),

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
