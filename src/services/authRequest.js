import axios from "axios";

const serverURL = import.meta.env.VITE_SERVER_URL;
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER
const API = axios.create({baseURL: serverURL})  

export const sendVerication = (data) => {
    return API.post(`/api/auth/verification`, data)
};

export const signUp = (formData) => API.post(`/auth/signup`, formData)

export const login = (formData) => API.post(`/auth/login/admin`, formData)

export const sendMail = (formData) => API.post(`/auth/mail`, formData)