// packages/client/src/components/home/NewestProductsSection.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { ProductsApiResponse, SanPham } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

// 1. Hàm tải dữ liệu (gọi API)
async function getNewestProducts() {
    try {
        // === SỬA LỖI Ở ĐÂY: Xóa 'next' config ra khỏi axios ===
        const response = await api.get<ProductsApiResponse>('/public/products/newest');
        // =================================================

        return response.data.data.slice(0, 8);
    } catch (error) {
        console.error("Failed to fetch newest products:", error);
        return [];
    }
}
// 2. Component Card cho sản phẩm
function ProductItem({ product }: { product: SanPham }) {
    const detailUrl = `/product-detail/${product.id}`;
    const price = product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban;
    const oldPrice = product.gia_khuyen_mai > 0 ? product.gia_ban : null;

    return (
        <Link href={detailUrl} className="group">
            <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                    <Image
                        src={(product.media_files as any)?.file_url || '/images/logo.png'}
                        alt={product.ten_san_pham}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                        <h3 className="font-semibold truncate group-hover:text-primary">{product.ten_san_pham}</h3>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-lg font-bold text-primary">
                                {formatCurrency(price)}
                            </span>
                            {oldPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                    {formatCurrency(oldPrice)}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

// 3. Component Section chính (Async)
export default async function NewestProductsSection() {
    const products = await getNewestProducts();

    if (products.length === 0) {
        return null; // Ẩn section nếu không có sản phẩm
    }

    return (
        <div className="bg-gray-50/50">
            <div className="container mx-auto max-w-7xl px-4 py-20">
                <div className="text-center mb-12">
                    <h5 className="font-secondary text-2xl text-primary">Thực đơn</h5>
                    <h2 className="text-4xl font-semibold">Món ăn mới nhất</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}