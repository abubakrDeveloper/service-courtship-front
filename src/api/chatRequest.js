import axios from "axios"


const serverURL = import.meta.env.VITE_SERVER_URL
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER
const API = axios.create({baseURL: serverURL});

export const userChats = () => {
    const token = localStorage.getItem("access_token");
    return API.get('/api/chat', {headers: {token, verificationtoken: accessUrl}})
};

export const findChat = (firstId, secondId) => {
    const token = localStorage.getItem("access_token");
    return API.get(`/api/chat/${firstId}/${secondId}`, {headers: {token, verificationtoken: accessUrl}})
};

export const deleteChat = (chatId) => {
    const token = localStorage.getItem("access_token");
    return API.delete(`/api/chat/${chatId}`, {headers: {token, verificationtoken: accessUrl}})
};