// packages/client/src/app/menu/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

// Types
import { SanPham, ProductsApiResponse } from '@/types/product';
import { ProductCategory, CategoriesApiResponse } from '@/types/category';

// Components
import GlobalSpinner from '@/components/common/GlobalSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

// ================== COMPONENT SIDEBAR DANH MỤC ==================
function CategorySidebar({
    selectedId,
    onSelectCategory,
}: {
    selectedId: number | null;
    onSelectCategory: (id: number | null) => void;
}) {
    const { data, isLoading, error } = useQuery<CategoriesApiResponse>({
        queryKey: ['productCategories'],
        queryFn: async () => {
            const res = await api.get('/public/product-categories');
            return res.data;
        },
        staleTime: 1000 * 60 * 60,
    });

    if (isLoading) return (
        <div className="text-cyan-400 font-mono text-sm p-4 text-center">
            LOADING CATEGORIES...
        </div>
    );
    if (error) return (
        <div className="text-red-400 font-mono text-sm p-4 text-center">
            SYSTEM ERROR: CATEGORY DATA CORRUPTED
        </div>
    );

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-b from-cyan-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <Card className="relative bg-[#0f0f1a] border border-cyan-500/30 backdrop-blur-lg sticky top-24">
                <CardContent className="p-6">
                    <h4 className="mb-6 font-mono text-xl text-cyan-400 text-center border-b border-cyan-500/30 pb-3">
                        DATABASE QUERY
                    </h4>
                    <ul className="space-y-3">
                        <li>
                            <Button
                                variant={selectedId === null ? 'default' : 'ghost'}
                                className={`w-full justify-start font-mono text-sm transition-all duration-300 ${selectedId === null
                                        ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white border-cyan-400/50'
                                        : 'bg-transparent text-cyan-300 hover:text-white hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30'
                                    }`}
                                onClick={() => onSelectCategory(null)}
                            >
                                [ALL SYSTEMS]
                            </Button>
                        </li>
                        {data?.data.map((category) => (
                            <li key={category.id}>
                                <Button
                                    variant={selectedId === category.id ? 'default' : 'ghost'}
                                    className={`w-full justify-start font-mono text-sm transition-all duration-300 ${selectedId === category.id
                                            ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white border-cyan-400/50'
                                            : 'bg-transparent text-cyan-300 hover:text-white hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30'
                                        }`}
                                    onClick={() => onSelectCategory(category.id)}
                                >
                                    {category.ten_danh_muc.toUpperCase()}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

// ================== COMPONENT LƯỚI SẢN PHẨM ==================
function ProductGrid({
    selectedCategoryId,
    currentPage,
    onPageChange,
}: {
    selectedCategoryId: number | null;
    currentPage: number;
    onPageChange: (page: number) => void;
}) {
    const PRODUCTS_PER_PAGE = 8;

    const { data, isLoading, error } = useQuery<ProductsApiResponse>({
        queryKey: ['products', selectedCategoryId, currentPage],
        queryFn: async () => {
            const res = await api.get('/public/products', {
                params: {
                    danh_muc_id: selectedCategoryId || undefined,
                    page: currentPage,
                    limit: PRODUCTS_PER_PAGE,
                    trang_thai: true,
                },
            });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });

    if (isLoading) return <GlobalSpinner />;
    if (error) return (
        <div className="text-center py-20">
            <p className="text-red-400 font-mono">DATA STREAM INTERRUPTED</p>
        </div>
    );

    if (!data || data.data.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-cyan-300 font-mono">NO DATA STREAMS DETECTED</p>
                <p className="text-cyan-200/60 text-sm mt-2 font-mono">AWAITING SYSTEM UPDATE</p>
            </div>
        );
    }

    const totalPages = data.totalPages;

    return (
        <div>
            {/* Status Bar */}
            <div className="mb-6 p-4 bg-black/50 border border-cyan-500/30 rounded-lg">
                <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-cyan-400">ACTIVE STREAMS: {data.data.length}</span>
                    <span className="text-purple-400">PAGE {currentPage}/{totalPages}</span>
                </div>
            </div>

            {/* Lưới sản phẩm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.data.map((product: SanPham) => (
                    <div key={product.id} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                        <Link
                            href={`/product-detail/${product.id}`}
                            className="relative flex gap-4 bg-[#0f0f1a] p-4 rounded-xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500 rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <Image
                                    src={(product.media_files as any)?.file_url || '/images/logo.png'}
                                    alt={product.ten_san_pham}
                                    width={100}
                                    height={100}
                                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0 relative z-10 border border-cyan-500/30"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between border-b border-cyan-500/30 pb-2 mb-2">
                                    <h5 className="font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300 truncate font-mono text-sm">
                                        {product.ten_san_pham.toUpperCase()}
                                    </h5>
                                    <span className="text-cyan-400 font-bold text-nowrap ml-2 font-mono text-sm">
                                        {formatCurrency(product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban)}
                                    </span>
                                </div>
                                {product.gia_khuyen_mai > 0 && (
                                    <span className="text-xs text-purple-300 line-through font-mono">
                                        {formatCurrency(product.gia_ban)}
                                    </span>
                                )}
                                <p className="text-cyan-200/70 text-xs mt-2 line-clamp-2 font-mono">
                                    {product.mo_ta}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="mt-8 p-4 bg-black/50 border border-cyan-500/30 rounded-lg">
                    <Pagination>
                        <PaginationContent className="flex justify-between w-full">
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    className="font-mono text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(Math.max(1, currentPage - 1));
                                    }}
                                >
                                    PREV
                                </PaginationPrevious>
                            </PaginationItem>

                            <div className="flex space-x-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={i + 1 === currentPage}
                                            className={`font-mono transition-all duration-300 ${i + 1 === currentPage
                                                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white border-cyan-400/50'
                                                    : 'text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10'
                                                }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onPageChange(i + 1);
                                            }}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                            </div>

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    className="font-mono text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(Math.min(totalPages, currentPage + 1));
                                    }}
                                >
                                    NEXT
                                </PaginationNext>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}

// ================== COMPONENT TRANG CHÍNH ==================
export default function MenuPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSelectCategory = (id: number | null) => {
        setSelectedCategoryId(id);
        setCurrentPage(1);
    };

    return (
        <div className="bg-[#0a0a0f] min-h-screen">
            {/* Hero Header */}
            <div className="w-full py-24 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2f] to-[#0a0a0f] relative overflow-hidden">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}></div>
                </div>

                {/* Glowing Effects */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                <div className="text-center text-white relative z-10">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            DATA STREAM
                        </span>
                    </h1>
                    <p className="text-cyan-300 text-lg mb-4 font-mono">NEURAL MENU INTERFACE</p>
                    <nav aria-label="breadcrumb" className="mt-2">
                        <ol className="flex justify-center items-center space-x-2 text-sm uppercase font-mono">
                            <li className="flex items-center">
                                <Link href="/" className="text-cyan-300 hover:text-cyan-100 transition-colors duration-300">
                                    HOME SYSTEM
                                </Link>
                                <span className="mx-2 text-cyan-500">/</span>
                            </li>
                            <li className="text-cyan-100 font-semibold">DATA STREAM</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-7xl px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Cột 1: Sidebar */}
                    <div className="lg:col-span-1">
                        <CategorySidebar
                            selectedId={selectedCategoryId}
                            onSelectCategory={handleSelectCategory}
                        />
                    </div>

                    {/* Cột 2: Main Content */}
                    <div className="lg:col-span-3">
                        <ProductGrid
                            selectedCategoryId={selectedCategoryId}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>

            {/* Cyberpunk Grid Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.15) 1px, transparent 0)`,
                    backgroundSize: '50px 50px',
                }}></div>
            </div>
        </div>
    );
}