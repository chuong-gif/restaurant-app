// packages/client/src/app/my-bookings/[id]/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DatBan } from '@/types/booking'; // Import kiểu chi tiết
import Link from 'next/link';

import GlobalSpinner from '@/components/common/GlobalSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import Image from 'next/image';

// === Helper Functions (Giống file trước) ===
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
        0: { text: 'Đã hủy', className: 'text-destructive' },
        1: { text: 'Chờ cọc', className: 'text-yellow-600' },
        2: { text: 'Đã cọc', className: 'text-primary' },
        3: { text: 'Đã check-in', className: 'text-blue-500' },
        4: { text: 'Chờ thanh toán', className: 'text-blue-600' },
        5: { text: 'Hoàn thành', className: 'text-green-600' },
        6: { text: 'Không đến', className: 'text-gray-500' },
    };
    return statusMapping[status] || { text: 'Không xác định', className: 'text-gray-500' };
};
// ===================================

export default function MyBookingDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    // Gọi API `GET /api/v1/user/my-reservations/:id` (từ myReservation.routes.ts [cite: 11-12])
    const { data: booking, isLoading, error } = useQuery<DatBan>({
        queryKey: ['myBookingDetail', id],
        queryFn: async () => {
            const response = await api.get(`/user/my-reservations/${id}`);
            return response.data; // Server trả về một object DatBan
        },
        enabled: !!id,
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
                <CardContent>
                    <p>Không thể tải chi tiết đơn đặt bàn. Đơn có thể không tồn tại hoặc bạn không có quyền xem.</p>
                    <Button variant="outline" className="mt-4" asChild>
                        <Link href="/my-bookings">Quay lại danh sách</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!booking) return null;

    // Tái tạo logic tính tiền từ MyBookingDetail.js [cite: 194-203]
    const subTotal = booking.chi_tiet_dat_ban.reduce((acc, item) => acc + (item.gia_tai_thoi_diem * item.so_luong), 0);
    const discountAmount = booking.khuyen_mai
        ? (booking.khuyen_mai.loai_giam_gia ? (subTotal * booking.khuyen_mai.giam_gia / 100) : booking.khuyen_mai.giam_gia)
        : 0;
    const tax = (subTotal - discountAmount) * 0.10; // Giả sử thuế 10%
    const total = subTotal - discountAmount + tax;
    const deposit = booking.tien_dat_coc;
    const remaining = total - deposit;

    const statusInfo = getStatusInfo(booking.trang_thai);

    return (
        <Card className="shadow-lg max-w-4xl mx-auto">
            <CardHeader className="text-center">
                <Image src="/images/logo.png" alt="Logo" width={60} height={60} className="mx-auto" />
                <CardTitle className="text-3xl font-secondary text-primary mt-2">
                    Hóa đơn Đặt bàn
                </CardTitle>
                <CardDescription>
                    Mã đơn: {booking.ma_dat_ban || `DB-${booking.id}`}
                </CardDescription>
                <div className={`text-lg font-semibold ${statusInfo.className}`}>
                    {statusInfo.text}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                        <p><strong>Tên:</strong> {booking.ho_ten_khach}</p>
                        <p><strong>Phone:</strong> {booking.dien_thoai}</p>
                        <p><strong>Email:</strong> {booking.email}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Chi tiết đặt bàn</h3>
                        <p><strong>Ngày giờ:</strong> {formatDateTime(booking.ngay_dat_ban)}</p>
                        <p><strong>Số người:</strong> {booking.so_luong_khach} người</p>
                        <p><strong>Bàn:</strong> {booking.ban_an ? `Bàn ${booking.ban_an.so_ban} (Tầng ${booking.ban_an.tang})` : 'Tự động'}</p>
                        <p><strong>Ghi chú:</strong> {booking.ghi_chu || 'Không có'}</p>
                    </div>
                </div>

                <Separator className="my-6" />

                <h3 className="font-semibold mb-4">Chi tiết món ăn</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Món ăn</TableHead>
                            <TableHead className="text-center">Số lượng</TableHead>
                            <TableHead className="text-right">Đơn giá</TableHead>
                            <TableHead className="text-right">Thành tiền</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {booking.chi_tiet_dat_ban.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{(item.san_pham as any).ten_san_pham}</TableCell>
                                <TableCell className="text-center">{item.so_luong}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.gia_tai_thoi_diem)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.gia_tai_thoi_diem * item.so_luong)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3} className="text-right font-medium">Tạm tính (Món ăn)</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(subTotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} className="text-right">Giảm giá {booking.khuyen_mai ? `(${booking.khuyen_mai.ma_khuyen_mai})` : ''}</TableCell>
                            <TableCell className="text-right">-{formatCurrency(discountAmount)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} className="text-right">Thuế (10%)</TableCell>
                            <TableCell className="text-right">{formatCurrency(tax)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} className="text-right text-lg font-bold">Tổng cộng</TableCell>
                            <TableCell className="text-right text-lg font-bold">{formatCurrency(total)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} className="text-right text-primary font-semibold">Đã cọc / Cần cọc</TableCell>
                            <TableCell className="text-right text-primary font-semibold">{formatCurrency(deposit)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} className="text-right text-xl font-bold">Còn lại</TableCell>
                            <TableCell className="text-right text-xl font-bold">
                                {booking.trang_thai === 5 ? formatCurrency(0) : formatCurrency(remaining > 0 ? remaining : 0)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>

                <div className="flex justify-end gap-2 mt-8">
                    <Button variant="outline" asChild>
                        <Link href="/my-bookings">Quay lại danh sách</Link>
                    </Button>
                    {/* Nút thanh toán sẽ được thêm vào đây */}
                </div>
            </CardContent>
        </Card>
    );
}