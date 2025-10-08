import axios from "axios"


const serverURL = import.meta.env.VITE_SERVER_URL
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER

const API = axios.create({baseURL: serverURL});

export const addMessage = (data) => {
    const token = localStorage.getItem("token");
    return API.post('/message', data, {headers: {token, verificationtoken: accessUrl}})
};

export const getMessage = (chatId) => {
    const token = localStorage.getItem("token");
    return API.get(`/message/${chatId}`, {headers: {token, verificationtoken: accessUrl}})
};

export const updateMessage = (messageId, data) => {
    const token = localStorage.getItem("token");
    return API.put(`/message/${messageId}`, data, {headers: {token, verificationtoken: accessUrl}})
};

export const deleteMessage = (messageId) => {
    const token = localStorage.getItem("token");
    return API.delete(`/message/${messageId}`, {headers: {token, verificationtoken: accessUrl}})
};