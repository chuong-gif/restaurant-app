import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";
import type { LoginPayload, LoginResponse } from "../../types/auth";

interface AuthState {
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem("user_admin") || "null"),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
};

// 🧩 Async actions
export const loginAdminAsync = createAsyncThunk(
    "auth/loginAdmin",
    async (payload: LoginPayload, { rejectWithValue }) => {
        try {
            const response: LoginResponse = await authApi.loginAdmin(payload);
            localStorage.setItem("user_admin", JSON.stringify(response.user));
            localStorage.setItem("token", response.token);
            return response;
        } catch (err: any) {
            return rejectWithValue(err.message || "Đăng nhập thất bại");
        }
    }
);

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
