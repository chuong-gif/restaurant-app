// packages/admin/src/features/reservations/reservationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Kiểu dữ liệu cho state filter
interface ReservationFilterState {
    page: number;
    limit: number; // Backend dùng limit
    searchName?: string;
    searchPhone?: string;
    reservation_code?: string;
    status?: string; // Backend nhận string, có thể là '' (tất cả)
}

// Load filter từ localStorage
const loadFilters = (): Partial<ReservationFilterState> => {
    const saved = localStorage.getItem('reservationFilters');
    return saved ? JSON.parse(saved) : {};
};

const initialState: ReservationFilterState = {
    page: 1,
    limit: 10,
    searchName: '',
    searchPhone: '',
    reservation_code: '',
    status: '', // Mặc định là 'tất cả'
    ...loadFilters(),
};

// Save filter vào localStorage
const saveFilters = (state: ReservationFilterState) => {
    const { page, ...filtersToSave } = state;
    localStorage.setItem('reservationFilters', JSON.stringify(filtersToSave));
};


const reservationSlice = createSlice({
    name: 'reservationFilters',
    initialState,
    reducers: {
        setReservationFilters: (state, action: PayloadAction<Partial<ReservationFilterState>>) => {
            const isPageChangeOnly = Object.keys(action.payload).length === 1 && 'page' in action.payload;
            if (!isPageChangeOnly) {
                state.page = 1;
            }
            Object.assign(state, action.payload);
            saveFilters(state);
        },
        resetReservationFilters: (state) => {
            Object.assign(state, { // Reset về giá trị ban đầu
                page: 1,
                searchName: '',
                searchPhone: '',
                reservation_code: '',
                status: '',
            });
            saveFilters(state);
        },
        setReservationPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
            // Không save page
        }
    },
});

export const { setReservationFilters, resetReservationFilters, setReservationPage } = reservationSlice.actions;

export default reservationSlice.reducer;