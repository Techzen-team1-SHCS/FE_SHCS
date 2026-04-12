import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api"; // URL của Laravel backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
///
// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.config?.url);
    if (error.response?.status === 503 && error.response?.data?.is_maintenance) {
      if (window.location.pathname !== "/maintenance") {
        localStorage.setItem("lastPathBeforeMaintenance", window.location.pathname + window.location.search);
        window.location.href = "/maintenance";
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const hasToken = localStorage.getItem("token");
      if (hasToken) {
        console.warn("Unauthorized! Clearing storage and redirecting...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Chỉ redirect nếu không phải đang ở trang chủ để tránh loop
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
