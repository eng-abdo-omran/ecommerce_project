import axios from "axios";
import { env } from "../app/config/env";
import { useAuthStore } from "../store/auth.store";

export const http = axios.create({
  baseURL: env.API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach Bearer token
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      const token = useAuthStore.getState().token;
      if (token) useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
