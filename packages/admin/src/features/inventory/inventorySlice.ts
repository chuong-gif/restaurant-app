// packages/admin/src/features/inventory/inventorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InventoryFilterState {
    page: number;
    limit: number;
    searchName?: string;
    status?: string; // '' | 'true' | 'false'
}

const initialState: InventoryFilterState = {
    page: 1,
    limit: 10,
    searchName: '',
    status: '',
};

const inventorySlice = createSlice({
    name: 'inventoryFilters',
    initialState,
    reducers: {
        setInventoryFilters: (state, action: PayloadAction<Partial<InventoryFilterState>>) => {
            // Nếu thay đổi filter (ko phải đổi trang), reset về trang 1
            const isPageChangeOnly = Object.keys(action.payload).length === 1 && 'page' in action.payload;
            if (!isPageChangeOnly) {
                state.page = 1;
            }
            Object.assign(state, action.payload);
        },
        resetInventoryFilters: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const { setInventoryFilters, resetInventoryFilters } = inventorySlice.actions;
export default inventorySlice.reducer;