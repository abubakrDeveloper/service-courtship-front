import axios from "axios";

const serverURL = import.meta.env.VITE_SERVER_URL;
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER
const API = axios.create({baseURL: serverURL})

export const updateReq = (id, data, method) => {
    const token = localStorage.getItem("access_token");
    return API.put(`/api/${method}/${id}`, data, { headers: {token, verificationtoken: accessUrl}});
};

export const likeReq = (id, data) => {
    const token = localStorage.getItem("access_token");
    return API.put(`/api/user/like/${id}`, data, { headers: { token, verificationtoken: accessUrl}});
}