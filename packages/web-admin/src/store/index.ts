// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import customersReducer from './slices/customerSlice';
import authReducer from './slices/authSlice'; // 1. Import authReducer

export const store = configureStore({
    reducer: {
        customers: customersReducer,
        auth: authReducer, // 2. Thêm authReducer vào đây
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;