// NewestProductsSection.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { ProductsApiResponse, SanPham } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

async function getNewestProducts() {
    try {
        const response = await api.get<ProductsApiResponse>('/public/products/newest');
        return response.data.data.slice(0, 8);
    } catch (error) {
        console.error("Failed to fetch newest products:", error);
        return [];
    }
}

function ProductItem({ product }: { product: SanPham }) {
    const detailUrl = `/product-detail/${product.id}`;
    const price = product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban;
    const oldPrice = product.gia_khuyen_mai > 0 ? product.gia_ban : null;

    return (
        <Link href={detailUrl} className="group">
            <Card className="overflow-hidden h-full bg-[#0a0a0f] border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500 group">
                <CardContent className="p-0 relative">
                    {/* Holographic effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                    <Image
                        src={(product.media_files as any)?.file_url || '/images/logo.png'}
                        alt={product.ten_san_pham}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 relative z-0"
                    />

                    {/* Glowing border effect */}
                    <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-cyan-500/50 to-purple-500/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm group-hover:blur-0"></div>

                    <div className="p-4 relative z-20 bg-[#0a0a0f]/80 backdrop-blur-sm">
                        <h3 className="font-semibold truncate text-cyan-100 group-hover:text-cyan-400 transition-colors">
                            {product.ten_san_pham}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                {formatCurrency(price)}
                            </span>
                            {oldPrice && (
                                <span className="text-sm text-gray-400 line-through">
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

export default async function NewestProductsSection() {
    const products = await getNewestProducts();

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="bg-[#0a0a0f] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

            <div className="container mx-auto max-w-7xl px-4 py-20 relative z-10">
                <div className="text-center mb-16">
                    <h5 className="font-mono text-cyan-400 text-lg tracking-wider mb-4">DIGITAL_MENU_LOADED</h5>
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        Neural Network Cuisine
                    </h2>
                    <p className="mt-4 text-cyan-200/60 max-w-2xl mx-auto">
                        Experience the future of gastronomy with our algorithmically optimized dishes
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}