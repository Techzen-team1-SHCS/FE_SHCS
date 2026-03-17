import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // URL của Laravel backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
///
// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url);
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Clearing storage and redirecting...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Chỉ redirect nếu không phải đang ở trang chủ để tránh loop
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;