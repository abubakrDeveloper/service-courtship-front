import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER;
const API = axios.create({ baseURL: serverUrl });

export const getReq = (method) =>
  API.get(`/${method}`, {
    headers: { verificationtoken: accessUrl },
  })
  
export const getOneReq = (id, method) =>
  API.get(`/${method}/${id}`, {
    headers: { verificationtoken: accessUrl },
  });