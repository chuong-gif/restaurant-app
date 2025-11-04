// packages/client/src/app/my-bookings/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DatBanItem } from '@/types/booking'; // Import kiểu mới

import GlobalSpinner from '@/components/common/GlobalSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// === Helper Functions (Lấy từ file cũ) ===
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

// Map trạng thái từ server (Int) sang Giao diện (dựa trên My-bookings.js [cite: 254-261])
const getStatusInfo = (status: number): { text: string; className: string } => {
    const statusMapping: { [key: number]: { text: string; className: string } } = {
        0: { text: 'Đã hủy', className: 'bg-destructive text-destructive-foreground' },
        1: { text: 'Chờ cọc', className: 'bg-yellow-500 text-black' },
        2: { text: 'Đã cọc', className: 'bg-primary text-primary-foreground' },
        3: { text: 'Đã check-in', className: 'bg-blue-500 text-white' },
        4: { text: 'Chờ thanh toán', className: 'bg-blue-600 text-white' },
        5: { text: 'Hoàn thành', className: 'bg-green-600 text-white' },
        6: { text: 'Không đến', className: 'bg-gray-500 text-white' },
    };
    return statusMapping[status] || { text: 'Không xác định', className: 'bg-gray-300 text-black' };
};
// ===================================

export default function MyBookingsPage() {

    // Gọi API `GET /api/v1/user/my-reservations` (từ myReservation.routes.ts [cite: 8-9])
    const { data: bookings, isLoading, error } = useQuery<DatBanItem[]>({
        queryKey: ['myBookings'],
        queryFn: async () => {
            const response = await api.get('/user/my-reservations');
            return response.data; // Server trả về một mảng DatBanItem
        },
        staleTime: 1000 * 60, // Cache 1 phút
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <GlobalSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardHeader><CardTitle>Lỗi</CardTitle></CardHeader>
                <CardContent><p>Không thể tải lịch sử đặt bàn. Vui lòng thử lại sau.</p></CardContent>
            </Card>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <Card>
                <CardHeader><CardTitle>Chưa có đơn đặt bàn</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Bạn chưa có đơn đặt bàn nào. Hãy đặt ngay!</p>
                    <Button asChild style={{ color: 'black' }}>
                        <Link href="/booking">Đặt bàn ngay</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => {
                const statusInfo = getStatusInfo(booking.trang_thai);
                const total = booking.tong_tien || 0;
                const deposit = booking.tien_dat_coc || 0;

                return (
                    <Card key={booking.id} className="shadow-md overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
                            <CardTitle className="text-lg font-medium">
                                Mã đơn: {booking.ma_dat_ban || `DB-${booking.id}`}
                            </CardTitle>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>
                                {statusInfo.text}
                            </span>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h4 className="font-semibold">Thông tin</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Bàn số: {booking.ban_an?.so_ban || 'Tự động'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Số khách: {booking.so_luong_khach} người
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Thời gian</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDateTime(booking.ngay_dat_ban)}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Thanh toán</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Tổng tiền: {formatCurrency(total)}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        Cần cọc: {formatCurrency(deposit)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 py-3 px-6 flex justify-end gap-2">
                            {/* Logic nút bấm (Thanh toán, Hủy, Đổi món) sẽ được thêm ở bước sau */}
                            {booking.trang_thai === 1 && (
                                <Button variant="outline" disabled>Thanh toán cọc (Coming Soon)</Button>
                            )}
                            <Button asChild>
                                <Link href={`/my-bookings/${booking.id}`}>Xem chi tiết</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}