// CommentSection.tsx
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

function CommentForm({ blogId }: { blogId: number }) {
    const [content, setContent] = useState('');
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (newComment: { blog_id: number; content: string }) => {
            return api.post('/user/comments', newComment);
        },
        onSuccess: () => {
            toast({ title: "Neural Sync Complete" });
            setContent('');
            queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "System Error", description: error.response?.data?.message });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim().length === 0) return;
        mutation.mutate({ blog_id: blogId, content });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <Textarea
                    placeholder="Initiate neural comment stream..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    className="bg-[#0a0a0f]/40 border border-cyan-500/30 text-cyan-100 placeholder-cyan-300/50 backdrop-blur-lg focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                />
                <div className="absolute bottom-2 right-2 text-xs text-cyan-400/60 font-mono">
                    {content.length}/500
                </div>
            </div>
            <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border border-cyan-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
            >
                {mutation.isPending ? "⚡ Uploading..." : "🚀 Transmit Comment"}
            </Button>
        </form>
    );
}

function CommentItem({ comment, user }: { comment: BlogComment; user: User | null }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.noi_dung);

    const canModify = user?.id === comment.nguoi_dung_id;

    const deleteMutation = useMutation({
        mutationFn: () => api.delete(`/user/comments/${comment.id}`),
        onSuccess: () => {
            toast({ title: "Data Stream Deleted" });
            queryClient.invalidateQueries({ queryKey: ['comments', comment.bai_viet_id] });
            setIsDeleting(false);
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "System Error", description: error.response?.data?.message });
            setIsDeleting(false);
        }
    });

    const editMutation = useMutation({
        mutationFn: (content: string) => api.patch(`/user/comments/${comment.id}`, { content }),
        onSuccess: () => {
            toast({ title: "Stream Updated" });
            queryClient.invalidateQueries({ queryKey: ['comments', comment.bai_viet_id] });
            setIsEditing(false);
        },
        onError: (error: any) => {
            toast({ variant: "destructive", title: "System Error", description: error.response?.data?.message });
        }
    });

    return (
        <div className="flex items-start gap-4 p-4 bg-[#0a0a0f]/40 backdrop-blur-lg border border-cyan-500/20 rounded-lg hover:border-cyan-400/30 transition-all duration-300">
            <Avatar className="h-10 w-10 border border-cyan-500/30">
                <AvatarImage src={(comment.nguoi_dung.media_files as any)?.file_url || '/images/default-avatar.png'} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-purple-600 text-white">
                    {comment.nguoi_dung.ho_ten.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-sm">{comment.nguoi_dung.ho_ten}</span>
                    <span className="text-xs text-cyan-400/60 font-mono">
                        {formatCommentTime(comment.created_at)}
                    </span>
                </div>

                {isEditing ? (
                    <div className="space-y-3 mt-2">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="bg-[#0a0a0f]/60 border border-cyan-500/30 text-cyan-100"
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => editMutation.mutate(editContent)}
                                disabled={editMutation.isPending}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/50"
                            >
                                ⚡ Save
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsEditing(false)}
                                className="text-cyan-300 hover:text-cyan-100 border border-cyan-500/30"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-cyan-100 text-sm mt-2 leading-relaxed">{comment.noi_dung}</p>
                )}

                {canModify && !isEditing && (
                    <div className="flex gap-3 mt-2">
                        <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-cyan-400 hover:text-cyan-300 font-mono text-xs"
                            onClick={() => setIsEditing(true)}
                        >
                            [EDIT STREAM]
                        </Button>
                        <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-red-400 hover:text-red-300 font-mono text-xs"
                            onClick={() => setIsDeleting(true)}
                        >
                            [DELETE NODE]
                        </Button>
                    </div>
                )}
            </div>

            <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                <DialogContent className="bg-[#0a0a0f] border border-cyan-500/30 text-cyan-100">
                    <DialogHeader>
                        <DialogTitle className="text-cyan-300 font-mono">CONFIRM DATA PURGE?</DialogTitle>
                    </DialogHeader>
                    <p className="text-cyan-200/80">This neural stream will be permanently erased from the core system.</p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost" className="text-cyan-300 border border-cyan-500/30">ABORT</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={() => deleteMutation.mutate()}
                            disabled={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-500 text-white border border-red-400/50"
                        >
                            {deleteMutation.isPending ? "PURGING..." : "CONFIRM PURGE"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function CommentSection({ blogId }: { blogId: number }) {
    const { user } = useAuthStore();
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useQuery<CommentsApiResponse>({
        queryKey: ['comments', blogId, page],
        queryFn: async () => {
            const res = await api.get(`/public/comments/blog/${blogId}`, {
                params: { page, limit: 10 }
            });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });

    return (
        <Card className="bg-[#0a0a0f]/60 backdrop-blur-lg border border-cyan-500/20 shadow-2xl">
            <CardHeader className="border-b border-cyan-500/20">
                <CardTitle className="text-cyan-300 font-mono text-xl">
                    NEURAL COMMENTS [{data?.total || 0}]
                </CardTitle>
                <p className="text-cyan-400/60 text-sm font-mono">Active thought streams detected</p>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                {user ? (
                    <CommentForm blogId={blogId} />
                ) : (
                    <div className="text-center text-cyan-300/80 p-6 border border-cyan-500/30 rounded-lg bg-[#0a0a0f]/40">
                        <p className="font-mono">SYSTEM AUTHENTICATION REQUIRED</p>
                        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 underline font-mono text-sm">
                            INITIATE LOGIN SEQUENCE
                        </Link>
                    </div>
                )}

                <Separator className="bg-cyan-500/20" />

                <div className="space-y-4">
                    {isLoading && (
                        <div className="text-center py-8">
                            <div className="animate-pulse text-cyan-400 font-mono">🌀 Loading neural streams...</div>
                        </div>
                    )}
                    {error && <p className="text-red-400 font-mono text-center">⚠️ Stream connection failed</p>}

                    {data?.data.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} user={user} />
                    ))}

                    {data?.data.length === 0 && !isLoading && (
                        <p className="text-cyan-400/60 text-center font-mono py-8">No active neural streams detected</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}