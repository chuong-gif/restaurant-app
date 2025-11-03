// packages/client/src/app/booking/confirm/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

import GlobalSpinner from '@/components/common/GlobalSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

// Hàm format tiền
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
};

// Hàm format ngày (lấy từ file cũ [cite: 18-20])
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

export default function BookingConfirmPage() {
    const router = useRouter();
    const { toast } = useToast();

    // Lấy dữ liệu từ các store
    const { info, selectedTable, cart, getTotalPrice, clearBooking } = useBookingStore();
    const { user } = useAuthStore();

    // Bảo vệ route: Nếu chưa điền thông tin ở Bước 1, đá về
    useEffect(() => {
        if (!info.reservation_date || !info.party_size) {
            router.replace('/booking');
        }
    }, [info, router]);

    // Mutation để gọi API tạo đơn
    const mutation = useMutation({
        mutationFn: (bookingData: any) => {
            return api.post('/public/reservations', bookingData); // [cite: 5-6]
        },
        onSuccess: (response) => {
            toast({
                title: "Đặt bàn thành công!",
                description: "Đơn của bạn đang chờ xác nhận. Vui lòng kiểm tra email.",
            });
            clearBooking(); // Xóa giỏ hàng

            // Chuyển hướng
            if (user) {
                router.push('/my-bookings'); // Về trang đơn của tôi nếu đã đăng nhập
            } else {
                router.push('/'); // Về trang chủ nếu là khách
            }
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Đặt bàn thất bại",
                description: error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
            });
        },
    });

    // Hàm xử lý khi nhấn nút "Xác nhận Đặt bàn"
    const handleConfirmBooking = () => {
        // Chuẩn bị dữ liệu gửi lên server
        const bookingData = {
            ...info,
            user_id: user?.id || null, // Lấy ID nếu đã đăng nhập [cite: 99-100]
            ban_an_id: selectedTable?.id || null, // Gửi ID bàn nếu tự chọn [cite: 74-170]
            products: cart.map(item => ({ // Gửi danh sách món ăn
                product_id: item.product_id,
                quantity: item.quantity,
            })),
            // Server sẽ tự tính tổng tiền và tiền cọc
        };
        mutation.mutate(bookingData);
    };

    // Tính toán tiền
    const total = getTotalPrice();
    const deposit = total * 0.3; // 30% tiền cọc (theo logic server [cite: 120-121])

    // Nếu state chưa sẵn sàng (bị F5), quay về
    if (!info.reservation_date) {
        return <GlobalSpinner />;
    }

    return (
        <div className="container mx-auto max-w-4xl px-4">
            <Card className="shadow-lg border-0">
                <CardHeader>
                    <CardTitle className="text-2xl font-secondary text-primary text-center">
                        Xác nhận thông tin đặt bàn
                    </CardTitle>
                    <CardDescription className="text-center">
                        Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cột 1: Thông tin đơn */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Thông tin khách hàng</h3>
                            <p><strong>Họ tên:</strong> {info.fullname}</p>
                            <p><strong>Email:</strong> {info.email}</p>
                            <p><strong>SĐT:</strong> {info.tel}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Chi tiết đặt bàn</h3>
                            <p><strong>Ngày giờ:</strong> {formatDateTime(info.reservation_date!)}</p>
                            <p><strong>Số người:</strong> {info.party_size} người</p>
                            <p>
                                <strong>Bàn ăn:</strong>{' '}
                                {selectedTable ? `Bàn số ${selectedTable.so_ban} (Tầng ${selectedTable.tang})` : "Tự động xếp bàn"}
                            </p>
                            <p><strong>Ghi chú:</strong> {info.note || 'Không có'}</p>
                        </div>
                    </div>

                    {/* Cột 2: Món ăn đã chọn */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg mb-2">Món ăn đã chọn ({cart.length})</h3>
                        <ScrollArea className="h-[250px] w-full pr-4 border rounded-md p-3">
                            {cart.length === 0 ? (
                                <p className="text-muted-foreground text-center py-10">Chưa chọn món nào</p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.product_id} className="flex items-center gap-3">
                                            <Image
                                                src={item.hinh_anh}
                                                alt={item.ten_san_pham}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-cover h-10 w-10"
                                            />
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-sm font-medium leading-none truncate">
                                                    {item.ten_san_pham} (x{item.quantity})
                                                </h4>
                                                <p className="text-xs text-muted-foreground">{formatCurrency(item.gia)}</p>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {formatCurrency(item.gia * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                        <Separator />
                        <div className="space-y-2">
                            <div className="flex justify-between font-medium">
                                <span>Tạm tính (Món ăn)</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg text-primary">
                                <span>Tiền cọc (30%)</span>
                                <span>{formatCurrency(deposit)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button
                        size="lg"
                        className="w-full"
                        style={{ color: 'black' }}
                        onClick={handleConfirmBooking}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Đang xử lý..." : `Xác nhận & Đặt cọc ${formatCurrency(deposit)}`}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push('/booking/select')}
                        disabled={mutation.isPending}
                    >
                        Quay lại (Chọn món)
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}