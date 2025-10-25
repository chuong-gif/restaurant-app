// packages/admin/src/features/products/productApi.ts
import { baseApi } from '../../services/baseApi';
import { Product, ProductListResponse } from '../../types/product';

// Định nghĩa kiểu cho các tham số query
interface GetProductsParams {
    page: number;
    pageSize: number;
    searchName?: string;
    danh_muc_id?: number;
    trang_thai?: boolean;
}

// Kiểu dữ liệu cho response lấy 1 SP
interface ProductResponse {
    message: string;
    data: Product;
}

// Kiểu dữ liệu cho form (thêm/sửa)
// Lấy các trường từ Product, bỏ đi các trường tự động
type ProductFormInput = Omit<Product, 'id' | 'ma_san_pham' | 'created_at' | 'updated_at' | 'media_files' | 'danh_muc_san_pham'>;


export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Query lấy danh sách sản phẩm (có lọc và phân trang)
        getProducts: builder.query<ProductListResponse, GetProductsParams>({
            query: (params) => ({
                url: '/admin/products',
                params: params, // Gửi các tham số lên query string
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Product' as const, id })),
                        { type: 'Product', id: 'LIST' },
                    ]
                    : [{ type: 'Product', id: 'LIST' }],
        }),

        // 2. Query lấy 1 sản phẩm theo ID
        getProductById: builder.query<Product, number>({
            query: (id) => `/admin/products/${id}`,
            transformResponse: (response: ProductResponse) => response.data,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),

        // 3. Mutation tạo mới sản phẩm
        createProduct: builder.mutation<Product, ProductFormInput>({
            query: (newProduct) => ({
                url: '/admin/products',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        // 4. Mutation cập nhật sản phẩm
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

        // 5. Mutation xóa (mềm) sản phẩm
        deleteProduct: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/admin/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;