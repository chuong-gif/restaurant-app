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

    const { info, selectedTables, cart, getTotalPrice, clearBooking } = useBookingStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (!info.reservation_date || !info.party_size) {
            router.replace('/booking');
        }
    }, [info, router]);

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
        };
        mutation.mutate(bookingData);
    };

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
                        CONFIRMATION_PROTOCOL
                    </CardTitle>
                    <CardDescription className="text-center font-mono text-cyan-400/70">
                        VERIFY_ALL_DATA_BEFORE_CONFIRMATION
                    </CardDescription>
                </CardHeader>
                // packages/client/src/app/booking/confirm/page.tsx (sửa phần CardContent)
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    {/* Column 1: Booking Information */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-mono text-cyan-300 text-lg mb-4 tracking-wider">USER_DATA</h3>
                            <div className="space-y-3 font-mono text-sm">
                                {/* SỬA: Đổi màu chữ thành sáng hơn */}
                                <p className="text-cyan-100"><span className="text-cyan-400/70">NAME:</span> {info.fullname}</p>
                                <p className="text-cyan-100"><span className="text-cyan-400/70">EMAIL:</span> {info.email}</p>
                                <p className="text-cyan-100"><span className="text-cyan-400/70">CONTACT:</span> {info.tel}</p>
                            </div>
                        </div>
                        <Separator className="bg-cyan-500/30" />
                        <div>
                            <h3 className="font-mono text-cyan-300 text-lg mb-4 tracking-wider">RESERVATION_DETAILS</h3>
                            <div className="space-y-3 font-mono text-sm">
                                {/* SỬA: Đổi màu chữ thành sáng hơn */}
                                <p className="text-cyan-100"><span className="text-cyan-400/70">TIMESTAMP:</span> {formatDateTime(info.reservation_date!)}</p>
                                <p className="text-cyan-100"><span className="text-cyan-400/70">PARTY_SIZE:</span> {info.party_size}</p>
                                <p className="text-cyan-100">
                                    <span className="text-cyan-400/70">TABLES:</span>{' '}
                                    {selectedTables.length > 0
                                        ? selectedTables.map(t => `TABLE_${t.so_ban}`).join(', ')
                                        : "AUTO_ASSIGN"}
                                </p>
                                <p className="text-cyan-100"><span className="text-cyan-400/70">NOTES:</span> {info.note || 'NONE'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Selected Items */}
                    <div className="space-y-6">
                        <h3 className="font-mono text-cyan-300 text-lg tracking-wider">SELECTED_ITEMS ({cart.length})</h3>
                        <ScrollArea className="h-[250px] w-full pr-4 border border-cyan-500/30 rounded-md p-4">
                            {cart.length === 0 ? (
                                <p className="font-mono text-cyan-400/70 text-center py-10">NO_ITEMS_SELECTED</p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.product_id} className="flex items-center gap-3 group">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-cyan-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <Image
                                                    src={item.hinh_anh}
                                                    alt={item.ten_san_pham}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-md object-cover h-10 w-10 relative z-10"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                {/* SỬA: Đổi màu chữ thành sáng hơn */}
                                                <h4 className="font-mono text-cyan-100 text-sm leading-none truncate">
                                                    {item.ten_san_pham} (x{item.quantity})
                                                </h4>
                                                <p className="font-mono text-cyan-400/70 text-xs">{formatCurrency(item.gia)}</p>
                                            </div>
                                            <span className="font-mono text-cyan-400 text-sm font-medium">
                                                {formatCurrency(item.gia * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                        <Separator className="bg-cyan-500/30" />
                        <div className="space-y-3">
                            <div className="flex justify-between font-mono font-medium">
                                {/* SỬA: Đổi màu chữ thành sáng hơn */}
                                <span className="text-cyan-100">SUBTOTAL</span>
                                <span className="text-cyan-400">{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between font-mono font-semibold text-lg">
                                {/* SỬA: Đổi màu chữ thành sáng hơn */}
                                <span className="text-cyan-100">DEPOSIT (30%)</span>
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
                        RETURN_TO_SELECTION
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}