import api from "./axiosInstance"; // Đổi tên file và tên biến import
import type {
    LoginPayload,
    LoginResponse,
    UpdateProfilePayload,
    ChangePasswordPayload,
} from "../types/auth";
import axiosClient from "./axiosInstance";

const authApi = {
    loginAdmin: (data: LoginPayload): Promise<LoginResponse> =>
        axiosClient.post("/auth_admin/login", data),

    forgotPassword: (email: string) =>
        axiosClient.post("/auth_admin/forgot_password", { email }),

    changePassword: (data: ChangePasswordPayload) =>
        axiosClient.post("/auth_admin/change_password", data),

    updateProfile: (data: UpdateProfilePayload) =>
        axiosClient.put("/auth_admin/update_profile", data),

    getPermissions: () =>
        axiosClient.get("/auth_admin/permissions"),
};

export default authApi;
