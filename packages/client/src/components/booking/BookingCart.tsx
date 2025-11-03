// packages/client/src/components/booking/BookingCart.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore, CartItem } from '@/store/useBookingStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

// Hàm format tiền (lấy từ file cũ [cite: 226-228])
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
};

export default function BookingCart() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, getTotalPrice, info } = useBookingStore();

    const handleNextStep = () => {
        // Kiểm tra lại lần nữa trước khi sang bước 3
        if (!info.reservation_date || !info.party_size) {
            alert("Vui lòng quay lại Bước 1 và điền đầy đủ thông tin.");
            router.push('/booking');
            return;
        }
        router.push('/booking/confirm');
    };

    const total = getTotalPrice();

    return (
        <Card className="sticky top-24 shadow-lg">
            <CardHeader>
                <CardTitle>Đơn đặt của bạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center">
                        Bạn chưa chọn món ăn nào.
                    </p>
                ) : (
                    <>
                        <ScrollArea className="h-[300px] w-full pr-4">
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.product_id} className="flex items-center gap-3">
                                        <Image
                                            src={item.hinh_anh}
                                            alt={item.ten_san_pham}
                                            width={48}
                                            height={48}
                                            className="rounded-md object-cover h-12 w-12"
                                        />
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-sm font-medium leading-none truncate">
                                                {item.ten_san_pham}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{formatCurrency(item.gia)}</p>
                                        </div>
                                        <Input
                                            type="number"
                                            min={1}
                                            className="w-16 h-8"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 0)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground"
                                            onClick={() => removeFromCart(item.product_id)}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Tạm tính (chưa cọc)</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    size="lg"
                    className="w-full"
                    style={{ color: 'black' }}
                    onClick={handleNextStep}
                    disabled={cart.length === 0} // Chỉ cho phép tiếp tục khi đã chọn món
                >
                    Tiếp theo
                </Button>
            </CardFooter>
        </Card>
    );
}