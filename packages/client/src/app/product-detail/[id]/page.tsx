// packages/client/src/app/product-detail/[id]/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { SanPham, ProductsApiResponse } from '@/types/product'; // Thêm ProductsApiResponse
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Component con: Sản phẩm liên quan (tái cấu trúc từ [cite: 184-210])
async function RelatedProducts({ categoryId, currentProductId }: { categoryId: number, currentProductId: number }) {
    let relatedProducts: SanPham[] = [];
    try {
        // Gọi API mới: GET /public/products?danh_muc_id=...
        const response = await api.get<ProductsApiResponse>('/public/products', {
            params: { danh_muc_id: categoryId, limit: 5 } // Lấy 5 sản phẩm
        });
        // Lọc sản phẩm hiện tại ra khỏi danh sách liên quan
        relatedProducts = response.data.data.filter(p => p.id !== currentProductId).slice(0, 4); // Chỉ lấy 4
    } catch (error) {
        console.error("Failed to fetch related products:", error);
    }

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-semibold">Sản phẩm liên quan</h2>
            {relatedProducts.map(product => (
                <Link href={`/product-detail/${product.id}`} key={product.id} className="flex items-center gap-4 group">
                    <Image
                        src={(product.media_files as any)?.file_url || '/images/logo.png'}
                        alt={product.ten_san_pham}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h4 className="font-medium group-hover:text-primary">{product.ten_san_pham}</h4>
                        <p className="text-sm font-bold text-primary">
                            {formatCurrency(product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban)}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}


// Hàm tải dữ liệu (Server-side)
async function getProductDetail(id: string): Promise<SanPham | null> {
    try {
        const response = await api.get(`/public/products/detail/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch product detail:", error);
        return null;
    }
}

// Component Trang Chi Tiết
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = await getProductDetail(params.id);

    if (!product) {
        return (
            <div className="container mx-auto max-w-7xl px-4 py-20 text-center">
                <h1 className="text-2xl font-semibold">404 - Không tìm thấy sản phẩm</h1>
                <p className="text-muted-foreground mt-2">Sản phẩm bạn tìm kiếm không tồn tại.</p>
                <Button asChild className="mt-4" style={{ color: 'black' }}>
                    <Link href="/menu">Quay lại Thực đơn</Link>
                </Button>
            </div>
        );
    }

    const price = product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban;
    const oldPrice = product.gia_khuyen_mai > 0 ? product.gia_ban : null;
    const categoryId = product.danh_muc_san_pham?.id;

    return (
        <div className="w-full">
            {/* Hero Header */}
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                {/* ... (giữ nguyên code Hero Header) ... */}
            </div>

            {/* Nội dung chi tiết */}
            <div className="container mx-auto max-w-6xl px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột chính */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Ảnh sản phẩm */}
                                <div className="w-full">
                                    <Image
                                        src={(product.media_files as any)?.file_url || '/images/logo.png'}
                                        alt={product.ten_san_pham}
                                        width={500}
                                        height={500}
                                        className="w-full h-auto object-cover rounded-lg shadow-md"
                                    />
                                </div>
                                {/* Thông tin */}
                                <div className="flex flex-col space-y-4">
                                    <Badge variant="outline" className="w-fit">
                                        {product.danh_muc_san_pham?.ten_danh_muc || 'Chưa phân loại'}
                                    </Badge>
                                    <h1 className="text-3xl font-bold">{product.ten_san_pham}</h1>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-bold text-primary">{formatCurrency(price)}</span>
                                        {oldPrice && (
                                            <span className="text-xl text-muted-foreground line-through">
                                                {formatCurrency(oldPrice)}
                                            </span>
                                        )}
                                    </div>
                                    <Separator />
                                    <Button asChild size="lg" className="w-full" style={{ color: 'black' }}>
                                        <Link href="/booking">Đặt bàn ngay</Link>
                                    </Button>
                                </div>
                            </CardContent>
                            {/* Mô tả */}
                            <Separator />
                            <CardContent className="p-4 md:p-6">
                                <h3 className="text-xl font-semibold mb-3">Mô tả sản phẩm</h3>
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    {product.mo_ta ? (
                                        <p>{product.mo_ta}</p>
                                    ) : (
                                        <p>Sản phẩm này chưa có mô tả.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cột phụ (Sản phẩm liên quan) */}
                    {categoryId && (
                        <RelatedProducts categoryId={categoryId} currentProductId={product.id} />
                    )}
                </div>
            </div>
        </div>
    );
}