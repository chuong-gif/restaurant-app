// packages/admin/src/features/roles/roleApi.ts
import { baseApi } from '../../services/baseApi';
import { Role, RoleListResponse, RoleDetailResponse } from '../../types/user';

interface GetRolesParams {
    page: number;
    limit: number;
    search?: string;
}

type RoleFormInput = Omit<Role, 'id'>;

interface AssignPermissionsBody {
    permissionIds: number[];
}

export const roleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Hook này (có phân trang) dùng cho trang "Quản lý Vai trò"
        getRoles: builder.query<RoleListResponse, GetRolesParams>({
            query: (params) => ({
                url: '/admin/roles',
                params: params,
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => ({ type: 'Role' as const, id })), { type: 'Role', id: 'LIST' },
            ] : [{ type: 'Role', id: 'LIST' }],
        }),

        // === THÊM HOOK MỚI NÀY ===
        // Hook này (không phân trang) dùng cho các dropdown (ô Select)
        getAllRolesForDropdown: builder.query<Role[], void>({
            query: () => ({
                url: '/admin/roles',
                params: { page: 1, limit: 1000 } // Lấy tất cả (giới hạn 1000)
            }),
            transformResponse: (response: RoleListResponse) => response.data, // Chỉ trả về mảng data
            providesTags: [{ type: 'Role', id: 'LIST' }],
        }),
        // =========================

        getRoleById: builder.query<RoleDetailResponse, number>({
            query: (id) => `/admin/roles/${id}`,
            providesTags: (result, error, id) => [{ type: 'Role', id }],
        }),

        createRole: builder.mutation<Role, RoleFormInput>({
            query: (newRole) => ({
                url: '/admin/roles',
                method: 'POST',
                body: newRole,
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),

        updateRole: builder.mutation<Role, { id: number; data: RoleFormInput }>({
            query: ({ id, data }) => ({
                url: `/admin/roles/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }, { type: 'Role', id: 'LIST' }],
        }),

        deleteRole: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/roles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),

        assignPermissions: builder.mutation<void, { roleId: number; permissionIds: number[] }>({
            query: ({ roleId, permissionIds }) => ({
                url: `/admin/roles/${roleId}/permissions`,
                method: 'POST',
                body: { permissionIds },
            }),
            invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }],
        }),
    }),
});

export const {
    useGetRolesQuery,
    useGetAllRolesForDropdownQuery, // <-- Export hook mới
    useGetRoleByIdQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAssignPermissionsMutation,
} = roleApi;