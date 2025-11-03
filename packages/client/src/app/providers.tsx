// packages/client/src/app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

// Component này dùng để "hydrate" (tải) state từ localStorage
const AuthHydrator = () => {
    useEffect(() => {
        useAuthStore.persist.rehydrate();
    }, []);
    return null;
};

export default function Providers({ children }: { children: React.ReactNode }) {
    // Tạo 1 client duy nhất
    const [queryClient] = useState(() => new QueryClient());

    return (
        // BỌC MỌI THỨ BẰNG PROVIDER NÀY
        <QueryClientProvider client={queryClient}>
            <AuthHydrator />
            {children}
        </QueryClientProvider>
    );
}