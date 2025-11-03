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

    // Lấy thông tin từ các store (chọn state cụ thể để tránh re-render không cần thiết)
    const user = useAuthStore(state => state.user);
    const info = useBookingStore(state => state.info);
    const setBookingInfo = useBookingStore(state => state.setBookingInfo);

    const form = useForm<BookingInfoSchema>({
        resolver: zodResolver(bookingInfoSchema),
        // Lấy giá trị mặc định từ store, hoặc từ user đã đăng nhập, hoặc rỗng
        defaultValues: {
            fullname: info.fullname || user?.ho_ten || "",
            email: info.email || user?.email || "",
            tel: info.tel || user?.dien_thoai || "",
            reservation_date: info.reservation_date || "",
            party_size: info.party_size || 1,
            note: info.note || "",
        },
    });

    // === SỬA LỖI VÒNG LẶP VÔ HẠN TẠI ĐÂY ===
    const { reset } = form; // Lấy hàm `reset` từ useForm

    useEffect(() => {
        // Khi `user` hoặc `info` thay đổi (ví dụ: khi user đăng nhập hoặc quay lại)
        // chúng ta "reset" form để điền giá trị mới nhất.
        // `reset` sẽ cập nhật giá trị mà không kích hoạt lại `useEffect` một cách lặp lại.
        reset({
            fullname: info.fullname || user?.ho_ten || "",
            email: info.email || user?.email || "",
            tel: info.tel || user?.dien_thoai || "",
            reservation_date: info.reservation_date || "",
            party_size: info.party_size || 1,
            note: info.note || "",
        });
    }, [user, info, reset]); // Phụ thuộc vào `user`, `info`, và `reset`
    // ======================================

    // Hàm xử lý khi nhấn "Tiếp theo"
    const onSubmit = (data: BookingInfoSchema) => {
        setBookingInfo(data); // Lưu vào store
        router.push('/booking/select'); // Chuyển sang Bước 2
    };

    // Hàm lấy thời gian tối thiểu (2 giờ sau)
    const getMinTime = () => {
        const minTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
        return minTime.toISOString().slice(0, 16);
    };

    // Hàm lấy thời gian tối đa (7 ngày sau)
    const getMaxTime = () => {
        const maxTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        return maxTime.toISOString().slice(0, 16);
    };

    return (
        <div className="row g-0 justify-content-center">
            <div className="col-md-8 col-lg-6">
                <Card className="shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-secondary text-primary">
                            Điền thông tin của bạn
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fullname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Họ và Tên *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nguyễn Văn A" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email *</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="email@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="tel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số điện thoại *</FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="090xxxxxxx" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="reservation_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Thời gian dùng bữa *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="datetime-local"
                                                        {...field}
                                                        min={getMinTime()}
                                                        max={getMaxTime()}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="party_size"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số người ăn *</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min={1} max={8} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ghi chú (Tùy chọn)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Ví dụ: Cho tôi bàn gần cửa sổ..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" size="lg" className="w-full md:w-auto" style={{ color: 'black' }}>
                                        Tiếp theo
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