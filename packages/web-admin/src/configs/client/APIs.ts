// Lấy endpoint từ biến môi trường, fallback sang localhost nếu không có
export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "http://localhost:6969/api";

// Danh sách các route API
export const API_DATA = {
    forgotPassword: '/auth_admin/forgot-password',
    changePassword: '/auth_admin/change-password',
    reservations_admin: '/reservations_t_admin',
    statistical: '/statistical'
};
