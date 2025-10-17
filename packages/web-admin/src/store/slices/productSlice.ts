import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Product } from "../../types/product";


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
        fetchRequest: (state) => {
            state.loading = true;
        },
        fetchSuccess: (
            state,
            action: PayloadAction<{
                results: Product[];
                totalCount: number;
                totalPages: number;
                currentPage: number;
            }>
        ) => {
            const { results, totalCount, totalPages, currentPage } = action.payload;
            localStorage.setItem("currentPage", String(currentPage));

            state.loading = false;
            state.allProducts = results;
            state.totalCount = totalCount;
            state.totalPages = totalPages;
            state.currentPage = currentPage;
            state.product = results.slice(0, state.limit);
        },
        fetchFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            const newPage = action.payload;
            const start = (newPage - 1) * state.limit;
            const end = start + state.limit;
            localStorage.setItem("currentPage", String(newPage));

            state.currentPage = newPage;
            state.product = state.allProducts.slice(start, end);
        },
        setLimit: (state, action: PayloadAction<number>) => {
            const newLimit = action.payload;
            const totalPages = Math.ceil(state.allProducts.length / newLimit);
            const currentPage =
                state.currentPage > totalPages ? totalPages : state.currentPage;

            const start = (currentPage - 1) * newLimit;
            const end = start + newLimit;
            localStorage.setItem("limit", String(newLimit));

            state.limit = newLimit;
            state.currentPage = currentPage;
            state.product = state.allProducts.slice(start, end);
        },
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
