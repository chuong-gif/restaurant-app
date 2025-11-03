import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// URL API server của bạn
const API_BASE_URL = 'http://localhost:3307/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động đính kèm token vào mỗi request
api.interceptors.request.use(
    (config) => {
        // Lấy token từ Zustand store
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

// API endpoint cho auth
export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',         // 
    REGISTER: '/auth/register',   // [cite: 29]
    SOCIAL_LOGIN: '/auth/social-login', // [cite: 28]
};