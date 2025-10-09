import { create } from "zustand";
import { getReq } from "../services/getRequeset";
import { addReq } from "../services/addRequest";
import { updateReq } from "../services/putRequest";

export const useEmployeeStore = create((set) => ({
  itemList: [],
  formValues: {},
  editingIndex: null,

  // ✅ Rasmlar ro‘yxati (productStore bilan bir xil qilindi)
  images: [],

  // ✅ Formni kuzatish
  setFormValues: (values) => set({ formValues: values }),
  clearFormValues: () => set({ formValues: {} }),

  // ✅ Rasm boshqaruvi (productStore dagidek)
  addImage: (path) =>
    set((state) => ({
      images: state.images.includes(path)
        ? state.images
        : [...state.images, path],
    })),

  removeImage: (path) =>
    set((state) => ({
      images: state.images.filter((img) => img !== path),
    })),

  clearImages: () => set({ images: [] }),

  // ✅ Listga employee qo‘shish
  addEmployee: (data) =>
    set((state) => ({
      itemList: [...state.itemList, data],
    })),

  // ✅ Listdan employee o‘chirish
  removeEmployee: (index) =>
    set((state) => ({
      itemList: state.itemList.filter((_, i) => i !== index),
    })),

  // ✅ Listdagi employee-ni yangilash
  updateEmployeeInList: (index, newData) =>
    set((state) => {
      const updated = [...state.itemList];
      updated[index] = newData;
      return { itemList: updated };
    }),

  setEmployeeList: (list) => set({ itemList: list }),
  setEditingIndex: (index) => set({ editingIndex: index }),

  // ✅ Serverdan bitta employee olish (edit)
  fetchEmployeeById: async (id) => {
    const res = await getReq(`admins/${id}`);
    return res?.data;
  },

  // ✅ Serverga yangi employee qo‘shish
  addEmployeeToServer: async (data) => {
    return await addReq(data, "admins");
  },

  // ✅ Serverda yangilash
  updateEmployeeToServer: async (id, data) => {
    return await updateReq(id, data, "admins");
  },
}));
