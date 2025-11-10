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
        <ProtectedRoute>
            <div className="w-full bg-[#0a0a0f] min-h-screen">
                {/* Hero Header - Cyberpunk Style */}
                <div className="w-full py-24 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2f] to-[#0a0a0f] relative overflow-hidden">
                    {/* Animated Grid Background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
                            backgroundSize: '50px 50px',
                        }}></div>
                    </div>

                    {/* Glowing Effects */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                    <div className="text-center text-white relative z-10">
                        <h1 className="text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                SYSTEM RESERVATIONS
                            </span>
                        </h1>
                        <p className="text-cyan-300 text-lg mb-4 font-mono">NEURAL BOOKING INTERFACE</p>
                        <nav aria-label="breadcrumb" className="mt-2">
                            <ol className="flex justify-center items-center space-x-2 text-sm uppercase font-mono">
                                <li className="flex items-center">
                                    <Link href="/" className="text-cyan-300 hover:text-cyan-100 transition-colors duration-300">
                                        HOME SYSTEM
                                    </Link>
                                    <span className="mx-2 text-cyan-500">/</span>
                                </li>
                                <li className="text-cyan-100 font-semibold">RESERVATION DATA</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Nội dung trang */}
                <div className="container mx-auto max-w-6xl px-4 pb-20">
                    {children}
                </div>

                {/* Cyberpunk Grid Overlay */}
                <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.15) 1px, transparent 0)`,
                        backgroundSize: '50px 50px',
                    }}></div>
                </div>
            </div>
        </ProtectedRoute>
    );
}