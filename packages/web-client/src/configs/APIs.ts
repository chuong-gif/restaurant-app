// ===============================
// 🔹 Định nghĩa kiểu dữ liệu cho các endpoint
// ===============================
export interface ApiData {
    product: string;
    categoryProduct: string;
    users: string;
    checkPassword: string;
    authOGoogle: string;
    authOFacebook: string;
    login: string;
    register: string;
    forgotPassword: string;
    changePassword: string;
    reservations_client: string;
    myBooking: string;
    blog: string;
    contact: string;
    promotion: string;
    reservations: string;
    reservation_detail: string;
    table: string;
    membership: string;
    membership_tiers: string;
    sendEmail: string;
}

// ===============================
// 🔹 Định nghĩa endpoint chính (API base URL)
// ===============================

// Lấy từ biến môi trường React
// (phải được khai báo trong file `.env` như: REACT_APP_API_ENDPOINT=http://localhost:6969/api)
//export const API_ENDPOINT: str ing =
// Use window to read the injected env var in the browser (avoids needing Node type defs)
export const API_ENDPOINT = (window as any).REACT_APP_API_ENDPOINT || "http://localhost:3070/api";

// ===============================
// 🔹 Danh sách endpoint API cụ thể
// ===============================
export const API_DATA: ApiData = {
    product: "/public/product",
    categoryProduct: "/public/category-product",
    users: "/users",
    checkPassword: "/users/check-password",
    authOGoogle: "/auth/google",
    authOFacebook: "/auth/facebook",
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    changePassword: "/auth/change-password",
    reservations_client: "/reservations_t_admin",
    myBooking: "/myBooking",
    blog: "/public/blogs",
    contact: "/contact",
    promotion: "/public/promotion",
    reservations: "/public/reservations",
    reservation_detail: "/public/reservation_detail",
    table: "/public/table",
    membership: "/public/membership",
    membership_tiers: "/public/membership_tiers",
    sendEmail: "/email/send",
};
