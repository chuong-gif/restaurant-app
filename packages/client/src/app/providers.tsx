'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

// Component này dùng để "hydrate" (tải) state từ localStorage
// vào Zustand store khi ứng dụng bắt đầu ở phía client.
const AuthHydrator = () => {
    useEffect(() => {
        // Kích hoạt việc tải state từ localStorage
        useAuthStore.persist.rehydrate();
    }, []);
    return null; // Không render gì cả
};

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthHydrator />
            {children}
        </QueryClientProvider>
    );
}