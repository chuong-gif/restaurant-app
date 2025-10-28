// packages/admin/src/features/blogCategories/blogCategoryApi.ts
import { baseApi } from '../../services/baseApi';
import { BlogCategory, BlogCategoryListResponse } from '../../types/blog';

// Kiểu dữ liệu cho các tham số query
interface GetBlogCategoriesParams {
    page: number;
    limit: number; // Backend dùng limit
    search?: string;
    status?: boolean; // Backend dùng boolean
}

// Kiểu dữ liệu cho form (thêm/sửa)
type BlogCategoryFormInput = Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>;


export const blogCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Query lấy danh sách danh mục blog (admin)
        getAdminBlogCategories: builder.query<BlogCategoryListResponse, GetBlogCategoriesParams>({
            query: (params) => ({
                url: '/admin/blog-categories', // Dựa trên blogCategory.routes.ts và index.ts
                params: params,
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => ({ type: 'BlogCategory' as const, id })), { type: 'BlogCategory', id: 'LIST' },
            ] : [{ type: 'BlogCategory', id: 'LIST' }],
        }),

        // 1b. Query lấy danh sách danh mục blog (Public/Active - cho dropdown)
        getPublicBlogCategories: builder.query<BlogCategory[], void>({ // Chỉ trả về mảng
            query: () => ({
                url: '/admin/blog-categories', // Vẫn dùng API admin nhưng lọc status=true
                params: { limit: 1000, status: true }, // Lấy nhiều và chỉ active
            }),
            transformResponse: (response: BlogCategoryListResponse) => response.data,
            providesTags: [{ type: 'BlogCategory', id: 'LIST' }],
        }),

        // 2. Mutation tạo mới danh mục blog
        createBlogCategory: builder.mutation<BlogCategory, BlogCategoryFormInput>({
            query: (newCategory) => ({
                url: '/admin/blog-categories',
                method: 'POST',
                body: { // Backend cần 'name' và 'status'
                    name: newCategory.ten_danh_muc,
                    status: newCategory.trang_thai
                },
            }),
            invalidatesTags: [{ type: 'BlogCategory', id: 'LIST' }],
        }),

        // 3. Mutation cập nhật danh mục blog
        updateBlogCategory: builder.mutation<BlogCategory, { id: number; data: Partial<BlogCategoryFormInput> }>({
            query: ({ id, data }) => ({
                url: `/admin/blog-categories/${id}`,
                method: 'PATCH', // Backend dùng PATCH
                body: { // Backend cần 'name' và 'status'
                    name: data.ten_danh_muc,
                    status: data.trang_thai
                },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'BlogCategory', id }, { type: 'BlogCategory', id: 'LIST' }],
        }),

        // 4. Mutation xóa danh mục blog
        deleteBlogCategory: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/blog-categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'BlogCategory', id: 'LIST' }],
        }),

    }),
});

export const {
    useGetAdminBlogCategoriesQuery,
    useGetPublicBlogCategoriesQuery, // Export hook public
    useCreateBlogCategoryMutation,
    useUpdateBlogCategoryMutation,
    useDeleteBlogCategoryMutation,
} = blogCategoryApi;