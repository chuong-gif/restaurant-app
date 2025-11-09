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
import { Mail, Phone, MapPin } from 'lucide-react'; // Dùng icons

export default function ContactPage() {
    const { toast } = useToast();

    const form = useForm<ContactSchema>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", subject: "", message: "" },
    });

    const mutation = useMutation({
        mutationFn: (data: ContactSchema) => {
            // Gọi API đã thêm ở Bước 1
            return api.post('/public/contact', data);
        },
        onSuccess: () => {
            toast({
                title: "Gửi thành công!",
                description: "Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm nhất.",
            });
            form.reset(); // Xóa form
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
        <div className="w-full">
            {/* Hero Header [cite: 31-44] */}
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-secondary">Liên hệ</h1>
                    <nav aria-label="breadcrumb" className="mt-2">
                        <ol className="breadcrumb justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Liên hệ</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content [cite: 46-170] */}
            <div className="container mx-auto max-w-7xl px-4 py-20">
                <div className="text-center mb-12">
                    <h5 className="font-secondary text-2xl text-primary">Liên hệ</h5>
                    <h2 className="text-4xl font-semibold">Giải đáp mọi thắc mắc</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Thông tin [cite: 66-93] */}
                    <div className="text-center">
                        <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                        <h5 className="font-semibold text-lg">Email Đặt chỗ</h5>
                        <p className="text-muted-foreground">contact.envisi@gmail.com</p>
                    </div>
                    <div className="text-center">
                        <Phone className="h-10 w-10 text-primary mx-auto mb-3" />
                        <h5 className="font-semibold text-lg">Thông tin chung</h5>
                        <p className="text-muted-foreground">0123.546.789</p>
                    </div>
                    <div className="text-center">
                        <MapPin className="h-10 w-10 text-primary mx-auto mb-3" />
                        <h5 className="font-semibold text-lg">Địa chỉ</h5>
                        <p className="text-muted-foreground">Phường Quả Đất, Hệ Mặt Trời</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Map [cite: 94-103] */}
                    <div>
                        <iframe
                            className="position-relative rounded w-full h-full"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d632.7442715516379!2d108.44688611960565!3d11.953717782614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317112de9c495ceb%3A0xf9529f90e31d11ef!2zMjBiIEtodSDEkOG7k2kgVHLDoCwgUGjGsOG7nW5nIDgsIMSQw6AgTOG6oXQsIEzDom0gxJDhu5NuZywgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1762695368887!5m2!1svi!2s"
                            frameBorder="0"
                            style={{ minHeight: "450px", border: 0 }}
                            allowFullScreen={false}
                            aria-hidden="false"
                            tabIndex={0}
                        ></iframe>
                    </div>

                    {/* Form [cite: 104-164] */}
                    <div>
                        <Card>
                            <CardContent className="p-6">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Tên của bạn</FormLabel>
                                                        <FormControl><Input placeholder="Nguyễn Văn A" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl>
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
                                                    <FormLabel>Chủ đề</FormLabel>
                                                    <FormControl><Input placeholder="Về việc..." {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tin nhắn</FormLabel>
                                                    <FormControl><Textarea placeholder="Tin nhắn của bạn..." rows={5} {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={mutation.isPending} style={{ color: 'black' }}>
                                            {mutation.isPending ? "Đang gửi..." : "Gửi tin nhắn"}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}