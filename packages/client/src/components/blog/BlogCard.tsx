// packages/client/src/components/blog/BlogCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/types/blog';
import { Card, CardContent } from '@/components/ui/card';

// Hàm format ngày (từ DetailBlog.js [cite: 119-126])
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
            <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                    src={imageUrl}
                    alt={blog.tieu_de}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                        {formatDate(blog.created_at)} - {blog.nguoi_dung?.ho_ten || 'Admin'}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-primary">
                        {/* Cắt ngắn tiêu đề */}
                        {blog.tieu_de.length > 50 ? `${blog.tieu_de.slice(0, 50)}...` : blog.tieu_de}
                    </h3>
                </CardContent>
            </Card>
        </Link>
    );
}