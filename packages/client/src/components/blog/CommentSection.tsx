// packages/client/src/components/blog/CommentSection.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { BlogComment, CommentsApiResponse } from '@/types/comment';
import { User } from '@/types/user';

// Components
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';

// Hàm format thời gian (từ DetailBlog.js [cite: 147-172])
const formatCommentTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Component con: Form đăng bình luận
function CommentForm({ blogId }: { blogId: number }) {
    const [content, setContent] = useState('');
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (newComment: { blog_id: number; content: string }) => {
            // Gọi API POST /user/comments (đã có authenticateToken)
            return api.post('/user/comments', newComment);
        },
        onSuccess: () => {
            toast({ title: "Đã gửi bình luận" });
            setContent('');
            // Tải lại danh sách bình luận
            queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "Lỗi", description: error.response?.data?.message });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim().length === 0) return;
        mutation.mutate({ blog_id: blogId, content });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                placeholder="Viết bình luận của bạn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
            />
            <Button type="submit" disabled={mutation.isPending} style={{ color: 'black' }}>
                {mutation.isPending ? "Đang gửi..." : "Gửi Bình Luận"}
            </Button>
        </form>
    );
}

// Component con: Một bình luận
function CommentItem({ comment, user }: { comment: BlogComment; user: User | null }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.noi_dung);

    // Kiểm tra quyền (giống logic DetailBlog.js [cite: 317-347])
    const canModify = user?.id === comment.nguoi_dung_id;

    // Mutation Xóa
    const deleteMutation = useMutation({
        mutationFn: () => api.delete(`/user/comments/${comment.id}`), // Gọi API DELETE
        onSuccess: () => {
            toast({ title: "Đã xóa bình luận" });
            queryClient.invalidateQueries({ queryKey: ['comments', comment.bai_viet_id] });
            setIsDeleting(false);
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "Lỗi", description: error.response?.data?.message });
            setIsDeleting(false);
        }
    });

    // Mutation Sửa
    const editMutation = useMutation({
        mutationFn: (content: string) => api.patch(`/user/comments/${comment.id}`, { content }), // Gọi API PATCH
        onSuccess: () => {
            toast({ title: "Đã cập nhật bình luận" });
            queryClient.invalidateQueries({ queryKey: ['comments', comment.bai_viet_id] });
            setIsEditing(false);
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "Lỗi", description: error.response?.data?.message });
        }
    });

    return (
        <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={(comment.nguoi_dung.media_files as any)?.file_url || '/images/default-avatar.png'} />
                <AvatarFallback>{comment.nguoi_dung.ho_ten.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{comment.nguoi_dung.ho_ten}</span>
                    <span className="text-xs text-muted-foreground">
                        {formatCommentTime(comment.created_at)}
                    </span>
                </div>

                {isEditing ? (
                    // Form Sửa [cite: 350-357]
                    <div className="space-y-2 mt-1">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => editMutation.mutate(editContent)} disabled={editMutation.isPending} style={{ color: 'black' }}>
                                Lưu
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Hủy</Button>
                        </div>
                    </div>
                ) : (
                    // Hiển thị nội dung
                    <p className="text-sm mt-1">{comment.noi_dung}</p>
                )}

                {/* Nút Sửa/Xóa [cite: 326-347] */}
                {canModify && !isEditing && (
                    <div className="flex gap-2 mt-1">
                        <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground" onClick={() => setIsEditing(true)}>
                            Sửa
                        </Button>
                        <Button variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => setIsDeleting(true)}>
                            Xóa
                        </Button>
                    </div>
                )}
            </div>

            {/* Dialog Xác nhận Xóa [cite: 349-354] */}
            <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa bình luận?</DialogTitle>
                    </DialogHeader>
                    <p>Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác.</p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Hủy</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// === COMPONENT CHÍNH: Phần Bình luận ===
export default function CommentSection({ blogId }: { blogId: number }) {
    const { user } = useAuthStore();
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useQuery<CommentsApiResponse>({
        queryKey: ['comments', blogId, page],
        queryFn: async () => {
            // Gọi API GET /public/comments/blog/:blog_id
            const res = await api.get(`/public/comments/blog/${blogId}`, {
                params: { page, limit: 10 }
            });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bình luận ({data?.total || 0})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Form Đăng [cite: 366-383] */}
                {user ? (
                    <CommentForm blogId={blogId} />
                ) : (
                    <div className="text-center text-muted-foreground p-4 border rounded-md">
                        Vui lòng <Link href="/login" className="text-primary underline">đăng nhập</Link> để bình luận.
                    </div>
                )}

                <Separator />

                {/* Danh sách bình luận [cite: 279-348] */}
                <div className="space-y-6">
                    {isLoading && <p>Đang tải bình luận...</p>}
                    {error && <p className="text-destructive">Lỗi tải bình luận.</p>}

                    {data?.data.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} user={user} />
                    ))}

                    {data?.data.length === 0 && !isLoading && (
                        <p className="text-muted-foreground text-center">Chưa có bình luận nào.</p>
                    )}

                    {/* TODO: Thêm phân trang cho bình luận nếu cần */}
                </div>
            </CardContent>
        </Card>
    );
}