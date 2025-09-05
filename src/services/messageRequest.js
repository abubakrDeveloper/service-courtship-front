import axios from "axios"


const serverURL = import.meta.env.VITE_SERVER_URL
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER

const API = axios.create({baseURL: serverURL});

export const addMessage = (data) => {
    const token = localStorage.getItem("access_token");
    return API.post('/api/message', data, {headers: {token, verificationtoken: accessUrl}})
};

export const getMessage = (chatId) => {
    const token = localStorage.getItem("access_token");
    return API.get(`/api/message/${chatId}`, {headers: {token, verificationtoken: accessUrl}})
};

export const updateMessage = (messageId, data) => {
    const token = localStorage.getItem("access_token");
    return API.put(`/api/message/${messageId}`, data, {headers: {token, verificationtoken: accessUrl}})
};

export const deleteMessage = (messageId) => {
    const token = localStorage.getItem("access_token");
    return API.delete(`/api/message/${messageId}`, {headers: {token, verificationtoken: accessUrl}})
};