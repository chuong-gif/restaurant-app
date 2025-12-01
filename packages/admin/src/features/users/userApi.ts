// packages/admin/src/features/users/userApi.ts
import { baseApi } from '../../services/baseApi';
import { User, UserListResponse } from '../../types/user';
import { UserType } from '../../types/user';

interface GetUsersParams {
    page: number;
    limit: number;
    search?: string;
    trang_thai?: boolean;
    searchRoleId?: number;
    searchUserType?: UserType;
}

interface UserResponse {
    result: User;
}

type UserFormInput = Omit<User, 'id' | 'created_at' | 'vai_tro' | 'media_files'> & {
    password?: string;
    permissions?: string[]; // Thêm trường này, optional
};


export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Query lấy danh sách người dùng
        getUsers: builder.query<UserListResponse, GetUsersParams>({
            query: (params) => ({
                url: '/admin/users',
                params: params,
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'LIST' },
            ] : [{ type: 'User', id: 'LIST' }],
        }),

        // 2. Query lấy 1 người dùng theo ID
        getUserById: builder.query<User, number>({
            query: (id) => `/admin/users/${id}`,
            transformResponse: (response: UserResponse) => response.result,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        // 3. Mutation tạo mới người dùng
        createUser: builder.mutation<User, UserFormInput>({
            query: (newUser) => ({
                url: '/admin/users',
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),

        // 4. Mutation cập nhật người dùng (không gồm password)
        updateUser: builder.mutation<User, { id: number; data: Partial<Omit<UserFormInput, 'password'>> }>({
            query: ({ id, data }) => ({
                url: `/admin/users/${id}`,
                method: 'PATCH', // Backend dùng PATCH
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
        }),

        // === SỬA CÁC MUTATION XÓA/KHÔI PHỤC ===

        // 5. Mutation XÓA MỀM người dùng
        deleteUser: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/users/soft/${id}`, // <-- Sửa route
                method: 'DELETE', // <-- Sửa method
            }),
            // Cập nhật cache để user biến mất khỏi list chính và xuất hiện ở list trash
            invalidatesTags: (result, error, id) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
        }),

        // 6. Mutation XÓA VĨNH VIỄN người dùng
        permanentlyDeleteUser: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/users/permanent/${id}`, // <-- Sửa route
                method: 'DELETE',
            }),
            // Cập nhật cache để user biến mất hẳn
            invalidatesTags: (result, error, id) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
        }),

        // 7. Mutation KHÔI PHỤC người dùng (Gọi updateUser với trang_thai=true)
        restoreUser: builder.mutation<User, number>({
            query: (id) => ({
                url: `/admin/users/${id}`, // <-- Dùng route PATCH /:id
                method: 'PATCH',
                body: { trang_thai: true } // Chỉ gửi trạng thái cần cập nhật
            }),
            // Cập nhật cache để user biến mất khỏi list trash và xuất hiện ở list chính
            invalidatesTags: (result, error, id) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
        }),
        // ===================================

    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation, // Xóa mềm
    usePermanentlyDeleteUserMutation, // Xóa cứng
    useRestoreUserMutation, // Khôi phục
} = userApi;