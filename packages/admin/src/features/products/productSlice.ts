// packages/admin/src/features/products/productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductFilterState {
    page: number;
    pageSize: number;
    searchName?: string;
    danh_muc_id?: number;
}

const initialState: ProductFilterState = {
    page: 1,
    pageSize: 10,
    searchName: '',
    danh_muc_id: undefined,
};

const productSlice = createSlice({
    name: 'productFilters',
    initialState,
    reducers: {
        setProductFilters: (state, action: PayloadAction<Partial<ProductFilterState>>) => {
            // Khi set filter, luôn reset về trang 1
            state.page = action.payload.page ?? state.page;
            state.searchName = action.payload.searchName ?? state.searchName;
            state.danh_muc_id = action.payload.danh_muc_id; // Cho phép set về undefined
        },
        resetProductFilters: (state) => {
            state.page = 1;
            state.searchName = '';
            state.danh_muc_id = undefined;
        },
        setProductPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        }
    },
});

export const { setProductFilters, resetProductFilters, setProductPage } = productSlice.actions;

export default productSlice.reducer;