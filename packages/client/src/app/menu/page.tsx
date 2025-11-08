// packages/client/src/app/menu/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// === THÊM `keepPreviousData` VÀO IMPORT ===
import { useQuery, keepPreviousData } from '@tanstack/react-query';
// =======================================
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
    // 1. Tải danh sách danh mục (chỉ các mục active)
    const { data, isLoading, error } = useQuery<CategoriesApiResponse>({
        queryKey: ['productCategories'],
        queryFn: async () => {
            const res = await api.get('/public/product-categories');
            return res.data;
        },
        staleTime: 1000 * 60 * 60, // Cache 1 giờ
    });

    if (isLoading) return <p>Đang tải danh mục...</p>;
    if (error) return <p className="text-destructive">Lỗi tải danh mục.</p>;

    return (
        <Card className="sticky top-24 shadow-lg">
            <CardContent className="p-4">
                <h4 className="mb-4 font-secondary text-2xl text-primary text-center">
                    Thực Đơn
                </h4>
                <ul className="space-y-2">
                    {/* Nút Xem tất cả */}
                    <li>
                        <Button
                            variant={selectedId === null ? 'default' : 'ghost'}
                            className="w-full justify-start text-base"
                            onClick={() => onSelectCategory(null)}
                        >
                            Xem tất cả
                        </Button>
                    </li>
                    {/* Danh sách danh mục */}
                    {data?.data.map((category) => (
                        <li key={category.id}>
                            <Button
                                variant={selectedId === category.id ? 'default' : 'ghost'}
                                className="w-full justify-start text-base"
                                onClick={() => onSelectCategory(category.id)}
                            >
                                {category.ten_danh_muc}
                            </Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
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

    // 2. Tải danh sách sản phẩm (LỌC THEO SERVER)
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
        // === SỬA LỖI TẠI ĐÂY (thay `keepPreviousData: true`) ===
        placeholderData: keepPreviousData, // Giữ dữ liệu cũ khi đang tải trang mới
        // ===============================================
    });

    if (isLoading) return <GlobalSpinner />;
    if (error) return <p className="text-destructive">Lỗi tải sản phẩm.</p>;
    // Lỗi 2, 3, 4, 5 sẽ tự động được sửa vì `data` giờ đã có kiểu `ProductsApiResponse | undefined`
    if (!data || data.data.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Đang cập nhật thêm món ăn...</p>
            </div>
        );
    }

    const totalPages = data.totalPages;

    return (
        <div>
            {/* Lưới sản phẩm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                {data.data.map((product: SanPham) => ( // Thêm kiểu `SanPham` để sửa lỗi 5
                    <Link
                        href={`/product-detail/${product.id}`}
                        key={product.id}
                        className="group flex gap-4"
                    >
                        <Image
                            src={(product.media_files as any)?.file_url || '/images/logo.png'}
                            alt={product.ten_san_pham}
                            width={100}
                            height={100}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between border-b border-dashed pb-2">
                                <h5 className="font-semibold truncate group-hover:text-primary">
                                    {product.ten_san_pham}
                                </h5>
                                <span className="text-primary font-semibold text-nowrap ml-2">
                                    {formatCurrency(product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban)}
                                </span>
                            </div>
                            {product.gia_khuyen_mai > 0 && (
                                <span className="text-xs text-muted-foreground line-through">
                                    {formatCurrency(product.gia_ban)}
                                </span>
                            )}
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                                {product.mo_ta}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(Math.max(1, currentPage - 1));
                                }}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    isActive={i + 1 === currentPage}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(i + 1);
                                    }}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(Math.min(totalPages, currentPage + 1));
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
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
        setCurrentPage(1); // Reset về trang 1 khi đổi danh mục
    };

    return (
        <div>
            {/* Hero Header */}
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-secondary">Thực Đơn</h1>
                    <nav aria-label="breadcrumb" className="mt-2">
                        <ol className="breadcrumb justify-content-center text-uppercase">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item text-white active" aria-current="page">
                                Thực Đơn
                            </li>
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
        </div>
    );
}