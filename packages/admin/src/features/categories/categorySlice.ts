// packages/admin/src/features/categories/categorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoryFilterState {
    page: number;
    pageSize: number;
    searchName?: string;
    trang_thai?: boolean;
}

const initialState: CategoryFilterState = {
    page: 1,
    pageSize: 10,
    searchName: '',
    trang_thai: undefined, // Mặc định là 'tất cả'
};

const categorySlice = createSlice({
    name: 'categoryFilters',
    initialState,
    reducers: {
        setCategoryFilters: (state, action: PayloadAction<Partial<CategoryFilterState>>) => {
            // Khi set filter, luôn reset về trang 1 (trừ khi chỉ đổi trang)
            state.page = action.payload.page ?? 1;
            state.searchName = action.payload.searchName ?? state.searchName;
            state.trang_thai = action.payload.trang_thai;
        },
        resetCategoryFilters: (state) => {
            state.page = 1;
            state.searchName = '';
            state.trang_thai = undefined;
        },
        setCategoryPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        }
    },
});

export const { setCategoryFilters, resetCategoryFilters, setCategoryPage } = categorySlice.actions;

export default categorySlice.reducer;