import axios from "axios";

const serverURL = import.meta.env.VITE_SERVER_URL;
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER
const API = axios.create({
  baseURL: serverURL,
  withCredentials: true,
});

export const addReq = (data, method) => {
    const token = localStorage.getItem("token");
    return API.post(`/api/${method}`, data, {
    headers: { token, verificationtoken: accessUrl },
    withCredentials: true,
    });
};