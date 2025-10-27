// packages/admin/src/features/tables/tableApi.ts
import { baseApi } from '../../services/baseApi';
import { Table, TableListResponse } from '../../types/product'; // Lấy type từ product.ts

// Kiểu dữ liệu cho các tham số query
interface GetTablesParams {
    page: number;
    limit: number; // Backend dùng limit
    so_ban?: number;
    suc_chua?: number;
    tang?: number;
}

// Kiểu dữ liệu cho form (thêm/sửa)
type TableFormInput = Omit<Table, 'id' | 'created_at' | 'updated_at' | 'media_files_ban_an_anh_ban_idTomedia_files' | 'media_files_ban_an_video_ban_idTomedia_files'>;


export const tableApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Query lấy danh sách bàn ăn (admin)
        getAdminTables: builder.query<TableListResponse, GetTablesParams>({
            query: (params) => ({
                url: '/admin/tables', // Dựa trên table.routes.ts và index.ts
                params: params,
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => ({ type: 'Table' as const, id })), { type: 'Table', id: 'LIST' },
            ] : [{ type: 'Table', id: 'LIST' }],
        }),

        // 2. Mutation tạo mới bàn ăn
        createTable: builder.mutation<Table, TableFormInput>({
            query: (newTable) => ({
                url: '/admin/tables',
                method: 'POST',
                body: newTable,
            }),
            invalidatesTags: [{ type: 'Table', id: 'LIST' }],
        }),

        // 3. Mutation cập nhật bàn ăn
        updateTable: builder.mutation<Table, { id: number; data: Partial<TableFormInput> }>({
            query: ({ id, data }) => ({
                url: `/admin/tables/${id}`,
                method: 'PATCH', // Backend dùng PATCH
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Table', id }, { type: 'Table', id: 'LIST' }],
        }),

        // 4. Mutation xóa bàn ăn
        deleteTable: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/tables/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Table', id: 'LIST' }],
        }),

    }),
});

export const {
    useGetAdminTablesQuery,
    useCreateTableMutation,
    useUpdateTableMutation,
    useDeleteTableMutation,
} = tableApi;