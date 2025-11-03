// packages/client/src/app/booking/layout.tsx
'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import '@/types/booking-steps.css'; // Chúng ta sẽ tạo file này

// Định nghĩa các bước
const steps = [
    { path: '/booking', label: 'Điền thông tin' },
    { path: '/booking/select', label: 'Chọn Bàn & Món' },
    { path: '/booking/confirm', label: 'Xác nhận' },
    // { path: '/booking/payment', label: 'Thanh toán' }, // Bước 3 & 4 có thể gộp
];

export default function BookingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const activeIndex = steps.findIndex(step => step.path === pathname);

    return (
        <div>
            {/* Hero Header */}
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                <h1 className="text-4xl font-secondary text-white">Đặt Bàn Online</h1>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center text-uppercase">
                        <li className="breadcrumb-item">
                            <Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link>
                        </li>
                        <li className="breadcrumb-item text-white active" aria-current="page">
                            Đặt bàn
                        </li>
                    </ol>
                </nav>
            </div>

            {/* Thanh tiến trình (Progress Steps)  */}
            <div className="container mx-auto max-w-4xl px-4 text-center my-12">
                <div className="progress-steps">
                    {steps.map((step, index) => (
                        <div
                            key={step.path}
                            className={`step ${index === activeIndex ? 'active' : ''} ${index < activeIndex ? 'completed' : ''}`}
                        >
                            <span className="circle">{index + 1}</span>
                            <p>{step.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nội dung trang (các bước) */}
            <div className="container-xxl py-5 px-0 wow fadeInUp">
                {children}
            </div>
        </div>
    );
}