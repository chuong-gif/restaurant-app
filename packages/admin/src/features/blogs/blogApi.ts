// packages/admin/src/features/blogs/blogApi.ts
import { baseApi } from '../../services/baseApi';
import { BlogPost, BlogPostListResponse, BlogPostDetailResponse } from '../../types/blog';

// Kiểu dữ liệu cho các tham số query
interface GetBlogPostsParams {
    page: number;
    limit: number; // Backend dùng limit
    search?: string; // Backend tìm theo tieu_de
    categoryId?: number;
}

// Kiểu dữ liệu cho form (thêm/sửa)
// Backend nhận key khác với model (vd: title thay vì tieu_de)
// Backend KHÔNG nhận tac_gia/nguoi_dung_id
type BlogPostFormInput = {
    tieu_de: string;
    noi_dung: string; // HTML content
    danh_muc_blog_id?: number | null;
    anh_bia_id?: number | null;
};


export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Query lấy danh sách bài viết (admin)
        getAdminBlogPosts: builder.query<BlogPostListResponse, GetBlogPostsParams>({
            query: (params) => ({
                url: '/admin/blogs', // Dựa trên blog.routes.ts và index.ts
                params: params,
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => ({ type: 'BlogPost' as const, id })), { type: 'BlogPost', id: 'LIST' },
            ] : [{ type: 'BlogPost', id: 'LIST' }],
        }),

        // 2. Query lấy chi tiết bài viết (admin/public)
        getBlogPostById: builder.query<BlogPost, number>({
            query: (id) => `/admin/blogs/${id}`, // Dùng API admin để lấy cả bài ẩn (nếu có)
            transformResponse: (response: BlogPostDetailResponse) => response.data,
            providesTags: (result, error, id) => [{ type: 'BlogPost', id }],
        }),

        // 3. Mutation tạo mới bài viết
        createBlogPost: builder.mutation<BlogPost, BlogPostFormInput>({
            query: (newPost) => ({
                url: '/admin/blogs',
                method: 'POST',
                body: newPost, // Gửi đúng các trường service cần (tieu_de, noi_dung, anh_bia_id, danh_muc_blog_id)
            }),
            invalidatesTags: [{ type: 'BlogPost', id: 'LIST' }],
        }),

        // 4. Mutation cập nhật bài viết
        updateBlogPost: builder.mutation<BlogPost, { id: number; data: Partial<BlogPostFormInput> }>({
            query: ({ id, data }) => ({
                url: `/admin/blogs/${id}`,
                method: 'PATCH', // Backend dùng PATCH
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'BlogPost', id }, { type: 'BlogPost', id: 'LIST' }],
        }),

        // 5. Mutation xóa bài viết
        deleteBlogPost: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/blogs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'BlogPost', id: 'LIST' }],
        }),

    }),
});

export const {
    useGetAdminBlogPostsQuery,
    useGetBlogPostByIdQuery,
    useCreateBlogPostMutation,
    useUpdateBlogPostMutation,
    useDeleteBlogPostMutation,
} = blogApi;