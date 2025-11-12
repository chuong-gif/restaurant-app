// packages/client/src/app/my-bookings/[id]/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DatBan } from '@/types/booking';
import Link from 'next/link';

import GlobalSpinner from '@/components/common/GlobalSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import Image from 'next/image';

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
        0: { text: 'SYSTEM TERMINATED', className: 'text-red-400' },
        1: { text: 'AWAITING DEPOSIT', className: 'text-yellow-400' },
        2: { text: 'DEPOSIT SECURED', className: 'text-cyan-400' },
        3: { text: 'ACTIVE SESSION', className: 'text-blue-400' },
        4: { text: 'PENDING PAYMENT', className: 'text-purple-400' },
        5: { text: 'MISSION COMPLETE', className: 'text-green-400' },
        6: { text: 'SYSTEM OFFLINE', className: 'text-gray-400' },
    };
    return statusMapping[status] || { text: 'UNKNOWN STATUS', className: 'text-gray-400' };
};

export default function MyBookingDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: booking, isLoading, error } = useQuery<DatBan>({
        queryKey: ['myBookingDetail', id],
        queryFn: async () => {
            const response = await api.get(`/user/my-reservations/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-cyan-400 font-mono">Đang truy cập dữ liệu đặt chỗ...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-30"></div>
                <Card className="relative bg-[#0f0f1a] border border-red-500/30 backdrop-blur-lg">
                    <CardHeader><CardTitle className="text-red-400 font-mono">Lỗi luồng dữ liệu</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-red-300 font-mono mb-4">KHÔNG THỂ TRUY CẬP LUỒNG DỮ LIỆU ĐẶT CHỖ.</p>
                        <Button variant="outline" className="font-mono border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300" asChild>
                            <Link href="/my-bookings">QUAY LẠI CƠ SỞ DỮ LIỆU</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!booking) return null;

    const subTotal = booking.chi_tiet_dat_ban.reduce((acc, item) => acc + (item.gia_tai_thoi_diem * item.so_luong), 0);
    const discountAmount = booking.khuyen_mai
        ? (booking.khuyen_mai.loai_giam_gia ? (subTotal * booking.khuyen_mai.giam_gia / 100) : booking.khuyen_mai.giam_gia)
        : 0;
    const tax = (subTotal - discountAmount) * 0.10;
    const total = subTotal - discountAmount + tax;
    const deposit = booking.tien_dat_coc;
    const remaining = total - deposit;

    const statusInfo = getStatusInfo(booking.trang_thai);

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <Card className="relative bg-[#0f0f1a] border border-cyan-500/30 backdrop-blur-lg shadow-2xl max-w-4xl mx-auto">
                <CardHeader className="text-center bg-gradient-to-b from-cyan-900/20 to-transparent p-8">
                    <div className="relative inline-block mb-4">
                        <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-50"></div>
                        <Image src="/images/logo.png" alt="Logo" width={80} height={80} className="relative z-10 rounded-full border-2 border-cyan-400/50 mx-auto" />
                    </div>
                    <CardTitle className="text-4xl font-mono text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mt-4">
                        Giao thức đặt chỗ
                    </CardTitle>
                    <CardDescription className="text-cyan-300 font-mono mt-2">
                        ID: {booking.ma_dat_ban || `DB-${booking.id}`}
                    </CardDescription>
                    <div className={`text-xl font-mono font-bold ${statusInfo.className} mt-3`}>
                        {statusInfo.text}
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <h3 className="font-mono text-cyan-400 text-lg border-b border-cyan-500/30 pb-2">Dữ liệu khách hàng</h3>
                            <div className="space-y-2">
                                <p className="text-cyan-200 font-mono"><strong>Tên:</strong> {booking.ho_ten_khach}</p>
                                <p className="text-cyan-200 font-mono"><strong>Liên hệ:</strong> {booking.dien_thoai}</p>
                                <p className="text-cyan-200 font-mono"><strong>Email:</strong> {booking.email}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-mono text-purple-400 text-lg border-b border-purple-500/30 pb-2">Dữ liệu đặt chỗ</h3>
                            <div className="space-y-2">
                                <p className="text-purple-200 font-mono"><strong>Thời Gian:</strong> {formatDateTime(booking.ngay_dat_ban)}</p>
                                <p className="text-purple-200 font-mono"><strong>Số Lượng:</strong> {booking.so_luong_khach} THỰC THỂ CYBERNETIC</p>
                                <p className="text-purple-200 font-mono"><strong>Vị Trí:</strong> {booking.ban_an ? `BÀN ${booking.ban_an.so_ban} (TẦNG ${booking.ban_an.tang})` : 'TỰ ĐỘNG PHÂN BỔ'}</p>
                                <p className="text-purple-200 font-mono"><strong>Ghi chú:</strong> {booking.ghi_chu || 'KHÔNG CÓ DỮ LIỆU'}</p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8 bg-cyan-500/30" />

                    <h3 className="font-mono text-cyan-400 text-lg mb-6">Luồng dữ liệu tiêu thụ</h3>
                    <div className="border border-cyan-500/30 rounded-lg overflow-hidden">
                        <Table className="bg-black/50">
                            <TableHeader>
                                <TableRow className="border-b border-cyan-500/30">
                                    <TableHead className="font-mono text-cyan-300">MẶT HÀNG</TableHead>
                                    <TableHead className="text-center font-mono text-cyan-300">SỐ LƯỢNG</TableHead>
                                    <TableHead className="text-right font-mono text-cyan-300">ĐƠN GIÁ</TableHead>
                                    <TableHead className="text-right font-mono text-cyan-300">TỔNG CỘNG</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {booking.chi_tiet_dat_ban.map((item, index) => (
                                    <TableRow key={index} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors duration-300">
                                        <TableCell className="font-mono text-cyan-200">{(item.san_pham as any).ten_san_pham.toUpperCase()}</TableCell>
                                        <TableCell className="text-center font-mono text-cyan-200">{item.so_luong}</TableCell>
                                        <TableCell className="text-right font-mono text-cyan-200">{formatCurrency(item.gia_tai_thoi_diem)}</TableCell>
                                        <TableCell className="text-right font-mono text-cyan-200">{formatCurrency(item.gia_tai_thoi_diem * item.so_luong)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter className="bg-cyan-900/20">
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-mono font-medium text-cyan-300">TỔNG PHỤ</TableCell>
                                    <TableCell className="text-right font-mono font-medium text-cyan-300">{formatCurrency(subTotal)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-mono text-purple-300">GIẢM GIÁ {booking.khuyen_mai ? `(${booking.khuyen_mai.ma_khuyen_mai})` : ''}</TableCell>
                                    <TableCell className="text-right font-mono text-purple-300">-{formatCurrency(discountAmount)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-mono text-blue-300">THUẾ HỆ THỐNG (10%)</TableCell>
                                    <TableCell className="text-right font-mono text-blue-300">{formatCurrency(tax)}</TableCell>
                                </TableRow>
                                <TableRow className="border-t border-cyan-500/30">
                                    <TableCell colSpan={3} className="text-right font-mono text-lg font-bold text-cyan-400">TỔNG CHI PHÍ</TableCell>
                                    <TableCell className="text-right font-mono text-lg font-bold text-cyan-400">{formatCurrency(total)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-mono font-semibold text-purple-400">TIỀN ĐẶT CỌC</TableCell>
                                    <TableCell className="text-right font-mono font-semibold text-purple-400">{formatCurrency(deposit)}</TableCell>
                                </TableRow>
                                <TableRow className="border-t border-cyan-500/30 bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
                                    <TableCell colSpan={3} className="text-right font-mono text-xl font-bold text-white">SỐ DƯ CÒN LẠI</TableCell>
                                    <TableCell className="text-right font-mono text-xl font-bold text-white">
                                        {booking.trang_thai === 5 ? formatCurrency(0) : formatCurrency(remaining > 0 ? remaining : 0)}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <Button variant="outline" className="font-mono border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300" asChild>
                            <Link href="/my-bookings">QUAY LẠI DANH SÁCH</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}