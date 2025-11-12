// BlogCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/types/blog';
import { Card, CardContent } from '@/components/ui/card';

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export default function BlogCard({ blog }: { blog: Blog }) {
    const imageUrl = (blog.media_files as any)?.file_url || '/images/placeholder-post.jpg';

    return (
        <Link href={`/blog/${blog.slug}`} className="group">
            <Card className="h-full overflow-hidden bg-[#0a0a0f]/60 backdrop-blur-lg border border-cyan-500/20 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:border-cyan-300/40 hover:scale-[1.02]">
                <div className="relative overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={blog.tieu_de}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent" />
                </div>
                <CardContent className="p-4 bg-gradient-to-b from-cyan-500/5 to-transparent">
                    <p className="text-sm text-cyan-300/80 font-mono">
                        {formatDate(blog.created_at)} - {blog.nguoi_dung?.ho_ten || 'System Admin'}
                    </p>
                    <div className="mt-3 space-y-2">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500" />
                        <h3 className="text-lg font-bold leading-snug bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
                            {blog.tieu_de.length > 50 ? `${blog.tieu_de.slice(0, 50)}...` : blog.tieu_de}
                        </h3>
                        <p className="text-xs text-cyan-400/60 font-mono">Luồng dữ liệu</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}