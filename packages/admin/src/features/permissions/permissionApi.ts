// packages/admin/src/features/permissions/permissionApi.ts
import { baseApi } from '../../services/baseApi';
import { Permission, GroupedPermissionsResponse } from '../../types/user';

// Kiểu dữ liệu trả về đã được gom nhóm
type GroupedPermissions = Record<string, Permission[]>;

export const permissionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Query lấy tất cả quyền hạn (đã gom nhóm)
        getAllPermissions: builder.query<GroupedPermissions, void>({
            query: () => '/admin/permissions', // Dựa trên permission.routes.ts
            // Trích xuất dữ liệu từ response
            transformResponse: (response: GroupedPermissionsResponse) => response.data,
            providesTags: ['Permission'], // Tag type cho caching
        }),
    }),
});

export const { useGetAllPermissionsQuery } = permissionApi;