import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "../../types/role";

interface RoleState {
    allRoles: Role[];
    role: Role[];
    currentPage: number;
    limit: number;
    loading: boolean;
    error: string;
    totalCount: number;
    totalPages: number;
}

const initialState: RoleState = {
    allRoles: [],
    role: [],
    currentPage: parseInt(localStorage.getItem("currentPage") || "1", 10),
    limit: parseInt(localStorage.getItem("limit") || "5", 10),
    loading: false,
    error: "",
    totalCount: 0,
    totalPages: 0,
};

const roleSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        fetchRequest: (state) => {
            state.loading = true;
        },
        fetchSuccess: (
            state,
            action: PayloadAction<{
                results: Role[];
                totalCount: number;
                totalPages: number;
                currentPage: number;
            }>
        ) => {
            const { results, totalCount, totalPages, currentPage } = action.payload;
            state.loading = false;
            state.allRoles = results;
            state.totalCount = totalCount;
            state.totalPages = totalPages;
            state.currentPage = currentPage;
            state.role = results.slice(0, state.limit);
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
            state.role = state.allRoles.slice(start, end);
        },
        setLimit: (state, action: PayloadAction<number>) => {
            const newLimit = action.payload;
            const totalPages = Math.ceil(state.allRoles.length / newLimit);
            const currentPage =
                state.currentPage > totalPages ? totalPages : state.currentPage;
            const start = (currentPage - 1) * newLimit;
            const end = start + newLimit;
            localStorage.setItem("limit", String(newLimit));

            state.limit = newLimit;
            state.currentPage = currentPage;
            state.role = state.allRoles.slice(start, end);
        },
    },
});

export const {
    fetchRequest,
    fetchSuccess,
    fetchFailure,
    setCurrentPage,
    setLimit,
} = roleSlice.actions;

export default roleSlice.reducer;
