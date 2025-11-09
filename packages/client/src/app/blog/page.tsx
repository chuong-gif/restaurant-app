// packages/client/src/app/blog/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // <-- SỬA LỖI 4, 5: THÊM IMPORT NÀY
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // <-- SỬA LỖI 6: THÊM `keepPreviousData`
import api from '@/lib/api';

// Types
import { Blog, BlogsApiResponse } from '@/types/blog';
// SỬA LỖI 1, 2: Sửa tên import
import { BlogCategory, BlogCategoriesApiResponse } from '@/types/blog';

// Components
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

    // 1. Tải danh sách danh mục
    const { data: categories, isLoading: isLoadingCategories } = useQuery<BlogCategoriesApiResponse>({
        queryKey: ['blogCategories'],
        queryFn: async () => api.get('/public/blog-categories').then(res => res.data),
        staleTime: 1000 * 60 * 60, // 1 giờ
    });

    // 2. Tải bài viết mới nhất (cho sidebar)
    const { data: recentPosts, isLoading: isLoadingRecent } = useQuery<BlogsApiResponse>({
        queryKey: ['recentBlogs'],
        queryFn: async () => api.get('/public/blogs', { params: { page: 1, limit: 5 } }).then(res => res.data),
        staleTime: 1000 * 60 * 5, // 5 phút
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="sticky top-24 space-y-6">
            {/* Tìm kiếm */}
            <form onSubmit={handleSearchSubmit}>
                <Input
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            {/* Danh mục */}
            <div>
                <h3 className="text-xl font-semibold mb-3">Danh mục</h3>
                <div className="flex flex-col space-y-2">
                    <Button variant="ghost" className="justify-start" onClick={() => onSelectCategory(null)}>
                        Tất cả
                    </Button>
                    {isLoadingCategories ? <p>Đang tải...</p> :
                        // SỬA LỖI 3: Thêm kiểu `BlogCategory`
                        categories?.data.map((cat: BlogCategory) => (
                            <Button
                                key={cat.id}
                                variant="ghost"
                                className="justify-start"
                                onClick={() => onSelectCategory(cat.id)}
                            >
                                {cat.ten_danh_muc}
                            </Button>
                        ))
                    }
                </div>
            </div>

            {/* Bài viết mới */}
            <div>
                <h3 className="text-xl font-semibold mb-3">Bài viết mới</h3>
                <div className="space-y-4">
                    {isLoadingRecent ? <p>Đang tải...</p> :
                        recentPosts?.data.map((post: Blog) => ( // Thêm kiểu `Blog`
                            <Link href={`/blog/${post.slug}`} key={post.id} className="flex items-center gap-3 group">
                                <Image
                                    src={(post.media_files as any)?.file_url || '/images/placeholder-post.jpg'}
                                    alt={post.tieu_de}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <h4 className="text-sm font-medium group-hover:text-primary leading-snug">
                                    {post.tieu_de.length > 50 ? `${post.tieu_de.slice(0, 50)}...` : post.tieu_de}
                                </h4>
                            </Link>
                        ))
                    }
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
                    limit: 9, // Hiển thị 9 bài mỗi trang
                    danh_muc_id: selectedCategoryId || undefined,
                    search: searchTerm || undefined,
                },
            });
            return res.data;
        },
        placeholderData: keepPreviousData, // SỬA LỖI 6
    });

    const handleSelectCategory = (id: number | null) => {
        setSelectedCategoryId(id);
        setCurrentPage(1); // Reset trang
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset trang
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Cuộn lên đầu trang
    };

    const totalPages = data?.totalPages || 1;

    return (
        <div className="w-full">
            {/* Hero Header */}
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-secondary">Tin tức & Mẹo hay</h1>
                    <nav aria-label="breadcrumb" className="mt-2">
                        <ol className="breadcrumb justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Blog</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-7xl px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Cột chính: Danh sách bài viết */}
                    <div className="lg:col-span-3">
                        {isLoading && <GlobalSpinner />}
                        {error && <p className="text-destructive">Đã xảy ra lỗi khi tải bài viết.</p>}

                        {data && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.data.map((blog) => (
                                        <BlogCard key={blog.id} blog={blog} />
                                    ))}
                                </div>

                                {data.data.length === 0 && (
                                    <div className="text-center py-20">
                                        <p className="text-muted-foreground">Không tìm thấy bài viết nào.</p>
                                    </div>
                                )}

                                {/* Phân trang */}
                                {totalPages > 1 && (
                                    <Pagination className="mt-8">
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => { e.preventDefault(); handlePageChange(Math.max(1, currentPage - 1)); }}
                                                />
                                            </PaginationItem>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={i + 1 === currentPage}
                                                        onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
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