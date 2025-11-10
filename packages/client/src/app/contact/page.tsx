// packages/client/src/app/contact/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ContactSchema, contactSchema } from '@/lib/validation/contact.schema';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    const { toast } = useToast();

    const form = useForm<ContactSchema>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", subject: "", message: "" },
    });

    const mutation = useMutation({
        mutationFn: (data: ContactSchema) => {
            return api.post('/public/contact', data);
        },
        onSuccess: () => {
            toast({
                title: "Gửi thành công!",
                description: "Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm nhất.",
            });
            form.reset();
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Gửi thất bại",
                description: error.response?.data?.message || "Đã có lỗi xảy ra.",
            });
        }
    });

    const onSubmit = (data: ContactSchema) => {
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
                            LIÊN HỆ
                        </span>
                    </h1>
                    <p className="text-cyan-300 text-lg mb-4 font-mono">SYSTEM CORE ONLINE</p>
                    <nav aria-label="breadcrumb" className="mt-2">
                        <ol className="flex justify-center items-center space-x-2 text-sm uppercase font-mono">
                            <li className="flex items-center">
                                <Link href="/" className="text-cyan-300 hover:text-cyan-100 transition-colors duration-300 hover:glow-text-cyan">
                                    TRANG CHỦ
                                </Link>
                                <span className="mx-2 text-cyan-500">/</span>
                            </li>
                            <li className="text-cyan-100 font-semibold">LIÊN HỆ</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-7xl px-4 py-20">
                {/* Header Section */}
                <div className="text-center mb-16 relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                    <h5 className="font-mono text-lg text-cyan-400 mb-2 tracking-wider">NEURAL INTERFACE</h5>
                    <h2 className="text-5xl font-bold text-white mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            KẾT NỐI HỆ THỐNG
                        </span>
                    </h2>
                    <p className="text-cyan-200 text-lg max-w-2xl mx-auto font-mono">
                        Direct neural link established. All communication channels secure.
                    </p>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Email */}
                    <div className="text-center group">
                        <div className="relative inline-block mb-4">
                            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-50"></div>
                            <Mail className="h-12 w-12 text-cyan-400 relative z-10 mx-auto group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h5 className="font-semibold text-lg text-white mb-2 font-mono">EMAIL ĐẶT CHỖ</h5>
                        <p className="text-cyan-300 font-mono text-sm group-hover:text-cyan-200 transition-colors duration-300">
                            contact.envisi@gmail.com
                        </p>
                    </div>

                    {/* Phone */}
                    <div className="text-center group">
                        <div className="relative inline-block mb-4">
                            <div className="absolute inset-0 bg-purple-500 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-50"></div>
                            <Phone className="h-12 w-12 text-purple-400 relative z-10 mx-auto group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h5 className="font-semibold text-lg text-white mb-2 font-mono">THÔNG TIN CHUNG</h5>
                        <p className="text-purple-300 font-mono text-sm group-hover:text-purple-200 transition-colors duration-300">
                            0123.546.789
                        </p>
                    </div>

                    {/* Address */}
                    <div className="text-center group">
                        <div className="relative inline-block mb-4">
                            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-50"></div>
                            <MapPin className="h-12 w-12 text-cyan-400 relative z-10 mx-auto group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h5 className="font-semibold text-lg text-white mb-2 font-mono">ĐỊA CHỈ</h5>
                        <p className="text-cyan-300 font-mono text-sm group-hover:text-cyan-200 transition-colors duration-300">
                            Phường Quả Đất, Hệ Mặt Trời
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Map */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-[#0f0f1a] rounded-xl p-1 h-full">
                            <iframe
                                className="w-full h-[450px] rounded-lg border border-cyan-500/30"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d632.7442715516379!2d108.44688611960565!3d11.953717782614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317112de9c495ceb%3A0xf9529f90e31d11ef!2zMjBiIEtodSDEkOG7k2kgVHLDoCwgUGjGsOG7nW5nIDgsIMSQw6AgTOG6oXQsIEzDom0gxJDhu5NuZywgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1762695368887!5m2!1svi!2s"
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                aria-hidden="false"
                                tabIndex={0}
                            />
                            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-cyan-500/50">
                                <p className="text-cyan-400 font-mono text-sm">COORDINATES SYNCED</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                        <Card className="relative bg-[#0f0f1a] border border-cyan-500/30 backdrop-blur-lg">
                            <CardContent className="p-8">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2 font-mono">
                                        NEURAL MESSAGE TRANSMITTER
                                    </h3>
                                    <p className="text-cyan-300 text-sm font-mono">
                                        Secure channel established. Ready for transmission.
                                    </p>
                                </div>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-cyan-300 font-mono text-sm">
                                                            IDENTIFICATION
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="bg-black/50 border-cyan-500/30 text-white font-mono placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                                                                placeholder="Nguyễn Văn A"
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
                                                        <FormLabel className="text-cyan-300 font-mono text-sm">
                                                            NEURAL LINK
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                className="bg-black/50 border-cyan-500/30 text-white font-mono placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                                                                placeholder="email@example.com"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-cyan-300 font-mono text-sm">
                                                        TRANSMISSION PROTOCOL
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="bg-black/50 border-cyan-500/30 text-white font-mono placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                                                            placeholder="Về việc..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-cyan-300 font-mono text-sm">
                                                        MESSAGE DATA STREAM
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            className="bg-black/50 border-cyan-500/30 text-white font-mono placeholder-cyan-900 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 resize-none"
                                                            placeholder="Initiating neural data stream..."
                                                            rows={5}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono font-bold py-3 px-6 rounded-lg border border-cyan-400/50 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                                            disabled={mutation.isPending}
                                        >
                                            {mutation.isPending ? (
                                                <span className="flex items-center justify-center">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    TRANSMITTING...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center">
                                                    INITIATE TRANSMISSION
                                                    <div className="ml-2 w-2 h-2 bg-cyan-400 rounded-full group-hover:animate-pulse"></div>
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
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