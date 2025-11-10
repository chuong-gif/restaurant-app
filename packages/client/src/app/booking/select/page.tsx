// packages/client/src/app/booking/select/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/useBookingStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { BanAn, TablesApiResponse } from '@/types/table';
import { SanPham, ProductsApiResponse } from '@/types/product';
import GlobalSpinner from '@/components/common/GlobalSpinner';
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from "@/components/ui/separator";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { PlayCircle, CheckCircle2, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// packages/client/src/app/booking/select/page.tsx (chỉ sửa phần TableSelector)
function TableSelector() {
    const { info, selectedTables, toggleTable } = useBookingStore();
    const [viewingVideo, setViewingVideo] = useState<string | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

    const { data, isLoading, error } = useQuery<TablesApiResponse>({
        queryKey: ['availableTables', info.reservation_date],
        queryFn: async () => {
            const response = await api.get('/public/tables/available', {
                params: {
                    date: info.reservation_date
                },
            });
            return response.data;
        },
        enabled: !!info.reservation_date && !!info.party_size,
    });

    const floors = useMemo(() => {
        if (!data?.data) return [];
        const floorSet = new Set(data.data.map(table => table.tang.toString()));
        return Array.from(floorSet).sort((a, b) => parseInt(a) - parseInt(b));
    }, [data]);

    const filteredTables = useMemo(() => {
        if (!data?.data) return [];
        if (!selectedFloor) return data.data;
        return data.data.filter(table => table.tang.toString() === selectedFloor);
    }, [data, selectedFloor]);

    // Hàm xử lý mở video
    const handleOpenVideo = (videoUrl: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra card
        console.log("Opening video:", videoUrl); // Debug
        setViewingVideo(videoUrl);
    };

    // Hàm xử lý đóng video
    const handleCloseVideo = () => {
        console.log("Closing video"); // Debug
        setViewingVideo(null);
    };

    if (isLoading) return (
        <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-mono text-cyan-400/70 mt-2">SCANNING_AVAILABLE_TABLES...</p>
        </div>
    );
    if (error) return <p className="font-mono text-red-400 text-center">SYSTEM_ERROR: {error.message}</p>;
    if (!data || data.data.length === 0) return <p className="font-mono text-cyan-400/70 text-center">NO_AVAILABLE_TABLES_FOUND</p>;

    return (
        <>
            <div className="space-y-6">
                <p className="text-center font-mono text-cyan-400/70 text-sm tracking-wider">
                    SELECT_ONE_OR_MULTIPLE_TABLES_FOR_OPTIMAL_CAPACITY
                </p>

                {floors.length > 1 && (
                    <div className="flex flex-col items-center gap-3">
                        <p className="font-mono text-cyan-300 text-sm">FILTER_BY_FLOOR</p>
                        <ToggleGroup
                            type="single"
                            value={selectedFloor || ""}
                            onValueChange={(value) => setSelectedFloor(value || null)}
                            className="bg-cyan-500/10 border border-cyan-400/50 rounded-lg p-1 backdrop-blur-sm"
                        >
                            <ToggleGroupItem
                                value=""
                                className="font-mono text-xs data-[state=on]:bg-cyan-400 data-[state=on]:text-[#0a0a0f] text-cyan-200 hover:text-cyan-400 transition-all"
                            >
                                ALL_FLOORS
                            </ToggleGroupItem>
                            {floors.map(floor => (
                                <ToggleGroupItem
                                    key={floor}
                                    value={floor}
                                    className="font-mono text-xs data-[state=on]:bg-cyan-400 data-[state=on]:text-[#0a0a0f] text-cyan-200 hover:text-cyan-400 transition-all"
                                >
                                    FLOOR_{floor}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTables.map((table) => {
                        const imageUrl = (table.media_files_ban_an_anh_ban_idTomedia_files as any)?.file_url || '/images/logo.png';
                        const videoUrl = (table.media_files_ban_an_video_ban_idTomedia_files as any)?.file_url;
                        const isSelected = selectedTables.some(t => t.id === table.id);

                        return (
                            <Card
                                key={table.id}
                                className={`cursor-pointer transition-all duration-500 relative overflow-hidden backdrop-blur-sm ${isSelected
                                        ? 'border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                                        : 'border-cyan-500/30 bg-white/5 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10'
                                    }`}
                                onClick={() => toggleTable(table)}
                            >
                                {/* Nút xem video */}
                                {videoUrl && (
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="absolute top-3 right-3 z-30 h-10 w-10 rounded-full bg-cyan-500 text-white hover:bg-cyan-400 hover:scale-110 transition-all shadow-2xl shadow-cyan-500/70 border-2 border-cyan-300"
                                        onClick={(e) => handleOpenVideo(videoUrl, e)}
                                    >
                                        <PlayCircle className="h-5 w-5" />
                                    </Button>
                                )}
                                {isSelected && (
                                    <div className="absolute top-3 left-3 z-20 h-8 w-8 rounded-full bg-cyan-400 text-[#0a0a0f] flex items-center justify-center shadow-lg shadow-cyan-400/50">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                )}
                                <CardContent className="p-4">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <Image
                                            src={imageUrl}
                                            alt={`Bàn ${table.so_ban}`}
                                            width={300}
                                            height={200}
                                            className="w-full h-32 object-cover rounded-md mb-3 relative z-10 group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="font-mono font-semibold text-cyan-100">TABLE_{table.so_ban}</h3>
                                    <p className="font-mono text-cyan-400/70 text-xs">CAPACITY: {table.suc_chua}</p>
                                    <p className="font-mono text-purple-400/70 text-xs">FLOOR: {table.tang}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Dialog Video - Sử dụng điều kiện render trực tiếp */}
            {viewingVideo && (
                <Dialog open={!!viewingVideo} onOpenChange={handleCloseVideo}>
                    <DialogContent className="max-w-4xl bg-[#0a0a0f] border border-cyan-500/30 backdrop-blur-sm">
                        <DialogHeader>
                            <DialogTitle className="font-mono text-cyan-400 text-center text-xl">
                                TABLE_PREVIEW - VIDEO_STREAM
                            </DialogTitle>
                        </DialogHeader>

                        <div className="relative">
                            <video
                                key={viewingVideo}
                                width="100%"
                                controls
                                autoPlay
                                className="rounded-lg border border-cyan-500/50 shadow-2xl"
                            >
                                <source src={viewingVideo} type="video/mp4" />
                                BROWSER_VIDEO_SUPPORT_REQUIRED
                            </video>

                            {/* Nút đóng rõ ràng */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -top-4 -right-4 z-50 h-10 w-10 rounded-full bg-red-500 text-white hover:bg-red-400 border-2 border-white shadow-2xl hover:scale-110 transition-all"
                                onClick={handleCloseVideo}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="text-center">
                            <Button
                                variant="outline"
                                className="font-mono border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
                                onClick={handleCloseVideo}
                            >
                                CLOSE_PREVIEW
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

function ProductSelector() {
    const { addToCart } = useBookingStore();

    const { data, isLoading, error } = useQuery<ProductsApiResponse>({
        queryKey: ['activeProducts'],
        queryFn: async () => {
            const response = await api.get('/public/products/active', {
                params: { limit: 100, page: 1 },
            });
            return response.data;
        },
    });

    if (isLoading) return (
        <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-mono text-cyan-400/70 mt-2">LOADING_FOOD_MATRIX...</p>
        </div>
    );
    if (error) return <p className="font-mono text-red-400 text-center">SYSTEM_ERROR: {error.message}</p>;
    if (!data || data.data.length === 0) return <p className="font-mono text-cyan-400/70 text-center">NO_PRODUCTS_AVAILABLE</p>;

    const groupedProducts = data.data.reduce((acc, product) => {
        const categoryName = product.danh_muc_san_pham?.ten_danh_muc || 'OTHER';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {} as Record<string, SanPham[]>);

    return (
        <Tabs defaultValue={Object.keys(groupedProducts)[0]} className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-[#0a0a0f] border border-cyan-500/30 rounded-lg p-1">
                {Object.keys(groupedProducts).map(category => (
                    <TabsTrigger
                        key={category}
                        value={category}
                        className="font-mono text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border data-[state=active]:border-cyan-500/50"
                    >
                        {category.toUpperCase()}
                    </TabsTrigger>
                ))}
            </TabsList>
            {Object.keys(groupedProducts).map(category => (
                <TabsContent key={category} value={category} className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedProducts[category].map(product => {
                            const price = product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban;
                            const oldPrice = product.gia_khuyen_mai > 0 ? product.gia_ban : null;

                            return (
                                <Card key={product.id} className="bg-white/5 border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                                    <CardContent className="p-4 flex flex-col h-full">
                                        <div className="relative group mb-3">
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <Image
                                                src={(product.media_files as any)?.file_url || '/images/logo.png'}
                                                alt={product.ten_san_pham}
                                                width={300}
                                                height={200}
                                                className="w-full h-32 object-cover rounded-md relative z-10 group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <h3 className="font-mono font-semibold text-cyan-100 leading-snug mb-2">{product.ten_san_pham}</h3>
                                        <p className="font-mono text-cyan-400/70 text-xs mb-3 flex-grow">
                                            {product.mo_ta?.substring(0, 60)}...
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="font-mono font-bold text-cyan-400">
                                                    {formatCurrency(price)}
                                                </span>
                                                {oldPrice && (
                                                    <span className="font-mono text-cyan-400/50 text-xs line-through">
                                                        {formatCurrency(oldPrice)}
                                                    </span>
                                                )}
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => addToCart(product)}
                                                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 font-mono text-xs transition-all"
                                            >
                                                ADD_TO_CART
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}

function BookingCart() {
    const router = useRouter();
    const { toast } = useToast();
    const { cart, updateQuantity, removeFromCart, getTotalPrice, info, selectedTables, getTotalCapacity } = useBookingStore();

    const handleNextStep = () => {
        if (!info.reservation_date || !info.party_size) {
            toast({ variant: "destructive", title: "SYSTEM_ERROR", description: "INCOMPLETE_USER_DATA" });
            router.push('/booking');
            return;
        }

        if (selectedTables.length === 0) {
            toast({ variant: "destructive", title: "SELECTION_REQUIRED", description: "NO_TABLES_SELECTED" });
            return;
        }

        if (totalCapacity < (info.party_size || 0)) {
            toast({ variant: "destructive", title: "CAPACITY_ERROR", description: "INSUFFICIENT_TABLE_CAPACITY" });
            return;
        }

        router.push('/booking/confirm');
    };

    const totalCartPrice = getTotalPrice();
    const totalCapacity = getTotalCapacity();
    const partySize = info.party_size || 0;
    const hasEnoughCapacity = totalCapacity >= partySize;

    return (
        <Card className="sticky top-24 bg-[#0a0a0f] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
            <CardHeader className="border-b border-cyan-500/20">
                <CardTitle className="font-mono text-cyan-400 tracking-wider">BOOKING_SUMMARY</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div>
                    <h4 className="font-mono text-cyan-300 text-sm mb-3">BASIC_INFO</h4>
                    <div className="space-y-2 font-mono text-xs">
                        <p><span className="text-cyan-400/70">TIME:</span> {new Date(info.reservation_date || '').toLocaleString('vi-VN')}</p>
                        <p><span className="text-cyan-400/70">GUESTS:</span> {partySize}</p>
                    </div>
                </div>
                <Separator className="bg-cyan-500/30" />
                <div>
                    <h4 className="font-mono text-cyan-300 text-sm mb-3">SELECTED_TABLES ({selectedTables.length})</h4>
                    <div className="flex justify-between items-center font-mono text-xs mb-3">
                        <span className="text-cyan-400/70">TOTAL_CAPACITY:</span>
                        <span className={hasEnoughCapacity ? 'text-cyan-400' : 'text-red-400'}>
                            {totalCapacity} / {partySize}
                        </span>
                    </div>
                    <ScrollArea className="h-[80px] w-full pr-4">
                        {selectedTables.length === 0 ? (
                            <p className="font-mono text-cyan-400/50 text-xs text-center py-4">NO_TABLES_SELECTED</p>
                        ) : (
                            selectedTables.map(table => (
                                <p key={table.id} className="font-mono text-cyan-400/70 text-xs mb-1">
                                    • TABLE_{table.so_ban} (F{table.tang}, CAP:{table.suc_chua})
                                </p>
                            ))
                        )}
                    </ScrollArea>
                </div>
                <Separator className="bg-cyan-500/30" />
                <div>
                    <h4 className="font-mono text-cyan-300 text-sm mb-3">SELECTED_ITEMS ({cart.length})</h4>
                    {cart.length === 0 ? (
                        <p className="font-mono text-cyan-400/50 text-xs text-center py-4">CART_EMPTY</p>
                    ) : (
                        <ScrollArea className="h-[200px] w-full pr-4">
                            <div className="space-y-3">
                                {cart.map(item => (
                                    <div key={item.product_id} className="flex items-center justify-between font-mono text-xs">
                                        <div className="flex-grow pr-2">
                                            <p className="text-cyan-100 truncate">{item.ten_san_pham}</p>
                                            <p className="text-cyan-400/70">{formatCurrency(item.gia)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                                                className="h-7 w-12 text-center p-1 bg-[#0a0a0f] border-cyan-500/30 text-cyan-100 font-mono text-xs"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7 text-red-400 border-red-500/30 hover:bg-red-500/10"
                                                onClick={() => removeFromCart(item.product_id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
                <Separator className="bg-cyan-500/30" />
                <div className="flex justify-between font-mono font-semibold">
                    <span className="text-cyan-300">SUBTOTAL</span>
                    <span className="text-cyan-400">{formatCurrency(totalCartPrice)}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 font-mono tracking-wider transition-all duration-300 disabled:opacity-50"
                    onClick={handleNextStep}
                    disabled={!hasEnoughCapacity}
                >
                    PROCEED_TO_CONFIRMATION
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function SelectPage() {
    const router = useRouter();
    const { info } = useBookingStore();

    useEffect(() => {
        if (!info.reservation_date || !info.party_size) {
            router.replace('/booking');
        }
    }, [info, router]);

    if (!info.reservation_date || !info.party_size) {
        return <GlobalSpinner />;
    }

    return (
        <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-mono font-semibold text-cyan-400 mb-6 tracking-wider">
                            1. TABLE_SELECTION
                        </h2>
                        <TableSelector />
                    </section>

                    <Separator className="bg-cyan-500/30" />

                    <section>
                        <h2 className="text-2xl font-mono font-semibold text-cyan-400 mb-6 tracking-wider">
                            2. FOOD_SELECTION
                        </h2>
                        <ScrollArea className="h-[600px] w-full rounded-lg border border-cyan-500/30 p-4">
                            <ProductSelector />
                        </ScrollArea>
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <BookingCart />
                </div>
            </div>
        </div>
    );
}