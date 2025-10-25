import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../services/baseApi';
import authReducer from '../features/auth/authSlice';
import productFiltersReducer from '../features/products/productSlice';
import categoryFiltersReducer from '../features/categories/categorySlice';

export const store = configureStore({
    reducer: {
        // Gắn reducer của API service
        [baseApi.reducerPath]: baseApi.reducer,
        // Gắn reducer của auth slice
        auth: authReducer,
        productFilters: productFiltersReducer,
        categoryFilters: categoryFiltersReducer,
    },
    // Thêm middleware của API service để quản lý caching, invalidation, polling
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

// Cần thiết để sử dụng refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Định nghĩa kiểu cho RootState và AppDispatch để sử dụng trong toàn bộ ứng dụng
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;