// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { API_BASE_URL } from "./endpoints";

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // 🧠 Interceptor trước khi gửi request
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             const decoded: { exp: number } = jwtDecode(token);

//             // Kiểm tra hết hạn token
//             const now = Date.now() / 1000;
//             if (decoded.exp < now) {
//                 localStorage.removeItem("token");
//                 window.location.href = "/login";
//                 throw new Error("Token expired");
//             }

//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // 🧠 Interceptor khi nhận phản hồi
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (
//             error.response &&
//             (error.response.status === 401 || error.response.status === 403)
//         ) {
//             localStorage.removeItem("token");
//             window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;



import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3307/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// 🧩 Thêm token nếu có trong localStorage
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 🧩 Xử lý lỗi trả về
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error.response?.data || error.message)
);

export default axiosClient;
