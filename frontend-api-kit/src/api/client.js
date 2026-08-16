/**
 * Frontend → Backend API Client
 * Dán file này vào: frontend/src/api/client.js
 * Cấu hình Vite proxy hoặc dùng đường dẫn tuyệt đối
 */
import axios from 'axios';
import { toast } from 'react-toastify';

// DEV:  vite proxy /api → localhost:5000 (xem vite.config.js)
// PROD: https://dxgroup.vn/api
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// --- Gắn token (nếu user đăng nhập Admin) ---
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('dx_token');
  if (t) cfg.headers.Authorization = 'Bearer ' + t;
  return cfg;
});

// --- Bắt lỗi toàn cục ---
api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || err.message || 'Lỗi kết nối server';
    if (err.response?.status !== 401) toast.error(msg);
    return Promise.reject(err);
  }
);

export default api;
export { BASE_URL };
