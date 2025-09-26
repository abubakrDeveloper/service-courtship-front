import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const accessUrl = import.meta.env.VITE_ACCESSTOKEN_SERVER;

const API = axios.create({ baseURL: serverUrl });

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // refresh token noto‘g‘ri yoki user o‘chirilgan bo‘lsa → logout
    const backendMessage = error.response?.data?.message;
    if (
      backendMessage === "deleted_user" ||
      backendMessage === "invalid refresh token"
    ) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // faqat access token muddati tugagan bo‘lsa refresh qilishga urinamiz
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = token;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        const { data } = await axios.post(accessUrl, {
          refresh_token: refreshToken,
        });

        const newAccessToken = data?.Data?.token;
        localStorage.setItem("token", newAccessToken);

        API.defaults.headers.Authorization = newAccessToken;
        processQueue(null, newAccessToken);

        return API(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
