import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// URL API khi gọi từ trình duyệt (client-side)
const API_BASE_URL_CLIENT = 'http://localhost:3307/api/v1';
// URL API khi gọi từ server (server-side rendering)
const API_BASE_URL_SERVER = 'http://localhost:3307/api/v1';

const isServer = typeof window === 'undefined';
const baseURL = isServer ? API_BASE_URL_SERVER : API_BASE_URL_CLIENT;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor 1: Gửi Request (Đính kèm token)
api.interceptors.request.use(
    (config) => {
        if (!isServer) {
            const token = useAuthStore.getState().token;
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// === THÊM MỚI: Interceptor 2: Xử lý Response (Bắt lỗi 401/403) ===
api.interceptors.response.use(
    (response) => {
        // Bất kỳ status code nào trong 2xx đều qua đây
        return response;
    },
    (error) => {
        // Bất kỳ status code nào ngoài 2xx đều qua đây
        if (!isServer && error.response) {
            const { status } = error.response;
            const { logout } = useAuthStore.getState();

            // Nếu là lỗi 401 (Unauthorized) hoặc 403 (Forbidden)
            // -> Token hỏng/hết hạn
            if (status === 401 || status === 403) {
                // Chỉ logout nếu đã có token (tránh logout khi đang ở trang login)
                if (useAuthStore.getState().token) {
                    console.error("Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất...");
                    logout(); // Xóa token khỏi store/localStorage
                    // Chuyển hướng người dùng về trang đăng nhập
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);
// ==========================================================

export default api;

// API endpoint cho auth (Giữ nguyên)
export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    SOCIAL_LOGIN: '/auth/social-login',
};