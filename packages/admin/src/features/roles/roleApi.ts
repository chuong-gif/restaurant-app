// packages/admin/src/features/roles/roleApi.ts
import { baseApi } from '../../services/baseApi';
import { Role, RoleListResponse, RoleDetailResponse } from '../../types/user'; // Import thêm RoleDetailResponse

// Kiểu dữ liệu cho các tham số query lấy Roles
interface GetRolesParams {
    page: number;
    limit: number;
    search?: string;
}

// Kiểu dữ liệu cho form (thêm/sửa Role)
type RoleFormInput = Omit<Role, 'id'>;

// Kiểu dữ liệu body cho gán quyền
interface AssignPermissionsBody {
    permissionIds: number[];
}


export const roleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Query lấy danh sách vai trò (có phân trang)
        getRoles: builder.query<RoleListResponse, GetRolesParams>({ // Sửa: Trả về RoleListResponse
            query: (params) => ({
                url: '/admin/roles',
                params: params,
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => ({ type: 'Role' as const, id })), { type: 'Role', id: 'LIST' },
            ] : [{ type: 'Role', id: 'LIST' }],
        }),

        // === THÊM MỚI: Query lấy chi tiết vai trò (bao gồm quyền hiện tại) ===
        getRoleById: builder.query<RoleDetailResponse, number>({
            query: (id) => `/admin/roles/${id}`,
            providesTags: (result, error, id) => [{ type: 'Role', id }],
        }),
        // ================================================================

        // Mutation tạo mới vai trò
        createRole: builder.mutation<Role, RoleFormInput>({
            query: (newRole) => ({
                url: '/admin/roles',
                method: 'POST',
                body: newRole,
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),

        // Mutation cập nhật vai trò
        updateRole: builder.mutation<Role, { id: number; data: RoleFormInput }>({
            query: ({ id, data }) => ({
                url: `/admin/roles/${id}`,
                method: 'PUT', // Hoặc PATCH tùy backend
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }, { type: 'Role', id: 'LIST' }],
        }),

        // Mutation xóa vai trò
        deleteRole: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/roles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),

        // === THÊM MỚI: Mutation gán quyền cho vai trò ===
        assignPermissions: builder.mutation<void, { roleId: number; permissionIds: number[] }>({
            query: ({ roleId, permissionIds }) => ({
                url: `/admin/roles/${roleId}/permissions`,
                method: 'POST',
                body: { permissionIds }, // Gửi đúng body backend cần
            }),
            // Làm mất hiệu lực cache của role đó để query lại quyền mới
            invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }],
        }),
        // ============================================

    }),
});

export const {
    useGetRolesQuery,
    useGetRoleByIdQuery, // <-- Export hook mới
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAssignPermissionsMutation, // <-- Export hook mới
} = roleApi;