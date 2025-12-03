// packages/client/src/app/booking/confirm/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
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

export default function BookingConfirmPage() {
    const router = useRouter();
    const { toast } = useToast();

    const {
        info,
        selectedTables,
        cart,
        getTotalPrice,
        clearBooking,
        appliedPromo,
        applyPromo,
        removePromo,
        getDiscountedTotal,
        getDiscountAmount
    } = useBookingStore();

    const { user } = useAuthStore();
    // State cho input mã khuyến mãi
    const [promoInput, setPromoInput] = useState('');
    const [isCheckingPromo, setIsCheckingPromo] = useState(false);


    useEffect(() => {
        if (!info.reservation_date || !info.party_size) {
            router.replace('/booking');
        }
    }, [info, router]);
    // Hàm kiểm tra mã khuyến mãi
    const handleCheckPromo = async () => {
        if (!promoInput.trim()) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Vui lòng nhập mã khuyến mãi",
            });
            return;
        }

        setIsCheckingPromo(true);
        try {
            const response = await api.post('/public/promotions/check', {
                promo_code: promoInput.toUpperCase(),
                total_amount: getTotalPrice(),
            });

            if (response.data.valid) {
                applyPromo({
                    id: response.data.promo_id,
                    code: promoInput.toUpperCase(),
                    discount: response.data.discount_amount,
                    discount_type: response.data.discount_type,
                });
                toast({
                    title: "Thành công",
                    description: `Áp dụng mã ${promoInput.toUpperCase()} thành công`,
                });
                setPromoInput('');
            } else {
                toast({
                    variant: "destructive",
                    title: "Mã không hợp lệ",
                    description: response.data.message,
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error.response?.data?.message || "Không thể kiểm tra mã khuyến mãi",
            });
        } finally {
            setIsCheckingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        removePromo();
        toast({
            title: "Đã xóa",
            description: "Mã khuyến mãi đã được xóa",
        });
    };

    const mutation = useMutation({
        mutationFn: (bookingData: any) => {
            return api.post('/public/reservations', bookingData);
        },
        onSuccess: (response) => {
            toast({
                title: "BOOKING_CONFIRMED",
                description: "RESERVATION_QUEUED_FOR_PROCESSING",
            });
            clearBooking();

            if (user) {
                router.push('/my-bookings');
            } else {
                router.push('/');
            }
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "BOOKING_FAILED",
                description: error.response?.data?.message || "SYSTEM_ERROR_OCCURRED",
            });
        },
    });

    const handleConfirmBooking = () => {
        const bookingData = {
            ...info,
            user_id: user?.id || null,
            ban_an_ids: selectedTables.map(table => table.id),
            products: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
            })),
            promo_code: appliedPromo?.code || null,
            khuyen_mai_id: appliedPromo?.id || null,
        };
        mutation.mutate(bookingData);
    };

    // Tính toán tổng tiền
    const subtotal = getTotalPrice();
    const discount = getDiscountAmount();
    const total = getTotalPrice();
    const deposit = total * 0.3;

    if (!info.reservation_date) {
        return <GlobalSpinner />;
    }

    return (
        <div className="container mx-auto max-w-4xl px-4">
            <Card className="bg-[#0a0a0f] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                <CardHeader className="border-b border-cyan-500/20">
                    <CardTitle className="text-2xl font-mono text-cyan-400 text-center tracking-wider">
                        Giao thức xác nhận
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    {/* Column 1: Booking Information */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-mono text-cyan-300 text-lg mb-4 tracking-wider">Dữ liệu người dùng</h3>
                            <div className="space-y-3 font-mono text-sm">
                                <p className="text-cyan-100"><span className="text-cyan-400/70">HỌ TÊN:</span> {info.fullname}</p>
                                <p className="text-cyan-100"><span className="text-cyan-400/70">EMAIL:</span> {info.email}</p>
                                <p className="text-cyan-100"><span className="text-cyan-400/70">LIÊN HỆ:</span> {info.tel}</p>
                            </div>
                        </div>

                        {/* === PHẦN MÃ KHUYẾN MÃI MỚI === */}
                        <div>
                            <h3 className="font-mono text-cyan-300 text-lg mb-4 tracking-wider">Mã khuyến mãi</h3>
                            <div className="space-y-3">
                                {!appliedPromo ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={promoInput}
                                            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                            placeholder="Nhập mã khuyến mãi"
                                            className="flex-1 bg-transparent border border-cyan-500/30 rounded px-3 py-2 font-mono text-cyan-100 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400"
                                            disabled={mutation.isPending}
                                        />
                                        <Button
                                            onClick={handleCheckPromo}
                                            disabled={!promoInput.trim() || isCheckingPromo || mutation.isPending}
                                            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 font-mono px-4 py-2 rounded"
                                        >
                                            {isCheckingPromo ? "Đang kiểm tra..." : "Áp dụng"}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded p-3">
                                        <div>
                                            <p className="font-mono text-green-400">Mã: {appliedPromo.code}</p>
                                            <p className="font-mono text-green-300 text-sm">
                                                Giảm: {appliedPromo.discount_type ?
                                                    `${appliedPromo.discount}%` :
                                                    formatCurrency(appliedPromo.discount)
                                                }
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleRemovePromo}
                                            variant="outline"
                                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-mono text-sm"
                                            disabled={mutation.isPending}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* =============================== */}

                        <Separator className="bg-cyan-500/30" />

                        <div>
                            <h3 className="font-mono text-cyan-300 text-lg mb-4 tracking-wider">CHI TIẾT ĐẶT BÀN</h3>
                            <div className="space-y-3 font-mono text-sm">
                                <p className="text-cyan-100"><span className="text-cyan-400/70">THỜI GIAN:</span> {formatDateTime(info.reservation_date!)}</p>
                                <p className="text-cyan-100"><span className="text-cyan-400/70">SỐ NGƯỜI:</span> {info.party_size}</p>
                                <p className="text-cyan-100">
                                    <span className="text-cyan-400/70">Bàn:</span>{' '}
                                    {selectedTables.length > 0
                                        ? selectedTables.map(t => `TABLE_${t.so_ban}`).join(', ')
                                        : "AUTO_ASSIGN"}
                                </p>
                                <p className="text-cyan-100"><span className="text-cyan-400/70">Ghi chú:</span> {info.note || 'NONE'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Selected Items */}
                    <div className="space-y-6">
                        <h3 className="font-mono text-cyan-300 text-lg tracking-wider">MÓN ĐÃ CHỌN ({cart.length})</h3>
                        <ScrollArea className="h-[250px] w-full pr-4 border border-cyan-500/30 rounded-md p-4">
                            {/* ... existing cart items ... */}
                        </ScrollArea>
                        <Separator className="bg-cyan-500/30" />
                        <div className="space-y-3">
                            <div className="flex justify-between font-mono font-medium">
                                <span className="text-cyan-100">Tổng phụ</span>
                                <span className="text-cyan-400">{formatCurrency(subtotal)}</span>
                            </div>

                            {/* === HIỂN THỊ GIẢM GIÁ === */}
                            {appliedPromo && (
                                <div className="flex justify-between font-mono">
                                    <span className="text-cyan-100">Giảm giá</span>
                                    <span className="text-green-400">
                                        -{formatCurrency(discount)}
                                    </span>
                                </div>
                            )}
                            {/* ====================== */}

                            {appliedPromo && (
                                <div className="flex justify-between font-mono border-t border-cyan-500/30 pt-2">
                                    <span className="text-cyan-100">Tổng sau giảm</span>
                                    <span className="text-cyan-300 font-semibold">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between font-mono font-semibold text-lg">
                                <span className="text-cyan-100">TIỀN ĐẶT CỌC (30%)</span>
                                <span className="text-cyan-400 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                    {formatCurrency(deposit)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4 p-6">
                    <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 font-mono tracking-wider transition-all duration-300 disabled:opacity-50"
                        onClick={handleConfirmBooking}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "PROCESSING..." : `CONFIRM_&_PAY_DEPOSIT ${formatCurrency(deposit)}`}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-400 font-mono tracking-wider transition-all"
                        onClick={() => router.push('/booking/select')}
                        disabled={mutation.isPending}
                    >
                        QUAY LẠI CHỌN MÓN
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}