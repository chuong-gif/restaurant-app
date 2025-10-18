// src/configs/client/APIs.ts

// Lấy endpoint từ biến môi trường Vite hoặc fallback sang localhost
export const API_ENDPOINT =
    import.meta.env.VITE_API_ENDPOINT || "http://localhost:6969/api";

// Danh sách các route API
export const API_DATA = {
    forgotPassword: "/auth_admin/forgot-password",
    changePassword: "/auth_admin/change-password",
    reservations_admin: "/reservations_t_admin",
    statistical: "/statistical",
};
