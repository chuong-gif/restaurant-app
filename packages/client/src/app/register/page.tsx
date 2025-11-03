'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import api, { AUTH_ENDPOINTS } from '@/lib/api';
import { registerSchema, RegisterSchema } from '@/lib/validation/auth.schema';
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// --- IMPORT COMPONENT THẬT ---
import ImageUpload from '@/components/auth/ImageUpload';
import AddressSelector from '@/components/auth/AddressSelector';

type RegisterApiData = Omit<RegisterSchema, 'confirmPassword'>;

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullname: "",
            email: "",
            tel: "",
            password: "",
            confirmPassword: "",
            address: "",
            anh_dai_dien_id: undefined,
        },
    });

    const mutation = useMutation<any, Error, RegisterApiData>({
        mutationFn: (data) => {
            // Logic từ Register.js [cite: 66-79]
            // TODO: Cần thêm logic checkEmailExists (tôi sẽ thêm sau)
            return api.post(AUTH_ENDPOINTS.REGISTER, data);
        },
        onSuccess: () => {
            toast({
                title: "Đăng ký thành công!",
                description: "Bạn sẽ được chuyển đến trang đăng nhập.",
            });
            router.push('/login'); // [cite: 92]
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Đăng ký thất bại",
                description: error.message || "Email có thể đã tồn tại.", // [cite: 70-74]
            });
        },
    });

    const onSubmit = (data: RegisterSchema) => {
        // [cite: 83-97]
        const { confirmPassword, ...apiData } = data;
        mutation.mutate(apiData);
    };

    return (
        <div className="w-full">
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                <h1 className="text-4xl font-secondary text-white">Đăng Ký Thành Viên</h1>
            </div>

            <div className="container mx-auto max-w-3xl px-4 pb-12">
                <Card className="w-full">
                    <CardHeader className="items-center text-center">
                        <Link href="/">
                            <Image
                                src="/images/logo.png" // [cite: 109-115]
                                alt="EnViSi Logo"
                                width={80}
                                height={80}
                            />
                        </Link>
                        <CardTitle>Tạo tài khoản mới</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Họ tên */}
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
                                    {/* Email */}
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
                                    {/* Số điện thoại */}
                                    <FormField
                                        control={form.control}
                                        name="tel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số điện thoại *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="090xxxxxxx" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Mật khẩu */}
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mật khẩu *</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Xác nhận Mật khẩu */}
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Xác nhận mật khẩu *</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* --- DÙNG COMPONENT THẬT --- */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <FormField
                                        control={form.control}
                                        name="anh_dai_dien_id" // <-- SỬA TÊN FIELD
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ảnh đại diện (Tùy chọn)</FormLabel>
                                                <FormControl>
                                                    <ImageUpload
                                                        onImageUpload={(id) => field.onChange(id)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Địa chỉ *</FormLabel>
                                                <FormControl>
                                                    <AddressSelector
                                                        value={field.value || ''} // Thêm || '' để xử lý giá trị undefined
                                                        onChange={(addr) => field.onChange(addr)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* ------------------------- */}

                                <Button type="submit" className="w-full" disabled={mutation.isPending} style={{ color: 'black' }}>
                                    {mutation.isPending ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-center text-sm">
                        <p>
                            Bạn đã có tài khoản?{' '}
                            {/* === SỬA LẠI CODE Ở ĐÂY === */}
                            <Link href="/login" className="text-primary font-medium hover:underline">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}