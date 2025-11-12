// packages/client/src/app/account/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user';
import { useAuthStore } from '@/store/useAuthStore';

import ProtectedRoute from '@/components/common/ProtectedRoute';
import GlobalSpinner from '@/components/common/GlobalSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ImageUpload from '@/components/auth/ImageUpload';
import AddressSelector from '@/components/auth/AddressSelector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// --- Schemas cho Form ---
const profileSchema = z.object({
    ho_ten: z.string().min(1, "Họ tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    dien_thoai: z.string().min(1, "Số điện thoại là bắt buộc"),
    dia_chi: z.string().min(1, "Địa chỉ là bắt buộc"),
    anh_dai_dien_id: z.number().optional(),
});
type ProfileSchema = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    newPassword: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"),
}).refine(data => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới phải khác mật khẩu cũ",
    path: ["newPassword"],
});
type PasswordSchema = z.infer<typeof passwordSchema>;

// --- Component con: Tab thông tin ---
function UpdateInfoForm({ user, onProfileUpdate }: { user: User, onProfileUpdate: (data: User) => void }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            ho_ten: user.ho_ten || '',
            email: user.email || '',
            dien_thoai: user.dien_thoai || '',
            dia_chi: user.dia_chi || '',
            anh_dai_dien_id: user.anh_dai_dien_id || undefined,
        },
    });

    const mutation = useMutation({
        mutationFn: (data: ProfileSchema) => api.patch('/user/me', data),
        onSuccess: (response) => {
            toast({ title: "SYSTEM_UPDATE_SUCCESS", description: "User profile synchronized successfully." });
            queryClient.invalidateQueries({ queryKey: ['me'] });
            onProfileUpdate(response.data.data);
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "SYSTEM_ERROR", description: error.response?.data?.message || "Update failed." });
        },
    });

    const onSubmit = (data: ProfileSchema) => {
        mutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-cyan-400 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
                        <Avatar className="h-24 w-24 border-2 border-cyan-400/50 relative z-10 group-hover:border-cyan-400 group-hover:scale-105 transition-all">
                            <AvatarImage src={(user.media_files as any)?.file_url || ''} />
                            <AvatarFallback className="text-3xl bg-gradient-to-br from-cyan-400 to-purple-400 text-[#0a0a0f] font-bold">
                                {user.ho_ten.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="anh_dai_dien_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-mono text-cyan-300">Tải lên ảnh đại diện</FormLabel>
                            <FormControl>
                                <ImageUpload onImageUpload={(id) => field.onChange(id)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="ho_ten"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-mono text-cyan-300">Họ và tên</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20"
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
                                <FormLabel className="font-mono text-cyan-300">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        readOnly
                                        disabled
                                        className="bg-[#0a0a0f]/50 border-cyan-500/20 text-cyan-100/70 font-mono"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="dien_thoai"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-mono text-cyan-300">Số điện thoại</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dia_chi"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-mono text-cyan-300">Địa chỉ</FormLabel>
                            <FormControl>
                                <AddressSelector
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 font-mono tracking-wider transition-all duration-300"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "SYNC_IN_PROGRESS..." : "UPDATE_PROFILE"}
                </Button>
            </form>
        </Form>
    );
}

// --- Component con: Tab đổi mật khẩu ---
function ChangePasswordForm() {
    const { toast } = useToast();
    const form = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: PasswordSchema) => api.post('/user/change-password', data),
        onSuccess: () => {
            toast({ title: "SECURITY_UPDATE", description: "Password matrix updated successfully." });
            form.reset({ currentPassword: '', newPassword: '' });
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "SECURITY_BREACH", description: error.response?.data?.message || "Password update failed." });
        },
    });

    const onSubmit = (data: PasswordSchema) => {
        mutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-mono text-cyan-300">Mật khẩu hiện tại</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    {...field}
                                    className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-mono text-cyan-300">Mật khẩu mới</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    {...field}
                                    className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 font-mono tracking-wider transition-all duration-300"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "ENCRYPTING..." : "UPDATE_SECURITY"}
                </Button>
            </form>
        </Form>
    );
}

// --- Component chính của trang ---
function AccountPageContent() {
    const { setUser } = useAuthStore();

    const { data: user, isLoading, error } = useQuery<User>({
        queryKey: ['me'],
        queryFn: async () => {
            const response = await api.get('/user/me');
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const handleProfileUpdate = (updatedUser: User) => {
        setUser(updatedUser);
    };

    if (isLoading) return <GlobalSpinner />;
    if (error || !user) return <p className="text-cyan-100 text-center py-20">Dữ liệu người dùng không khả dụng</p>;

    return (
        <div className="w-full bg-[#0a0a0f] min-h-screen">
            {/* Hero Header */}
            <div className="w-full py-28 bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center mb-16">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-cyan-500/10"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent relative z-10">
                    CỔNG NGƯỜI DÙNG
                </h1>

                {/* Scanning line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50 animate-pulse"></div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 pb-20">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-[#0a0a0f] border border-cyan-500/30 rounded-lg p-1">
                        <TabsTrigger
                            value="profile"
                            className="font-mono text-sm tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border data-[state=active]:border-cyan-500/50 transition-all"
                        >
                            THÔNG TIN CÁ NHÂN
                        </TabsTrigger>
                        <TabsTrigger
                            value="password"
                            className="font-mono text-sm tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border data-[state=active]:border-cyan-500/50 transition-all"
                        >
                            MẬT KHẨU
                        </TabsTrigger>
                        <TabsTrigger
                            value="membership"
                            className="font-mono text-sm tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border data-[state=active]:border-cyan-500/50 transition-all"
                        >
                            THẺ THÀNH VIÊN
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card className="bg-[#0a0a0f] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                            <CardHeader className="border-b border-cyan-500/20">
                                <CardTitle className="font-mono text-2xl text-cyan-400 tracking-wider">
                                    CHỈNH SỬA THÔNG TIN CÁ NHÂN
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <UpdateInfoForm user={user} onProfileUpdate={handleProfileUpdate} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="password">
                        <Card className="bg-[#0a0a0f] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                            <CardHeader className="border-b border-cyan-500/20">
                                <CardTitle className="font-mono text-2xl text-cyan-400 tracking-wider">
                                    MẬT KHẨU
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ChangePasswordForm />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="membership">
                        <Card className="bg-[#0a0a0f] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                            <CardHeader className="border-b border-cyan-500/20">
                                <CardTitle className="font-mono text-2xl text-cyan-400 tracking-wider">
                                    THẺ THÀNH VIÊN
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30">
                                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
                                    </div>
                                    <p className="font-mono text-cyan-300/70 tracking-wider">
                                        KÍCH HOẠT HỆ THỐNG THẺ THÀNH VIÊN ĐANG CHỜ XỬ LÝ
                                    </p>
                                    <p className="font-mono text-cyan-100/50 text-sm mt-2">
                                        Hệ thống đang được phát triển
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default function AccountPage() {
    return (
        <ProtectedRoute>
            <AccountPageContent />
        </ProtectedRoute>
    );
}