// packages/admin/src/features/products/categoryApi.ts
import { baseApi } from '../../services/baseApi';
import { ProductCategory } from '../../types/product';

// Kiểu dữ liệu trả về từ API lấy danh sách
interface CategoriesListResponse {
    message: string;
    data: ProductCategory[];
    total: number;
    totalPages: number;
    currentPage: number;
}

// === THÊM MỚI KIỂU DỮ LIỆU NÀY ===
// Kiểu trả về cho hook public (chỉ là mảng data)
interface PublicCategoriesResponse {
    message: string;
    data: ProductCategory[];
}
// ================================

// Kiểu dữ liệu cho các tham số query
interface GetCategoriesParams {
    page: number;
    pageSize: number;
    searchName?: string;
    trang_thai?: boolean;
}

// Kiểu dữ liệu cho form (thêm/sửa)
type CategoryFormInput = Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>;

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Hook này DÀNH CHO TRANG QUẢN LÝ DANH MỤC (có phân trang)
        getAdminProductCategories: builder.query<CategoriesListResponse, GetCategoriesParams>({
            query: (params) => ({
                url: '/admin/product-categories',
                params: params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Category' as const, id })),
                        { type: 'Category', id: 'LIST' },
                    ]
                    : [{ type: 'Category', id: 'LIST' }],
        }),

        // === THÊM MỚI HOOK NÀY ===
        // Hook này DÀNH CHO DROPDOWN BỘ LỌC (chỉ lấy mảng)
        getPublicProductCategories: builder.query<ProductCategory[], void>({
            query: () => '/public/product-categories', // Sử dụng route public
            transformResponse: (response: PublicCategoriesResponse) => response.data,
            providesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        // ========================

        // 1. Mutation tạo mới danh mục
        createCategory: builder.mutation<ProductCategory, CategoryFormInput>({
            query: (newCategory) => ({
                url: '/admin/product-categories',
                method: 'POST',
                body: newCategory,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),

        // 2. Mutation cập nhật danh mục
        updateCategory: builder.mutation<ProductCategory, { id: number; data: CategoryFormInput }>({
            query: ({ id, data }) => ({
                url: `/admin/product-categories/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Category', id },
                { type: 'Category', id: 'LIST' }
            ],
        }),

        // 3. Mutation xóa danh mục
        deleteCategory: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/product-categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),

    }),
});

export const {
    useGetAdminProductCategoriesQuery,
    useGetPublicProductCategoriesQuery, // <-- Export hook mới
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi;