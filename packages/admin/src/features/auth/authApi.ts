import { baseApi } from '../../services/baseApi';
import { User } from '../../types/user';

// Định nghĩa kiểu dữ liệu trả về từ API đăng nhập
interface LoginResponse {
    message: string;
    data: User;
    accessToken: string;
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Mutation cho chức năng đăng nhập
        login: builder.mutation<LoginResponse, Record<string, string>>({
            query: (credentials) => ({
                // Endpoint được xác định từ file route của bạn: POST /admin/auth/login
                url: '/admin/auth/login',
                method: 'POST',
                body: credentials, // Gửi email và password
            }),
        }),
        // Có thể thêm các endpoints khác ở đây sau này (ví dụ: logout, get profile,...)
    }),
});

// Export hook để sử dụng trong component
// Tên hook được tự động sinh ra: use + Tên mutation + Mutation
export const { useLoginMutation } = authApi;