import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';

// Lấy base URL từ biến môi trường
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            // Lấy token từ Redux state và gắn vào header Authorization
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // Các "tag" dùng để tự động fetch lại dữ liệu khi có sự thay đổi (CUD)
    tagTypes: [
        'User', 'Product', 'Category', 'Reservation', 'Blog', 'Role', 'Permission',
        // Thêm các tag mới dưới đây
        'BlogCategory', 'BlogPost', 'Promotion', 'Table', 'Dashboard'
    ],

    endpoints: () => ({}), // Các endpoints cụ thể sẽ được "inject" vào từ các file api khác
});