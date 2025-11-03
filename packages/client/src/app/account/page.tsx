// packages/client/src/app/account/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user'; // Import kiểu User
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
    anh_dai_dien_id: z.number().optional(), // Lưu ID của ảnh
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

    // Mutation cập nhật profile
    const mutation = useMutation({
        mutationFn: (data: ProfileSchema) => api.patch('/user/me', data),
        onSuccess: (response) => {
            toast({ title: "Thành công", description: "Cập nhật thông tin thành công." });
            // Cập nhật lại cache của 'me'
            queryClient.invalidateQueries({ queryKey: ['me'] });
            // Cập nhật state toàn cục
            onProfileUpdate(response.data.data);
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "Lỗi", description: error.response?.data?.message || "Cập nhật thất bại." });
        },
    });

    const onSubmit = (data: ProfileSchema) => {
        mutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                        <AvatarImage src={(user.media_files as any)?.file_url || ''} />
                        <AvatarFallback className="text-3xl bg-muted">
                            {user.ho_ten.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <FormField
                    control={form.control}
                    name="anh_dai_dien_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thay đổi ảnh đại diện</FormLabel>
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
                                <FormLabel>Họ và Tên</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email (Không thể thay đổi)</FormLabel>
                                <FormControl><Input {...field} readOnly disabled /></FormControl>
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
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dia_chi"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Địa chỉ</FormLabel>
                            <FormControl>
                                <AddressSelector value={field.value || ''} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending} style={{ color: 'black' }}>
                    {mutation.isPending ? "Đang cập nhật..." : "Lưu thay đổi"}
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
            toast({ title: "Thành công", description: "Đổi mật khẩu thành công." });
            form.reset({ currentPassword: '', newPassword: '' });
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "Lỗi", description: error.response?.data?.message || "Đổi mật khẩu thất bại." });
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
                            <FormLabel>Mật khẩu cũ</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu mới</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending} style={{ color: 'black' }}>
                    {mutation.isPending ? "Đang đổi..." : "Đổi mật khẩu"}
                </Button>
            </form>
        </Form>
    );
}

// --- Component chính của trang ---
function AccountPageContent() {
    const { setUser } = useAuthStore();

    // 1. Fetch thông tin "me"
    const { data: user, isLoading, error } = useQuery<User>({
        queryKey: ['me'],
        queryFn: async () => {
            const response = await api.get('/user/me');
            return response.data; // Server trả về thông tin user
        },
        staleTime: 1000 * 60 * 5, // Cache 5 phút
    });

    // 2. Xử lý logic cập nhật state toàn cục
    const handleProfileUpdate = (updatedUser: User) => {
        // Cập nhật Zustand (và localStorage)
        setUser(updatedUser);
    };

    if (isLoading) return <GlobalSpinner />;
    if (error || !user) return <p>Không thể tải thông tin tài khoản.</p>;

    return (
        <div className="w-full">
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                <h1 className="text-4xl font-secondary text-white">Tài khoản của tôi</h1>
            </div>

            <div className="container mx-auto max-w-4xl px-4 pb-12">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                        <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
                        <TabsTrigger value="membership">Thẻ thành viên</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader><CardTitle>Cập nhật thông tin</CardTitle></CardHeader>
                            <CardContent>
                                <UpdateInfoForm user={user} onProfileUpdate={handleProfileUpdate} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="password">
                        <Card>
                            <CardHeader><CardTitle>Đổi mật khẩu</CardTitle></CardHeader>
                            <CardContent>
                                <ChangePasswordForm />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="membership">
                        <Card>
                            <CardHeader><CardTitle>Thẻ thành viên</CardTitle></CardHeader>
                            <CardContent>
                                {/* Logic thẻ thành viên (từ Account.js [cite: 83-113]) sẽ được thêm vào đây sau */}
                                <p>Chức năng thẻ thành viên đang được phát triển.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// Bọc component chính bằng ProtectedRoute
export default function AccountPage() {
    return (
        <ProtectedRoute>
            <AccountPageContent />
        </ProtectedRoute>
    );
}