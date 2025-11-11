// BookingCart.tsx
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
        if (!info.reservation_date || !info.party_size) {
            alert("SYSTEM: Complete temporal and party parameters");
            router.push('/booking');
            return;
        }
        router.push('/booking/confirm');
    };

    const total = getTotalPrice();

    return (
        <Card className="sticky top-24 bg-[#0a0a0f]/80 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <CardHeader className="border-b border-cyan-500/20 pb-4">
                <CardTitle className="text-cyan-300 font-mono text-xl flex items-center gap-2">
                    <span>🛸 ORDER MATRIX</span>
                </CardTitle>
                <p className="text-cyan-400/60 text-sm font-mono">Active resource allocation</p>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
                {cart.length === 0 ? (
                    <div className="text-center py-8 space-y-3">
                        <div className="text-6xl">🌌</div>
                        <p className="text-cyan-400/60 font-mono text-sm">
                            No resources allocated
                        </p>
                        <p className="text-cyan-300/40 text-xs font-mono">Awaiting selection protocol</p>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="h-[300px] w-full pr-4">
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={item.product_id}
                                        className="flex items-center gap-3 p-3 bg-[#0a0a0f]/60 border border-cyan-500/20 rounded-lg hover:border-cyan-400/30 transition-all duration-300"
                                    >
                                        <div className="relative">
                                            <Image
                                                src={item.hinh_anh}
                                                alt={item.ten_san_pham}
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover h-12 w-12 border border-cyan-500/30"
                                            />
                                            <div className="absolute -inset-1 bg-cyan-500/20 blur-sm rounded-md" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-sm font-bold text-cyan-100 leading-none truncate">
                                                {item.ten_san_pham}
                                            </h4>
                                            <p className="text-xs text-cyan-400/80 font-mono">{formatCurrency(item.gia)}</p>
                                        </div>
                                        <Input
                                            type="number"
                                            min={1}
                                            className="w-16 h-8 bg-[#0a0a0f] border border-cyan-500/30 text-cyan-100 text-center font-mono"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 0)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/30"
                                            onClick={() => removeFromCart(item.product_id)}
                                        >
                                            ⚡
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <Separator className="bg-cyan-500/20" />
                        <div className="space-y-2">
                            <div className="flex justify-between items-center font-mono">
                                <span className="text-cyan-300">Temporary Allocation</span>
                                <span className="text-cyan-400 font-bold">{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-cyan-400/60 font-mono">
                                <span>Deposit protocol pending</span>
                                <span>SYSTEM ONLINE</span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter className="p-4 border-t border-cyan-500/20">
                <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border border-cyan-400/50 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleNextStep}
                    disabled={cart.length === 0}
                >
                    {cart.length === 0 ? "AWAITING SELECTION" : "⚡ INITIATE CONFIRMATION"}
                </Button>
            </CardFooter>
        </Card>
    );
}