// packages/client/src/app/booking/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookingInfoSchema, bookingInfoSchema } from '@/lib/validation/booking.schema';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/store/useAuthStore';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BookingInfoPage() {
    const router = useRouter();

    const user = useAuthStore(state => state.user);
    const info = useBookingStore(state => state.info);
    const setBookingInfo = useBookingStore(state => state.setBookingInfo);

    const form = useForm<BookingInfoSchema>({
        resolver: zodResolver(bookingInfoSchema),
        defaultValues: {
            fullname: info.fullname || user?.ho_ten || "",
            email: info.email || user?.email || "",
            tel: info.tel || user?.dien_thoai || "",
            reservation_date: info.reservation_date || "",
            party_size: info.party_size || 1,
            note: info.note || "",
        },
    });

    const { reset } = form;

    useEffect(() => {
        reset({
            fullname: info.fullname || user?.ho_ten || "",
            email: info.email || user?.email || "",
            tel: info.tel || user?.dien_thoai || "",
            reservation_date: info.reservation_date || "",
            party_size: info.party_size || 1,
            note: info.note || "",
        });
    }, [user, info, reset]);

    const onSubmit = (data: BookingInfoSchema) => {
        setBookingInfo(data);
        router.push('/booking/select');
    };

    const getMinTime = () => {
        const minTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
        return minTime.toISOString().slice(0, 16);
    };

    const getMaxTime = () => {
        const maxTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        return maxTime.toISOString().slice(0, 16);
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-2xl">
                <Card className="bg-[#0a0a0f] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                    <CardHeader className="border-b border-cyan-500/20">
                        <CardTitle className="text-center text-2xl font-mono text-cyan-400 tracking-wider">
                            Nhập dữ liệu người dùng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fullname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-mono text-cyan-300 text-sm tracking-wider">HỌ VÀ TÊN</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ENTER_USER_IDENTIFIER"
                                                        {...field}
                                                        className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all"
                                                    />
                                                </FormControl>
                                                <FormMessage className="font-mono text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-mono text-cyan-300 text-sm tracking-wider">Giao thức email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="USER@DOMAIN.COM"
                                                        {...field}
                                                        className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all"
                                                    />
                                                </FormControl>
                                                <FormMessage className="font-mono text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="tel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-mono text-cyan-300 text-sm tracking-wider">Kênh liên lạc</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="COMMUNICATION_FREQUENCY"
                                                    {...field}
                                                    className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all"
                                                />
                                            </FormControl>
                                            <FormMessage className="font-mono text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="reservation_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-mono text-cyan-300 text-sm tracking-wider">Khung giờ</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="datetime-local"
                                                        {...field}
                                                        min={getMinTime()}
                                                        max={getMaxTime()}
                                                        className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all"
                                                    />
                                                </FormControl>
                                                <FormMessage className="font-mono text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="party_size"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-mono text-cyan-300 text-sm tracking-wider">SỐ LƯỢNG KHÁCH</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={50}
                                                        {...field}
                                                        className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all"
                                                    />
                                                </FormControl>
                                                <FormMessage className="font-mono text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-mono text-cyan-300 text-sm tracking-wider">HƯỚNG DẪN BỔ SUNG</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="SPECIAL_REQUIREMENTS_OR_NOTES..."
                                                    {...field}
                                                    className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 min-h-[100px] transition-all"
                                                />
                                            </FormControl>
                                            <FormMessage className="font-mono text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end pt-6">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 font-mono tracking-wider transition-all duration-300"
                                    >
                                        Tiếp tục để chọn
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}