// packages/admin/src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../services/baseApi';
import authReducer from '../features/auth/authSlice';
import productFiltersReducer from '../features/products/productSlice';
import categoryFiltersReducer from '../features/categories/categorySlice';
import userFiltersReducer from '../features/users/userSlice'; // <-- THÊM DÒNG NÀY
import reservationFiltersReducer from '../features/reservations/reservationSlice';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
        productFilters: productFiltersReducer,
        categoryFilters: categoryFiltersReducer,
        userFilters: userFiltersReducer,
        reservationFilters: reservationFiltersReducer, // <-- THÊM DÒNG NÀY
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;