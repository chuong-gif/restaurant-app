// packages/admin/src/features/inventory/inventoryApi.ts
import { baseApi } from '../../services/baseApi';
import { Supplier, Material, InventoryListResponse } from '../../types/inventory';

export const inventoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // --- NHÀ CUNG CẤP ---
        getSuppliers: builder.query<InventoryListResponse<Supplier>, any>({
            query: (params) => ({
                url: '/admin/inventory/suppliers',
                params,
            }),
            providesTags: ['Supplier'],
        }),
        createSupplier: builder.mutation<void, Partial<Supplier>>({
            query: (body) => ({
                url: '/admin/inventory/suppliers',
                method: 'POST',
                body: {
                    name: body.ten_nha_cung_cap,
                    phone: body.so_dien_thoai,
                    email: body.email,
                    address: body.dia_chi,
                    note: body.ghi_chu
                },
            }),
            invalidatesTags: ['Supplier'],
        }),
        updateSupplier: builder.mutation<void, { id: number; data: Partial<Supplier> }>({
            query: ({ id, data }) => ({
                url: `/admin/inventory/suppliers/${id}`,
                method: 'PATCH',
                body: {
                    name: data.ten_nha_cung_cap,
                    phone: data.so_dien_thoai,
                    email: data.email,
                    address: data.dia_chi,
                    note: data.ghi_chu,
                    status: data.trang_thai
                },
            }),
            invalidatesTags: ['Supplier'],
        }),
        deleteSupplier: builder.mutation<void, number>({
            query: (id) => ({
                url: `/admin/inventory/suppliers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Supplier'],
        }),

        // --- NGUYÊN LIỆU (Sẽ dùng sau) ---
        getMaterials: builder.query<InventoryListResponse<Material>, any>({
            query: (params) => ({
                url: '/admin/inventory/materials',
                params,
            }),
            providesTags: ['Material'],
        }),
        createMaterial: builder.mutation<void, Partial<Material>>({
            query: (body) => ({
                url: '/admin/inventory/materials',
                method: 'POST',
                body: {
                    name: body.ten_nguyen_lieu,
                    unit: body.don_vi_tinh,
                    warning_limit: body.muc_canh_bao,
                    note: body.ghi_chu
                },
            }),
            invalidatesTags: ['Material'],
        }),
        updateMaterial: builder.mutation<void, { id: number; data: Partial<Material> }>({
            query: ({ id, data }) => ({
                url: `/admin/inventory/materials/${id}`,
                method: 'PATCH',
                body: {
                    name: data.ten_nguyen_lieu,
                    unit: data.don_vi_tinh,
                    warning_limit: data.muc_canh_bao,
                    note: data.ghi_chu,
                    status: data.trang_thai
                },
            }),
            invalidatesTags: ['Material'],
        }),
        deleteMaterial: builder.mutation<void, number>({
            query: (id) => ({
                url: `/admin/inventory/materials/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Material'],
        }),
        importInventory: builder.mutation<void, any>({
            query: (data) => ({
                url: '/admin/inventory/import',
                method: 'POST',
                body: data,
            }),
            // Khi nhập xong, cần reload lại danh sách Nguyên liệu để thấy số lượng tồn tăng lên
            invalidatesTags: ['Material'],
        }),
    }),
});

export const {
    useGetSuppliersQuery,
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
    useGetMaterialsQuery,
    useCreateMaterialMutation,
    useUpdateMaterialMutation,
    useDeleteMaterialMutation,
    useImportInventoryMutation,
} = inventoryApi;