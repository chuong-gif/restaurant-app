// packages/admin/src/features/products/productApi.ts
import { baseApi } from '../../services/baseApi';
import { Product, ProductListResponse } from '../../types/product';

interface GetProductsParams {
    page: number;
    pageSize: number;
    searchName?: string;
    danh_muc_id?: number;
    trang_thai?: boolean;
}

interface ProductResponse {
    message: string;
    data: Product;
}

type ProductFormInput = Omit<Product, 'id' | 'ma_san_pham' | 'created_at' | 'updated_at' | 'media_files' | 'danh_muc_san_pham'>;


export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<ProductListResponse, GetProductsParams>({
            query: (params) => ({
                url: '/admin/products',
                params: params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Product' as const, id })),
                        { type: 'Product', id: 'LIST' },
                    ]
                    : [{ type: 'Product', id: 'LIST' }],
        }),

        getProductById: builder.query<Product, number>({
            query: (id) => `/admin/products/${id}`, // API này giờ đã hoạt động
            transformResponse: (response: ProductResponse) => response.data,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),

        createProduct: builder.mutation<Product, ProductFormInput>({
            query: (newProduct) => ({
                url: '/admin/products',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        updateProduct: builder.mutation<Product, { id: number; data: Partial<ProductFormInput> }>({
            query: ({ id, data }) => ({
                url: `/admin/products/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' }
            ],
        }),

        deleteProduct: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        // === THÊM MUTATION XÓA VĨNH VIỄN (SỬA LỖI 2) ===
        permanentlyDeleteProduct: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/products/permanent/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        // ============================================

    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    usePermanentlyDeleteProductMutation // <-- Export hook mới
} = productApi;