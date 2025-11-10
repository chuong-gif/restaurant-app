// packages/client/src/app/my-bookings/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DatBanItem } from '@/types/booking';

import GlobalSpinner from '@/components/common/GlobalSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// === Helper Functions ===
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
};

const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getStatusInfo = (status: number): { text: string; className: string } => {
    const statusMapping: { [key: number]: { text: string; className: string } } = {
        0: { text: 'SYSTEM TERMINATED', className: 'bg-red-600 text-white border border-red-400/50' },
        1: { text: 'AWAITING DEPOSIT', className: 'bg-yellow-600 text-black border border-yellow-400/50' },
        2: { text: 'DEPOSIT SECURED', className: 'bg-cyan-600 text-white border border-cyan-400/50' },
        3: { text: 'ACTIVE SESSION', className: 'bg-blue-600 text-white border border-blue-400/50' },
        4: { text: 'PENDING PAYMENT', className: 'bg-purple-600 text-white border border-purple-400/50' },
        5: { text: 'MISSION COMPLETE', className: 'bg-green-600 text-white border border-green-400/50' },
        6: { text: 'SYSTEM OFFLINE', className: 'bg-gray-600 text-white border border-gray-400/50' },
    };
    return statusMapping[status] || { text: 'UNKNOWN STATUS', className: 'bg-gray-500 text-white border border-gray-400/50' };
};

export default function MyBookingsPage() {
    const { data: bookings, isLoading, error } = useQuery<DatBanItem[]>({
        queryKey: ['myBookings'],
        queryFn: async () => {
            const response = await api.get('/user/my-reservations');
            return response.data;
        },
        staleTime: 1000 * 60,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-cyan-400 font-mono">LOADING RESERVATION DATA...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-30"></div>
                <Card className="relative bg-[#0f0f1a] border border-red-500/30 backdrop-blur-lg">
                    <CardHeader><CardTitle className="text-red-400 font-mono">SYSTEM ERROR</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-red-300 font-mono">DATA STREAM CORRUPTED. PLEASE RETRY.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-30"></div>
                <Card className="relative bg-[#0f0f1a] border border-cyan-500/30 backdrop-blur-lg text-center">
                    <CardHeader>
                        <CardTitle className="text-cyan-400 font-mono">NO ACTIVE RESERVATIONS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-cyan-300 font-mono mb-4">NEURAL DATABASE EMPTY. INITIATE NEW PROTOCOL.</p>
                        <Button asChild className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono border border-cyan-400/50 hover:border-cyan-300/50 transition-all duration-300">
                            <Link href="/booking">INITIATE BOOKING PROTOCOL</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-black/50 border border-cyan-500/30 rounded-lg mb-4">
                <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-cyan-400">ACTIVE RESERVATIONS: {bookings.length}</span>
                    <span className="text-purple-400">NEURAL INTERFACE: ONLINE</span>
                </div>
            </div>

            {bookings.map((booking) => {
                const statusInfo = getStatusInfo(booking.trang_thai);
                const total = booking.tong_tien || 0;
                const deposit = booking.tien_dat_coc || 0;

                return (
                    <div key={booking.id} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                        <Card className="relative bg-[#0f0f1a] border border-cyan-500/30 backdrop-blur-lg overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
                                <CardTitle className="text-lg font-mono text-cyan-300">
                                    RESERVATION: {booking.ma_dat_ban || `DB-${booking.id}`}
                                </CardTitle>
                                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${statusInfo.className}`}>
                                    {statusInfo.text}
                                </span>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <h4 className="font-mono text-cyan-400 text-sm">SYSTEM DATA</h4>
                                        <p className="text-sm text-cyan-200 font-mono">
                                            TABLE: {booking.ban_an?.so_ban || 'AUTO-ASSIGN'}
                                        </p>
                                        <p className="text-sm text-cyan-200 font-mono">
                                            GUESTS: {booking.so_luong_khach} UNITS
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-mono text-cyan-400 text-sm">TIME PROTOCOL</h4>
                                        <p className="text-sm text-cyan-200 font-mono">
                                            {formatDateTime(booking.ngay_dat_ban)}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-mono text-cyan-400 text-sm">FINANCIAL DATA</h4>
                                        <p className="text-sm text-cyan-200 font-mono">
                                            TOTAL: {formatCurrency(total)}
                                        </p>
                                        <p className="text-sm font-mono text-purple-300 font-bold">
                                            DEPOSIT: {formatCurrency(deposit)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gradient-to-r from-cyan-900/10 to-purple-900/10 py-3 px-6 flex justify-end gap-2">
                                {booking.trang_thai === 1 && (
                                    <Button
                                        variant="outline"
                                        disabled
                                        className="font-mono text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10 transition-all duration-300"
                                    >
                                        PAYMENT PROTOCOL [COMING SOON]
                                    </Button>
                                )}
                                <Button asChild className="font-mono bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border border-cyan-400/50 hover:border-cyan-300/50 transition-all duration-300">
                                    <Link href={`/my-bookings/${booking.id}`}>ACCESS DETAILS</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                );
            })}
        </div>
    );
}