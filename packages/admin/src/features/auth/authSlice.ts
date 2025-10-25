import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/user';

// Lấy thông tin từ localStorage nếu có để giữ trạng thái đăng nhập khi refresh trang
const initialState: AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Action để set credentials khi đăng nhập thành công
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; accessToken: string }>
        ) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.token = accessToken;
            // Lưu vào localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', accessToken);
        },
        // Action để xóa credentials khi đăng xuất
        logout: (state) => {
            state.user = null;
            state.token = null;
            // Xóa khỏi localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;