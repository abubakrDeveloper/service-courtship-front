import axios from "axios";

const serverURL = import.meta.env.VITE_SERVER_URL;
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER
const API = axios.create({baseURL: serverURL})

export const deleteReq = (id, method) => {
    const token = localStorage.getItem("token");
    return API.delete(`/${method}/${id}`, { headers: { token, verificationtoken: accessUrl} });
};

export const deleteUser = (id) => {
    const token = localStorage.getItem("token");
    return API.delete(`/user/${id}`, { headers: { token, verificationtoken: accessUrl} });
};