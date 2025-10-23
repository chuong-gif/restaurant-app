// packages/web-admin/src/store/slices/productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";
import { createProduct as createProductApi } from "../../api/productsApi";

// Async thunk: tạo sản phẩm mới
export const createProduct = createAsyncThunk<Product, Product, { rejectValue: string }>(
    "products/createProduct",
    async (product: Product, { rejectWithValue }) => {
        try {
            // 👇 2. THAY THẾ LOGIC DEMO BẰNG LOGIC GỌI API THẬT
            const response = await createProductApi(product);

            // Dữ liệu sản phẩm mới tạo sẽ nằm trong response.data
            // (vì backend trả về { message, data })
            return response.data;

        } catch (error: any) {
            // `error` ở đây đã được axiosInstance xử lý, nó chính là message lỗi
            return rejectWithValue(error || "Lỗi tạo sản phẩm");
        }
    }
);

interface ProductState {
    allProducts: Product[];
    loading: boolean;
    product: Product[];
    error: string;
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

const initialState: ProductState = {
    allProducts: [],
    loading: false,
    product: [],
    error: "",
    totalCount: 0,
    totalPages: 0,
    currentPage: parseInt(localStorage.getItem("currentPage") || "1", 10),
    limit: parseInt(localStorage.getItem("limit") || "10", 10),
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        fetchRequest(state) {
            state.loading = true;
        },
        fetchSuccess(state, action: PayloadAction<Product[]>) {
            state.loading = false;
            state.allProducts = action.payload;
            // cập nhật product (first page slice)
            const start = (state.currentPage - 1) * state.limit;
            state.product = action.payload.slice(start, start + state.limit);
        },
        fetchFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            const newPage = action.payload;
            const start = (newPage - 1) * state.limit;
            const end = start + state.limit;
            state.currentPage = newPage;
            localStorage.setItem("currentPage", String(newPage));
            state.product = state.allProducts.slice(start, end);
        },
        setLimit(state, action: PayloadAction<number>) {
            const newLimit = action.payload;
            state.limit = newLimit;
            localStorage.setItem("limit", String(newLimit));
            const totalPages = Math.ceil(state.allProducts.length / newLimit) || 1;
            if (state.currentPage > totalPages) state.currentPage = totalPages;
            const start = (state.currentPage - 1) * newLimit;
            state.product = state.allProducts.slice(start, start + newLimit);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.allProducts.push(action.payload);
                // cập nhật product (nếu muốn push vào trang hiện tại)
                const start = (state.currentPage - 1) * state.limit;
                state.product = state.allProducts.slice(start, start + state.limit);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Thêm sản phẩm thất bại";
            });
    },
});

export const {
    fetchRequest,
    fetchSuccess,
    fetchFailure,
    setCurrentPage,
    setLimit,
} = productSlice.actions;

export default productSlice.reducer;
