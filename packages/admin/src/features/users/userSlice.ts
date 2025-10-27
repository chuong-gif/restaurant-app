// packages/admin/src/features/users/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '../../types/user';

interface UserFilterState {
    page: number;
    limit: number; // Backend dùng limit
    search?: string;
    trang_thai?: boolean; // Backend dùng boolean
    searchRoleId?: number; // Backend dùng searchRoleId
    searchUserType?: UserType; // Backend dùng searchUserType
}

// Lấy filter từ localStorage nếu có
const loadFilters = (): Partial<UserFilterState> => {
    const saved = localStorage.getItem('userFilters');
    return saved ? JSON.parse(saved) : {};
};

const initialState: UserFilterState = {
    page: 1,
    limit: 10,
    search: '',
    trang_thai: undefined,
    searchRoleId: undefined,
    searchUserType: undefined,
    ...loadFilters(), // Ghi đè bằng filter đã lưu
};

// Lưu filter vào localStorage
const saveFilters = (state: UserFilterState) => {
    const { page, ...filtersToSave } = state; // Không lưu page
    localStorage.setItem('userFilters', JSON.stringify(filtersToSave));
};


const userSlice = createSlice({
    name: 'userFilters',
    initialState,
    reducers: {
        setUserFilters: (state, action: PayloadAction<Partial<UserFilterState>>) => {
            // Chỉ reset page về 1 nếu filter thay đổi (không phải chỉ đổi page)
            const isPageChangeOnly = Object.keys(action.payload).length === 1 && 'page' in action.payload;
            if (!isPageChangeOnly) {
                state.page = 1;
            }
            Object.assign(state, action.payload); // Cập nhật các filter mới
            saveFilters(state); // Lưu lại
        },
        resetUserFilters: (state) => {
            state.page = 1;
            state.search = '';
            state.trang_thai = undefined;
            state.searchRoleId = undefined;
            state.searchUserType = undefined;
            saveFilters(state); // Lưu lại
        },
        setUserPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
            // Không cần saveFilters ở đây vì page không lưu
        }
    },
});

export const { setUserFilters, resetUserFilters, setUserPage } = userSlice.actions;

export default userSlice.reducer;