// packages/admin/src/features/promotions/promotionApi.ts
import { baseApi } from '../../services/baseApi';
import { Promotion, PromotionListResponse, PromotionDetailResponse } from '../../types/promotion';

// Kiểu dữ liệu cho các tham số query
interface GetPromotionsParams {
    page: number;
    limit: number; // Backend dùng limit
    search?: string; // Backend tìm theo ma_khuyen_mai
}

// Kiểu dữ liệu cho form (thêm/sửa) - Bỏ các trường tự động
type PromotionFormInput = Omit<Promotion, 'id' | 'created_at' | 'updated_at'>;


export const promotionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Query lấy danh sách khuyến mãi (admin)
        getAdminPromotions: builder.query<PromotionListResponse, GetPromotionsParams>({
            query: (params) => ({
                url: '/admin/promotions', // Dựa trên promotion.routes.ts
                params: params,
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => ({ type: 'Promotion' as const, id })), { type: 'Promotion', id: 'LIST' },
            ] : [{ type: 'Promotion', id: 'LIST' }],
        }),

        // 2. Query lấy chi tiết khuyến mãi (admin)
        getAdminPromotionById: builder.query<Promotion, number>({
            query: (id) => `/admin/promotions/${id}`,
            transformResponse: (response: PromotionDetailResponse) => response.data,
            providesTags: (result, error, id) => [{ type: 'Promotion', id }],
        }),

        // 3. Mutation tạo mới khuyến mãi
        createPromotion: builder.mutation<Promotion, PromotionFormInput>({
            query: (newPromotion) => ({
                url: '/admin/promotions',
                method: 'POST',
                body: newPromotion,
            }),
            invalidatesTags: [{ type: 'Promotion', id: 'LIST' }],
        }),

        // 4. Mutation cập nhật khuyến mãi
        updatePromotion: builder.mutation<Promotion, { id: number; data: Partial<PromotionFormInput> }>({
            query: ({ id, data }) => ({
                url: `/admin/promotions/${id}`,
                method: 'PATCH', // Backend dùng PATCH
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Promotion', id }, { type: 'Promotion', id: 'LIST' }],
        }),

        // 5. Mutation xóa khuyến mãi
        deletePromotion: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/promotions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Promotion', id: 'LIST' }],
        }),

    }),
});

export const {
    useGetAdminPromotionsQuery,
    useGetAdminPromotionByIdQuery, // Export hook lấy chi tiết
    useCreatePromotionMutation,
    useUpdatePromotionMutation,
    useDeletePromotionMutation,
} = promotionApi;