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
import dynamic from 'next/dynamic';
const FacebookAuth = dynamic(
    () => import('@/components/auth/FacebookAuth'),
    { ssr: false }
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
        <div className="w-full bg-[#0a0a0f] min-h-screen">
            {/* Hero Header - Cyberpunk Style */}
            <div className="w-full py-24 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2f] to-[#0a0a0f] relative overflow-hidden">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}></div>
                </div>

                {/* Glowing Effects */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                <div className="text-center text-white relative z-10">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            SYSTEM ACCESS
                        </span>
                    </h1>
                    <p className="text-cyan-300 text-lg mb-4 font-mono">NEURAL IDENTIFICATION REQUIRED</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="container mx-auto max-w-lg px-4 pb-20">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 "></div>
                    <Card className="relative bg-[#0f0f1a] border border-cyan-500/30 backdrop-blur-lg">

                        <CardHeader className="items-center text-center p-8">
                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-50"></div>
                                <Link href="/">
                                    <Image
                                        src="/images/logo.png"
                                        alt="EnViSi Logo"
                                        width={80}
                                        height={80}
                                        className="relative z-10 rounded-full border-2 border-cyan-400/50"
                                    />
                                </Link>
                            </div>
                            <CardTitle className="text-2xl font-bold text-white font-mono">
                                NEURAL SYNC PROTOCOL
                            </CardTitle>
                            <CardDescription className="text-cyan-300 font-mono text-sm mt-2">
                                Authentication sequence initiated
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            {/* Social Login */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none hidden"></div>

                                    <GoogleAuth />
                                </div>
                                <div className="group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none hidden"></div>

                                    <FacebookAuth />
                                </div>
                            </div>

                            <div className="flex items-center my-6">
                                <Separator className="flex-1 bg-cyan-500/30" />
                                <span className="mx-3 text-xs text-cyan-300 font-mono">NEURAL AUTH</span>
                                <Separator className="flex-1 bg-cyan-500/30" />
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-cyan-300 font-mono text-sm">
                                        NEURAL LINK ID
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@neural.net"
                                        className="bg-black/50 border-cyan-500/30 text-white font-mono placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-400 font-mono">{errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password" className="text-cyan-300 font-mono text-sm">
                                            ENCRYPTION KEY
                                        </Label>
                                        <Link href="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-200 font-mono transition-colors duration-300">
                                            KEY RECOVERY?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-black/50 border-cyan-500/30 text-white font-mono placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                                        {...register('password')}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-400 font-mono">{errors.password.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono font-bold py-3 px-6 rounded-lg border border-cyan-400/50 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? (
                                        <span className="flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            SYNCING...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            INITIATE SYNC
                                            <div className="ml-2 w-2 h-2 bg-cyan-400 rounded-full group-hover:animate-pulse"></div>
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-4 text-center text-sm p-8 pt-0">
                            <p className="text-cyan-200">
                                New to the network?{' '}
                                <Link href="/register" className="text-cyan-400 font-mono font-medium hover:text-cyan-200 transition-colors duration-300">
                                    REQUEST ACCESS
                                </Link>
                            </p>
                            <Link href="/policy" className="text-cyan-300/80 hover:text-cyan-200 font-mono text-xs transition-colors duration-300">
                                VIEW SYSTEM PROTOCOLS
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Cyberpunk Grid Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.15) 1px, transparent 0)`,
                    backgroundSize: '50px 50px',
                }}></div>
            </div>
        </div>
    );
}