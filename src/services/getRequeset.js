import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER;
const API = axios.create({ baseURL: serverUrl });

export const getReq = (method) =>{
  const token = localStorage.getItem('token')
  return API.get(`/${method}`, {
    headers: { Authorization: `Bearer ${token}` },
  })}
  
export const getOneReq = (id, method) =>{
  const token = localStorage.getItem('token')
  return API.get(`/${method}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });}