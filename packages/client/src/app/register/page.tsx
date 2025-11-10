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
            return api.post(AUTH_ENDPOINTS.REGISTER, data);
        },
        onSuccess: () => {
            toast({
                title: "SYSTEM ACCESS GRANTED!",
                description: "NEURAL PROFILE CREATED. REDIRECTING TO AUTHENTICATION...",
            });
            router.push('/login');
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "SYSTEM ACCESS DENIED",
                description: error.message || "NEURAL IDENTIFICATION CONFLICT DETECTED.",
            });
        },
    });

    const onSubmit = (data: RegisterSchema) => {
        const { confirmPassword, ...apiData } = data;
        mutation.mutate(apiData);
    };

    return (
        <div className="w-full bg-[#0a0a0f] min-h-screen">
            {/* Hero Header - Cyberpunk Style */}
            <div className="w-full py-24 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2f] to-[#0a0a0f] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}></div>
                </div>

                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none"></div>

                <div className="text-center text-white relative z-10">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            NEURAL PROFILE CREATION
                        </span>
                    </h1>
                    <p className="text-cyan-300 text-lg mb-4 font-mono">SYSTEM ACCESS REQUEST</p>
                </div>
            </div>

            <div className="container mx-auto max-w-3xl px-4 pb-20">
                <div className="relative group z-20">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
                    <Card className="relative z-30 bg-[#0f0f1a] border border-cyan-500/30 backdrop-blur-lg">
                        <CardHeader className="items-center text-center p-8">
                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-50 pointer-events-none"></div>
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
                            <CardTitle className="text-2xl font-mono text-cyan-400">
                                CREATE NEURAL PROFILE
                            </CardTitle>
                            <CardDescription className="text-cyan-300 font-mono mt-2">
                                ALL FIELDS REQUIRED FOR SYSTEM INTEGRATION
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="fullname"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-mono text-cyan-300 text-sm">NEURAL IDENTIFICATION</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="font-mono bg-black/50 border-cyan-500/30 text-white placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                                                            placeholder="ENTER FULL DESIGNATION"
                                                            {...field}
                                                        />
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
                                                    <FormLabel className="font-mono text-cyan-300 text-sm">NEURAL LINK</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            className="font-mono bg-black/50 border-cyan-500/30 text-white placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                                                            placeholder="user@neural.net"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="tel"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-mono text-cyan-300 text-sm">COMMUNICATION PROTOCOL</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="font-mono bg-black/50 border-cyan-500/30 text-white placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                                                            placeholder="COMM-LINK ID"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-mono text-cyan-300 text-sm">ENCRYPTION KEY</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            className="font-mono bg-black/50 border-cyan-500/30 text-white placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                                                            placeholder="••••••••"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-mono text-cyan-300 text-sm">KEY VERIFICATION</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            className="font-mono bg-black/50 border-cyan-500/30 text-white placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                                                            placeholder="••••••••"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                        <FormField
                                            control={form.control}
                                            name="anh_dai_dien_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-mono text-cyan-300 text-sm">NEURAL AVATAR (OPTIONAL)</FormLabel>
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
                                                    <FormLabel className="font-mono text-cyan-300 text-sm">LOCATION DATA</FormLabel>
                                                    <FormControl>
                                                        <AddressSelector
                                                            value={field.value || ''}
                                                            onChange={(addr) => field.onChange(addr)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full font-mono bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border border-cyan-400/50 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        disabled={mutation.isPending}
                                    >
                                        {mutation.isPending ? (
                                            <span className="flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                INITIALIZING PROFILE...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                ACTIVATE NEURAL PROFILE
                                                <div className="ml-2 w-2 h-2 bg-cyan-400 rounded-full group-hover:animate-pulse"></div>
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 text-center text-sm p-8 pt-0">
                            <p className="text-cyan-200 font-mono">
                                EXISTING NEURAL PROFILE DETECTED?{' '}
                                <Link href="/login" className="text-cyan-400 font-bold hover:text-cyan-200 transition-colors duration-300">
                                    INITIATE SYNC PROTOCOL
                                </Link>
                            </p>
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