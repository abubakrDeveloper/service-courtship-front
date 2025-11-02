import axios from "axios";

const serverURL = import.meta.env.VITE_SERVER_URL;
const API = axios.create({
  baseURL: serverURL,
  withCredentials: true,
});

export const openShift = (data) => {
    const token = localStorage.getItem("token");
    return API.post(`/shifts/open`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
};
export const closeShift = (id) => {
    const token = localStorage.getItem("token");
    return API.post(`/shifts/${id}/close`, {
      headers: { Authorization: `Bearer ${token}` },
    });
};
export const getCurrentShift = () => {
    const token = localStorage.getItem("token");
    return API.get(`//shifts/current`, {
      headers: { Authorization: `Bearer ${token}` },
    });
};
