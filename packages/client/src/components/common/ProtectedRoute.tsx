'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import GlobalSpinner from './GlobalSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    // Chỉ lấy `token` để kiểm tra, không lấy `user`
    const token = useAuthStore(state => state.token);

    const [isChecking, setIsChecking] = React.useState(true);

    useEffect(() => {
        if (!token) {
            // Nếu không có token, chuyển hướng về login
            router.replace('/login');
        } else {
            // Nếu có token, cho phép render
            setIsChecking(false);
        }
        // === SỬA LỖI Ở ĐÂY: Xóa `user` khỏi dependency array ===
    }, [token, router]);
    // ===================================================

    if (isChecking) {
        // Hiển thị spinner toàn màn hình trong khi chờ kiểm tra
        return <GlobalSpinner />;
    }

    // Nếu đã kiểm tra và có token, render nội dung
    return <>{children}</>;
}