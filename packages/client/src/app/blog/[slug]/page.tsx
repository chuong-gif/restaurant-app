// packages/client/src/app/blog/[slug]/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { Blog } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import CommentSection from '@/components/blog/CommentSection';

// Hàm format ngày
const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

// Hàm tải dữ liệu (Server-side)
async function getBlogDetail(slug: string): Promise<Blog | null> {
    try {
        const response = await api.get(`/public/blogs/slug/${slug}`);
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch blog detail:", error);
        return null;
    }
}

// Component Trang Chi Tiết
// === SỬA LỖI Ở ĐÂY: Thêm `await` vào `params` ===
export default async function BlogDetailPage({ params }: { params: { slug: string } }) {

    // Lỗi của Turbopack/Next.js 16 yêu cầu 'await' params
    // Chúng ta phải `await params` trước khi truy cập `slug`
    const { slug } = await params;
    const blog = await getBlogDetail(slug);
    // =======================================

    if (!blog) {
        return (
            <div className="container mx-auto max-w-7xl px-4 py-20 text-center">
                <h1 className="text-2xl font-semibold">404 - Không tìm thấy bài viết</h1>
            </div>
        );
    }

    const imageUrl = (blog.media_files as any)?.file_url || '/images/placeholder-post.jpg';

    return (
        <div className="w-full">
            {/* Hero Header */}
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-secondary">Chi Tiết Blog</h1>
                    <nav aria-label="breadcrumb" className="mt-2">
                        <ol className="breadcrumb justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link></li>
                            <li className="breadcrumb-item"><Link href="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Nội dung chi tiết */}
            <div className="container mx-auto max-w-4xl px-4 pb-20">
                <Card className="shadow-lg">
                    <CardContent className="p-6 md:p-10">
                        {/* Tiêu đề */}
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {blog.tieu_de}
                        </h1>
                        <p className="text-muted-foreground mb-4">
                            Ngày đăng: {formatDate(blog.created_at)}
                            {' - Tác giả: '}
                            <span className="text-primary font-medium">
                                {blog.nguoi_dung?.ho_ten || 'EnViSi Restaurant'}
                            </span>
                        </p>

                        {/* Ảnh bìa */}
                        <Image
                            src={imageUrl}
                            alt={blog.tieu_de}
                            width={800}
                            height={400}
                            className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md mb-6"
                        />

                        {/* Nội dung bài viết */}
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: blog.noi_dung,
                            }}
                        />
                    </CardContent>
                </Card>

                <Separator className="my-12" />

                {/* Phần bình luận */}
                <CommentSection blogId={blog.id} />
            </div>
        </div>
    );
}