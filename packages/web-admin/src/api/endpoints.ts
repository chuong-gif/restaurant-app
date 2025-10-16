export const API_BASE_URL =
    import.meta.env.VITE_API_ENDPOINT || "http://localhost:4000/api";

export const API_ENDPOINTS = {
    forgotPassword: "/auth_admin/forgot-password",
    changePassword: "/auth_admin/change-password",
    reservationsAdmin: "/reservations_t_admin",
    statistical: "/statistical",
};
