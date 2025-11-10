import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const isServer = typeof window === "undefined";

// Dùng biến môi trường
const API_BASE_URL_CLIENT = process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT;
const API_BASE_URL_SERVER = process.env.API_BASE_URL_SERVER;

// Nếu thiếu, báo lỗi rõ ràng
if (!API_BASE_URL_CLIENT || !API_BASE_URL_SERVER) {
    console.warn("⚠️ Thiếu biến môi trường API_BASE_URL trong .env.local!");
}

const baseURL = isServer ? API_BASE_URL_SERVER : API_BASE_URL_CLIENT;

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// === Interceptor 1: đính token ===
api.interceptors.request.use(
    (config) => {
        if (!isServer) {
            const token = useAuthStore.getState().token;
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// === Interceptor 2: bắt lỗi 401/403 ===
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!isServer && error.response) {
            const { status } = error.response;
            const { logout } = useAuthStore.getState();

            if ((status === 401 || status === 403) && useAuthStore.getState().token) {
                console.error("Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất...");
                logout();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;

export const AUTH_ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    SOCIAL_LOGIN: "/auth/social-login",
};
