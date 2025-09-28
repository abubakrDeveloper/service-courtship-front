import axios from "axios";

const serverURL = import.meta.env.VITE_SERVER_URL;
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER
const API = axios.create({baseURL: serverURL})  

export const sendVerication = (data) => {
    return API.post(`/api/auth/verification`, data, {headers: {verificationtoken: accessUrl}})
};

export const signUp = (formData) => API.post(`/auth/signup`, formData, {headers: {verificationtoken: accessUrl}})

export const login = (formData) => API.post(`/auth/login/admin`, formData, {headers: {verificationtoken: accessUrl}})

export const sendMail = (formData) => API.post(`/auth/mail`, formData, {headers: {verificationtoken: accessUrl}})