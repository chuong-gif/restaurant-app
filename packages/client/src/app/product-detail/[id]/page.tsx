// packages/client/src/app/product-detail/[id]/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { SanPham, ProductsApiResponse } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Component con: Sản phẩm liên quan
async function RelatedProducts({ categoryId, currentProductId }: { categoryId: number, currentProductId: number }) {
    let relatedProducts: SanPham[] = [];
    try {
        const response = await api.get<ProductsApiResponse>('/public/products', {
            params: { danh_muc_id: categoryId, limit: 5 }
        });
        relatedProducts = response.data.data.filter(p => p.id !== currentProductId).slice(0, 4);
    } catch (error) {
        console.error("Failed to fetch related products:", error);
    }

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className="lg:col-span-1 space-y-6">
            <h2 className="font-mono text-2xl text-cyan-400 border-b border-cyan-500/30 pb-3">
                RELATED DATA STREAMS
            </h2>
            {relatedProducts.map(product => (
                <div key={product.id} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    <Link href={`/product-detail/${product.id}`} className="relative flex items-center gap-4 bg-[#0f0f1a] p-3 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
                        <Image
                            src={(product.media_files as any)?.file_url || '/images/logo.png'}
                            alt={product.ten_san_pham}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg border border-cyan-500/30"
                        />
                        <div className="flex-1">
                            <h4 className="font-mono text-sm text-cyan-200 group-hover:text-cyan-100 transition-colors duration-300">
                                {product.ten_san_pham.toUpperCase()}
                            </h4>
                            <p className="text-sm font-bold text-purple-400 font-mono mt-1">
                                {formatCurrency(product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban)}
                            </p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

// Hàm tải dữ liệu (Server-side)
async function getProductDetail(id: string): Promise<SanPham | null> {
    try {
        const baseUrl = process.env.API_BASE_URL_SERVER;
        const res = await fetch(`${baseUrl}/public/products/detail/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error("Failed to fetch product detail:", error);
        return null;
    }
}

// Component Trang Chi Tiết
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductDetail(id);

    if (!product) {
        return (
            <div className="w-full bg-[#0a0a0f] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-30"></div>
                        <Card className="relative bg-[#0f0f1a] border border-red-500/30 backdrop-blur-lg p-8">
                            <CardContent>
                                <h1 className="text-2xl font-mono text-red-400 mb-4">404 - DATA STREAM NOT FOUND</h1>
                                <p className="text-red-300 font-mono mb-6">REQUESTED PRODUCT DATA DOES NOT EXIST IN NEURAL DATABASE.</p>
                                <Button asChild className="font-mono bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border border-cyan-400/50 hover:border-cyan-300/50 transition-all duration-300">
                                    <Link href="/menu">RETURN TO DATA STREAM</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    const price = product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban;
    const oldPrice = product.gia_khuyen_mai > 0 ? product.gia_ban : null;
    const categoryId = product.danh_muc_san_pham?.id;

    return (
        <div className="w-full bg-[#0a0a0f] min-h-screen">
            {/* Hero Header - Cyberpunk Style */}
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
                            DATA STREAM ANALYSIS
                        </span>
                    </h1>
                    <p className="text-cyan-300 text-lg mb-4 font-mono">NEURAL PRODUCT INTERFACE</p>
                </div>
            </div>

            {/* Nội dung chi tiết */}
            <div className="container mx-auto max-w-6xl px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột chính */}
                    <div className="lg:col-span-2">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative bg-[#0f0f1a] border border-cyan-500/30 backdrop-blur-lg">
                                <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Ảnh sản phẩm */}
                                    <div className="w-full relative">
                                        <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-20"></div>
                                        <Image
                                            src={(product.media_files as any)?.file_url || '/images/logo.png'}
                                            alt={product.ten_san_pham}
                                            width={500}
                                            height={500}
                                            className="w-full h-auto object-cover rounded-xl relative z-10 border border-cyan-500/30 shadow-2xl"
                                        />
                                    </div>
                                    {/* Thông tin */}
                                    <div className="flex flex-col space-y-6">
                                        <Badge className="w-fit font-mono bg-gradient-to-r from-cyan-600 to-purple-600 border-cyan-400/50 text-white">
                                            {product.danh_muc_san_pham?.ten_danh_muc.toUpperCase() || 'UNCATEGORIZED'}
                                        </Badge>
                                        <h1 className="text-4xl font-bold font-mono text-cyan-100">
                                            {product.ten_san_pham.toUpperCase()}
                                        </h1>
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-4xl font-bold font-mono text-cyan-400">
                                                {formatCurrency(price)}
                                            </span>
                                            {oldPrice && (
                                                <span className="text-xl font-mono text-purple-300 line-through">
                                                    {formatCurrency(oldPrice)}
                                                </span>
                                            )}
                                        </div>
                                        <Separator className="bg-cyan-500/30" />
                                        <Button asChild size="lg" className="w-full font-mono bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border border-cyan-400/50 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
                                            <Link href="/booking">INITIATE BOOKING PROTOCOL</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                                {/* Mô tả */}
                                <Separator className="bg-cyan-500/30" />
                                <CardContent className="p-6 md:p-8">
                                    <h3 className="text-xl font-mono text-cyan-400 mb-4 border-b border-cyan-500/30 pb-2">
                                        DATA ANALYSIS
                                    </h3>
                                    <div className="prose prose-sm max-w-none">
                                        {product.mo_ta ? (
                                            <p className="text-cyan-200 font-mono leading-relaxed">{product.mo_ta}</p>
                                        ) : (
                                            <p className="text-cyan-200/70 font-mono">NO DATA STREAM AVAILABLE FOR ANALYSIS.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Cột phụ (Sản phẩm liên quan) */}
                    {categoryId && (
                        <RelatedProducts categoryId={categoryId} currentProductId={product.id} />
                    )}
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