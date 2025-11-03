'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import api, { AUTH_ENDPOINTS } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { loginSchema, LoginSchema } from '@/lib/validation/auth.schema';
import { AuthResponse } from '@/types/user';
import { AxiosError } from 'axios';
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import GoogleAuth from '@/components/auth/GoogleAuth';
// import FacebookAuth from '@/components/auth/FacebookAuth';
import dynamic from 'next/dynamic';
const FacebookAuth = dynamic(
    () => import('@/components/auth/FacebookAuth'),
    { ssr: false } // Chỉ render ở client
);


export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { setUserToken } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const mutation = useMutation<AuthResponse, AxiosError<{ message: string }>, LoginSchema>({
        mutationFn: async (data) => {
            const response = await api.post(AUTH_ENDPOINTS.LOGIN, data);
            return response.data;
        },
        onSuccess: (data) => {
            setUserToken(data.user, data.accessToken);
            router.push('/');
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Đăng nhập thất bại",
                description: error.response?.data?.message || "Email hoặc mật khẩu không đúng.",
            });
        },
    });

    const onSubmit = (data: LoginSchema) => {
        mutation.mutate(data);
    };

    return (
        <div className="w-full">
            {/* Hero Header */}
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                <h1 className="text-4xl font-secondary text-white">Đăng Nhập</h1>
            </div>

            {/* Form Card */}
            <div className="container mx-auto max-w-lg px-4 pb-12">
                <Card className="w-full">
                    <CardHeader className="items-center text-center">
                        <Link href="/">
                            <Image
                                src="/images/logo.png"
                                alt="EnViSi Logo"
                                width={80}
                                height={80}
                            />
                        </Link>
                        <CardTitle>Chào mừng trở lại</CardTitle>
                        <CardDescription>Đăng nhập để đặt bàn và xem ưu đãi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <GoogleAuth />
                            <FacebookAuth />
                        </div>

                        <div className="flex items-center my-4">
                            <Separator className="flex-1" />
                            <span className="mx-3 text-xs text-muted-foreground">HOẶC</span>
                            <Separator className="flex-1" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    {/* === SỬA LỖI TẠI ĐÂY (Xóa legacyBehavior và <a>) === */}
                                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                        Quên mật khẩu?
                                    </Link>
                                    {/* ============================================ */}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={mutation.isPending} style={{ color: 'black' }}>
                                {mutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-center text-sm">
                        <p>
                            Bạn chưa có tài khoản?{' '}
                            <Link href="/register" className="text-primary font-medium hover:underline">
                                Đăng ký ngay
                            </Link>
                        </p>
                        <Link href="/policy" className="text-muted-foreground hover:underline">
                            Xem chính sách của nhà hàng
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}