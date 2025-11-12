// packages/client/src/app/blog/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';

import { Blog, BlogsApiResponse } from '@/types/blog';
import { BlogCategory, BlogCategoriesApiResponse } from '@/types/blog';

import GlobalSpinner from '@/components/common/GlobalSpinner';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

// === COMPONENT CON: Sidebar ===
function BlogSidebar({
    onSelectCategory,
    onSearch,
}: {
    onSelectCategory: (id: number | null) => void;
    onSearch: (term: string) => void;
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: categories, isLoading: isLoadingCategories } = useQuery<BlogCategoriesApiResponse>({
        queryKey: ['blogCategories'],
        queryFn: async () => api.get('/public/blog-categories').then(res => res.data),
        staleTime: 1000 * 60 * 60,
    });

    const { data: recentPosts, isLoading: isLoadingRecent } = useQuery<BlogsApiResponse>({
        queryKey: ['recentBlogs'],
        queryFn: async () => api.get('/public/blogs', { params: { page: 1, limit: 5 } }).then(res => res.data),
        staleTime: 1000 * 60 * 5,
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="sticky top-24 space-y-8">
            {/* Tìm kiếm */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                <h3 className="font-mono text-cyan-400 text-lg tracking-wider mb-4">Ma trận tìm kiếm</h3>
                <form onSubmit={handleSearchSubmit}>
                    <Input
                        placeholder="INPUT_SEARCH_QUERY..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20"
                    />
                </form>
            </div>

            {/* Danh mục */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                <h3 className="font-mono text-cyan-400 text-lg tracking-wider mb-4">Danh mục</h3>
                <div className="flex flex-col space-y-3">
                    <Button
                        variant="ghost"
                        className="justify-start font-mono text-cyan-300/70 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                        onClick={() => onSelectCategory(null)}
                    >
                        TẤT CẢ BÀI VIẾT
                    </Button>
                    {isLoadingCategories ? (
                        <p className="font-mono text-cyan-400/50">ĐANG TẢI DANH MỤC...</p>
                    ) : (
                        categories?.data.map((cat: BlogCategory) => (
                            <Button
                                key={cat.id}
                                variant="ghost"
                                className="justify-start font-mono text-cyan-300/70 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                                onClick={() => onSelectCategory(cat.id)}
                            >
                                {cat.ten_danh_muc.toUpperCase()}
                            </Button>
                        ))
                    )}
                </div>
            </div>

            {/* Bài viết mới */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                <h3 className="font-mono text-cyan-400 text-lg tracking-wider mb-4">CẬP NHẬT GẦN ĐÂY</h3>
                <div className="space-y-4">
                    {isLoadingRecent ? (
                        <p className="font-mono text-cyan-400/50">ĐANG TẢI BÀI VIẾT...</p>
                    ) : (
                        recentPosts?.data.map((post: Blog) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="flex items-center gap-4 group p-3 rounded-lg hover:bg-cyan-500/10 transition-all">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <Image
                                        src={(post.media_files as any)?.file_url || '/images/placeholder-post.jpg'}
                                        alt={post.tieu_de}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 object-cover rounded-md border border-cyan-500/30 relative z-10 group-hover:border-cyan-400/50 transition-all"
                                    />
                                </div>
                                <h4 className="text-sm font-medium text-cyan-200/80 group-hover:text-cyan-400 leading-snug font-mono transition-colors flex-1">
                                    {post.tieu_de.length > 50 ? `${post.tieu_de.slice(0, 50)}...` : post.tieu_de}
                                </h4>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// ================== COMPONENT TRANG CHÍNH ==================
export default function BlogPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

    const { data, isLoading, error } = useQuery<BlogsApiResponse>({
        queryKey: ['blogs', currentPage, selectedCategoryId, searchTerm],
        queryFn: async () => {
            const res = await api.get('/public/blogs', {
                params: {
                    page: currentPage,
                    limit: 9,
                    danh_muc_id: selectedCategoryId || undefined,
                    search: searchTerm || undefined,
                },
            });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });

    const handleSelectCategory = (id: number | null) => {
        setSelectedCategoryId(id);
        setCurrentPage(1);
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const totalPages = data?.totalPages || 1;

    return (
        <div className="w-full bg-[#0a0a0f] min-h-screen">
            {/* Hero Header */}
            <div className="w-full py-28 bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center mb-16">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-cyan-500/10"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

                <div className="text-center text-white relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                        Nguồn dữ liệu
                    </h1>
                    <nav aria-label="breadcrumb" className="mt-4">
                        <ol className="flex justify-center items-center space-x-4 font-mono text-sm tracking-wider">
                            <li className="flex items-center">
                                <Link href="/" className="text-cyan-300/70 hover:text-cyan-400 transition-colors hover:tracking-widest">
                                    TRANG CHỦ
                                </Link>
                                <span className="mx-2 text-cyan-400/50">/</span>
                            </li>
                            <li className="text-cyan-400 font-semibold" aria-current="page">
                                NGUỒN DỮ LIỆU
                            </li>
                        </ol>
                    </nav>
                </div>

                {/* Scanning line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50 animate-pulse"></div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-7xl px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Cột chính: Danh sách bài viết */}
                    <div className="lg:col-span-3">
                        {isLoading && <GlobalSpinner />}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
                                <p className="font-mono text-red-400 tracking-wider">LỖI NGUỒN DỮ LIỆU</p>
                            </div>
                        )}

                        {data && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.data.map((blog) => (
                                        <BlogCard key={blog.id} blog={blog} />
                                    ))}
                                </div>

                                {data.data.length === 0 && (
                                    <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-2xl border border-cyan-500/20">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                            <div className="w-8 h-8 bg-cyan-400 rounded-full animate-pulse"></div>
                                        </div>
                                        <p className="font-mono text-cyan-300/70 tracking-wider">KHÔNG TÌM THẤY BÀI VIẾT</p>
                                    </div>
                                )}

                                {/* Phân trang */}
                                {totalPages > 1 && (
                                    <Pagination className="mt-8">
                                        <PaginationContent className="flex items-center space-x-2">
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    className="font-mono border border-cyan-500/30 bg-[#0a0a0f] text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                                                    onClick={(e) => { e.preventDefault(); handlePageChange(Math.max(1, currentPage - 1)); }}
                                                />
                                            </PaginationItem>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={i + 1 === currentPage}
                                                        className={`font-mono border ${i + 1 === currentPage
                                                            ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400'
                                                            : 'border-cyan-500/30 bg-[#0a0a0f] text-cyan-300 hover:bg-cyan-500/10'
                                                            } transition-all`}
                                                        onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    className="font-mono border border-cyan-500/30 bg-[#0a0a0f] text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                                                    onClick={(e) => { e.preventDefault(); handlePageChange(Math.min(totalPages, currentPage + 1)); }}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                )}
                            </>
                        )}
                    </div>

                    {/* Cột phụ: Sidebar */}
                    <div className="lg:col-span-1">
                        <BlogSidebar
                            onSelectCategory={handleSelectCategory}
                            onSearch={handleSearch}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}