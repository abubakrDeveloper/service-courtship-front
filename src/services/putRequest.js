import axios from "axios";

const serverURL = import.meta.env.VITE_SERVER_URL;
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER
const API = axios.create({baseURL: serverURL})

export const updateReq = (id, data, method) => {
    const token = localStorage.getItem("token");
    return API.patch(`/${method}/${id}`, data, { headers: { Authorization: `Bearer ${token}`}});
};

export const likeReq = (id, data) => {
    const token = localStorage.getItem("token");
    return API.put(`/user/like/${id}`, data, { headers: { token, verificationtoken: accessUrl}});
}