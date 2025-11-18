// packages/client/src/app/blog/[slug]/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { Blog } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import CommentSection from '@/components/blog/CommentSection';

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

async function getBlogDetail(slug: string): Promise<Blog | null> {
    try {
        const response = await api.get(`/public/blogs/slug/${slug}`);
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch blog detail:", error);
        return null;
    }
}
const cleanContent = (htmlContent: string) => {
    if (!htmlContent) return "";
    // Loại bỏ style color: black hoặc #000
    let clean = htmlContent.replace(/color:\s*(black|#000000|rgb\(0,\s*0,\s*0\));?/gi, "");
    // Loại bỏ background-color: white (nếu có)
    clean = clean.replace(/background-color:\s*(white|#ffffff|rgb\(255,\s*255,\s*255\));?/gi, "");
    return clean;
};


export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const blog = await getBlogDetail(slug);

    if (!blog) {
        return (
            <div className="container mx-auto max-w-7xl px-4 py-20 text-center bg-[#0a0a0f] min-h-screen">
                <h1 className="text-2xl font-semibold text-cyan-100">404 - Không tìm thấy luồng dữ liệu</h1>
            </div>
        );
    }

    const imageUrl = (blog.media_files as any)?.file_url || '/images/placeholder-post.jpg';

    return (
        <div className="w-full bg-[#0a0a0f] min-h-screen">
            {/* Hero Header */}
            <div className="w-full py-28 bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center mb-16">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-cyan-500/10"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

                <div className="text-center text-white relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                        LUỒNG DỮ LIỆU
                    </h1>
                    <nav aria-label="breadcrumb" className="mt-4">
                        <ol className="flex justify-center items-center space-x-4 font-mono text-sm tracking-wider">
                            <li className="flex items-center">
                                <Link href="/" className="text-cyan-300/70 hover:text-cyan-400 transition-colors hover:tracking-widest">
                                    TRANG CHỦ
                                </Link>
                                <span className="mx-2 text-cyan-400/50">/</span>
                            </li>
                            <li className="flex items-center">
                                <Link href="/blog" className="text-cyan-300/70 hover:text-cyan-400 transition-colors hover:tracking-widest">
                                    LUỒNG DỮ LIỆU
                                </Link>
                                <span className="mx-2 text-cyan-400/50">/</span>
                            </li>
                            <li className="text-cyan-400 font-semibold" aria-current="page">
                                PHÂN TÍCH LUỒNG DỮ LIỆU
                            </li>
                        </ol>
                    </nav>
                </div>

                {/* Scanning line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50 animate-pulse"></div>
            </div>

            {/* Nội dung chi tiết */}
            <div className="container mx-auto max-w-4xl px-4 pb-20">
                <Card className="bg-[#0a0a0f] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-6 md:p-10">
                        {/* Tiêu đề */}
                        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-100 leading-tight">
                            {blog.tieu_de}
                        </h1>
                        <div className="flex items-center space-x-4 mb-8 font-mono text-sm">
                            <span className="text-cyan-400/70 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                                THỜI GIAN: {formatDate(blog.created_at)}
                            </span>
                            <span className="text-purple-400/70 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                                TÁC GIẢ: {blog.nguoi_dung?.ho_ten || 'ENVISI_CORE'}
                            </span>
                        </div>

                        {/* Ảnh bìa */}
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm group-hover:blur-0"></div>
                            <Image
                                src={imageUrl}
                                alt={blog.tieu_de}
                                width={800}
                                height={400}
                                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-2xl shadow-cyan-500/20 border border-cyan-500/30 relative z-10 group-hover:border-cyan-400/50 transition-all duration-500"
                            />
                        </div>

                        {/* Nội dung bài viết */}
                        <div
                            className="prose prose-lg max-w-none prose-invert 
                            prose-headings:text-cyan-100 
                            prose-p:text-cyan-200/80 
                            prose-strong:text-cyan-300 
                            prose-a:text-cyan-400 hover:prose-a:text-cyan-300 
                            prose-code:text-purple-300 
                            prose-pre:bg-[#0a0a0f] prose-pre:border prose-pre:border-cyan-500/30
                            
                            /* Thêm class này để ép màu chữ các thẻ con về màu sáng */
                            [&_span]:!text-cyan-100/90 
                            [&_p]:!text-cyan-200/80
                            [&_li]:!text-cyan-200/80"

                            dangerouslySetInnerHTML={{
                                // Dùng hàm cleanContent bọc nội dung lại
                                __html: cleanContent(blog.noi_dung),
                            }}
                        />
                    </CardContent>
                </Card>

                <Separator className="my-12 bg-cyan-500/30" />

                {/* Phần bình luận */}
                <CommentSection blogId={blog.id} />
            </div>
        </div>
    );
}