// File: packages/web-admin/src/store/slices/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";
import type { LoginPayload, LoginResponse } from "../../types/auth";

interface AuthState {
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

// 👇 BƯỚC 1: TẠO HÀM ĐỌC DỮ LIỆU AN TOÀN
const parseUserFromStorage = (): any | null => {
    try {
        const userString = localStorage.getItem("user_admin");
        // Nếu có dữ liệu thì mới parse, không thì trả về null
        return userString ? JSON.parse(userString) : null;
    } catch (error) {
        // Nếu parse lỗi (dữ liệu hỏng), in ra lỗi, xóa nó đi và trả về null
        console.error("Lỗi parse user từ localStorage, đang xoá dữ liệu hỏng:", error);
        localStorage.removeItem("user_admin");
        return null;
    }
};

// 👇 BƯỚC 2: SỬ DỤNG HÀM AN TOÀN ĐỂ KHỞI TẠO STATE
const initialState: AuthState = {
    user: parseUserFromStorage(),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
};

// 🧩 Async actions (Giữ nguyên, không thay đổi)
export const loginAdminAsync = createAsyncThunk(
    "auth/loginAdmin",
    async (payload: LoginPayload, { rejectWithValue }) => {
        try {
            // 👇 SỬA LẠI KHÚC NÀY CHO ĐƠN GIẢN
            // response bây giờ đã có dạng { user, token } rồi vì authApi đã xử lý
            const response: LoginResponse = await authApi.loginAdmin(payload);
            // 👇 THÊM DÒNG NÀY ĐỂ XEM SLICE NHẬN ĐƯỢC GÌ
            console.log("3. Dữ liệu authSlice nhận được:", response);

            // 👇 THÊM DÒNG NÀY ĐỂ XEM user LÀ GÌ TRƯỚC KHI LƯU
            console.log("4. Object 'user' sắp được lưu:", response.user);

            localStorage.setItem("user_admin", JSON.stringify(response.user));
            localStorage.setItem("token", response.token);

            return response;

        } catch (err: any) {
            return rejectWithValue(err.message || "Đăng nhập thất bại");
        }
    }
);

// Phần còn lại của file giữ nguyên, không thay đổi
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user_admin");
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdminAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdminAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginAdminAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;