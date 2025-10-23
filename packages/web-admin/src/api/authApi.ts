// File: packages/web-admin/src/api/authApi.ts

import type {
    LoginPayload,
    LoginResponse,
    UpdateProfilePayload,
    ChangePasswordPayload,
} from "../types/auth";
import axiosClient from "./axiosInstance";

// Định nghĩa "khuôn" dữ liệu thô mà server sẽ trả về
interface RawAdminLoginResponse {
    message: string;
    data: any; // Đây là object user
    accessToken: string; // Đây là token
}

const authApi = {
    loginAdmin: async (data: LoginPayload): Promise<LoginResponse> => {
        // 👇 SỬA LẠI DÒNG NÀY
        // 1. Gọi API và "ép kiểu" kết quả trả về thành RawAdminLoginResponse
        const responseFromApi = (await axiosClient.post(
            "/admin/auth/login",
            data
        )) as RawAdminLoginResponse;

        console.log("1. Dữ liệu thô nhận từ server:", responseFromApi);

        // 2. Bây giờ TypeScript đã hiểu và sẽ không báo lỗi nữa
        return {
            user: responseFromApi.data,
            token: responseFromApi.accessToken,
        };
    },

    forgotPassword: (email: string) =>
        axiosClient.post("/admin/auth/forgot_password", { email }),

    changePassword: (data: ChangePasswordPayload) =>
        axiosClient.post("/admin/auth/change_password", data),

    updateProfile: (data: UpdateProfilePayload) =>
        axiosClient.put("/admin/auth/update_profile", data),

    getPermissions: () =>
        axiosClient.get("/admin/auth/permissions"),
};

export default authApi;