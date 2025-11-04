// packages/client/src/app/my-bookings/layout.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/common/ProtectedRoute';

export default function MyBookingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Bọc toàn bộ trang bằng ProtectedRoute
        <ProtectedRoute>
            <div className="w-full">
                {/* Hero Header */}
                <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-secondary">
                            Đơn Đặt Bàn Của Tôi
                        </h1>
                        <nav aria-label="breadcrumb" className="mt-2">
                            <ol className="breadcrumb justify-content-center text-uppercase">
                                <li className="breadcrumb-item">
                                    <Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link>
                                </li>
                                <li className="breadcrumb-item text-white active" aria-current="page">
                                    Đơn của tôi
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Nội dung trang (danh sách hoặc chi tiết) */}
                <div className="container mx-auto max-w-6xl px-4 pb-12">
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}