// packages/admin/src/features/roles/roleApi.ts
import { baseApi } from '../../services/baseApi';
import type { Role, RoleListResponse } from '../../types/user';

// Kiểu dữ liệu cho các tham số query
interface GetRolesParams {
    page: number;
    limit: number; // Backend dùng 'limit' thay vì 'pageSize'
    search?: string;
}

export const roleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Query lấy danh sách vai trò (cho dropdown)
        getRoles: builder.query<Role[], GetRolesParams>({
            query: (params) => ({
                url: '/admin/roles', // Dựa trên role.routes.ts
                params: params,
            }),
            // Chỉ lấy mảng data, bỏ qua phân trang
            transformResponse: (response: RoleListResponse) => response.data,
            providesTags: ['Role'], // Tag type cho caching
        }),

        // TODO: Thêm các mutation createRole, updateRole, deleteRole sau này nếu cần trang quản lý Role riêng
    }),
});

// Chỉ export hook getRoles vì chỉ cần nó cho form User
export const { useGetRolesQuery } = roleApi;