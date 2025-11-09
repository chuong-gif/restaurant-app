// packages/client/src/app/booking/select/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react'; // Thêm useState
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/useBookingStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { BanAn, TablesApiResponse } from '@/types/table';
import { SanPham, ProductsApiResponse } from '@/types/product';
import GlobalSpinner from '@/components/common/GlobalSpinner';

// Import các component con
import BookingCart from '@/components/booking/BookingCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from "@/components/ui/separator";

// === THÊM IMPORT MỚI ===
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react"; // Icon
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// =======================


// === COMPONENT CON 1: TableSelector (ĐÃ SỬA) ===
function TableSelector() {
    const { info, selectedTable, setSelectedTable } = useBookingStore();
    const [viewingVideo, setViewingVideo] = useState<string | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<string | null>(null); // <-- THÊM STATE LỌC TẦNG

    const { data, isLoading, error } = useQuery<TablesApiResponse>({
        queryKey: ['availableTables', info.reservation_date, info.party_size],
        queryFn: async () => {
            const response = await api.get('/public/tables/available', {
                params: {
                    date: info.reservation_date,
                    partySize: info.party_size,
                },
            });
            return response.data;
        },
        enabled: !!info.reservation_date && !!info.party_size,
    });

    // === THÊM LOGIC LỌC TẦNG ===
    // Lấy danh sách các tầng duy nhất
    const floors = useMemo(() => {
        if (!data?.data) return [];
        const floorSet = new Set(data.data.map(table => table.tang.toString()));
        return Array.from(floorSet).sort((a, b) => parseInt(a) - parseInt(b));
    }, [data]);

    // Lọc bàn theo tầng
    const filteredTables = useMemo(() => {
        if (!data?.data) return [];
        if (!selectedFloor) return data.data; // Nếu không chọn, hiện tất cả
        return data.data.filter(table => table.tang.toString() === selectedFloor);
    }, [data, selectedFloor]);
    // ==========================

    if (isLoading) return <p>Đang tìm bàn trống...</p>;
    if (error) return <p className="text-destructive">Lỗi: {error.message}</p>;
    if (!data || data.data.length === 0) return <p>Không tìm thấy bàn trống phù hợp.</p>;

    return (
        <Dialog open={!!viewingVideo} onOpenChange={(open) => !open && setViewingVideo(null)}>
            <div className="space-y-4">
                <Button
                    variant={!selectedTable ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => setSelectedTable(null)}
                >
                    Tự động xếp bàn
                </Button>
                <Separator />

                {/* === THÊM BỘ LỌC TẦNG === */}
                {floors.length > 1 && ( // Chỉ hiển thị nếu có nhiều hơn 1 tầng
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-muted-foreground">Hoặc chọn bàn cụ thể theo tầng</p>
                        <ToggleGroup
                            type="single"
                            value={selectedFloor || ""}
                            onValueChange={(value) => setSelectedFloor(value || null)}
                        >
                            <ToggleGroupItem value="" aria-label="Tất cả">Tất cả</ToggleGroupItem>
                            {floors.map(floor => (
                                <ToggleGroupItem key={floor} value={floor} aria-label={`Tầng ${floor}`}>
                                    Tầng {floor}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                )}
                {/* ======================= */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Sửa: Dùng `filteredTables` thay vì `data.data` */}
                    {filteredTables.map((table) => {
                        const imageUrl = (table.media_files_ban_an_anh_ban_idTomedia_files as any)?.file_url || '/images/logo.png';
                        const videoUrl = (table.media_files_ban_an_video_ban_idTomedia_files as any)?.file_url;

                        return (
                            <Card
                                key={table.id}
                                className={`cursor-pointer transition-all relative overflow-hidden ${selectedTable?.id === table.id ? 'border-primary ring-2 ring-primary' : ''
                                    }`}
                                onClick={() => setSelectedTable(table)}
                            >
                                {videoUrl && (
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setViewingVideo(videoUrl);
                                        }}
                                    >
                                        <PlayCircle className="h-5 w-5" />
                                    </Button>
                                )}
                                <CardContent className="p-4">
                                    <Image
                                        src={imageUrl}
                                        alt={`Bàn ${table.so_ban}`}
                                        width={300}
                                        height={200}
                                        className="w-full h-32 object-cover rounded-md mb-2"
                                    />
                                    <h3 className="font-semibold">Bàn {table.so_ban}</h3>
                                    <p className="text-sm text-muted-foreground">Sức chứa: {table.suc_chua} người</p>
                                    <p className="text-sm text-muted-foreground">Tầng: {table.tang}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Dialog Video (Giữ nguyên) */}
            <DialogContent className="max-w-3xl p-4">
                <DialogHeader>
                    <DialogTitle>Xem video bàn</DialogTitle>
                </DialogHeader>
                {viewingVideo && (
                    <video
                        key={viewingVideo}
                        width="100%"
                        controls
                        autoPlay
                        src={viewingVideo}
                        className="rounded-md"
                    >
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                )}
            </DialogContent>
        </Dialog>
    );
}

// === COMPONENT CON 2: ProductSelector (Giữ nguyên) ===
function ProductSelector() {
    const { addToCart } = useBookingStore();

    // Tải *tất cả* sản phẩm (đặt limit lớn)
    const { data, isLoading, error } = useQuery<ProductsApiResponse>({
        queryKey: ['activeProducts'],
        queryFn: async () => {
            const response = await api.get('/public/products/active', {
                params: { limit: 100, page: 1 },
            });
            return response.data;
        },
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    if (isLoading) return <p>Đang tải thực đơn...</p>;
    if (error) return <p className="text-destructive">Lỗi: {error.message}</p>;
    if (!data || data.data.length === 0) return <p>Không tìm thấy món ăn nào.</p>;

    // Nhóm sản phẩm theo danh mục
    const groupedProducts = data.data.reduce((acc, product) => {
        const categoryName = product.danh_muc_san_pham?.ten_danh_muc || 'Khác';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {} as Record<string, SanPham[]>);

    return (
        <Tabs defaultValue={Object.keys(groupedProducts)[0]} className="w-full">
            <TabsList className="flex flex-wrap h-auto">
                {Object.keys(groupedProducts).map(category => (
                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                ))}
            </TabsList>
            {Object.keys(groupedProducts).map(category => (
                <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedProducts[category].map(product => (
                            <Card key={product.id}>
                                <CardContent className="p-4 flex flex-col h-full">
                                    <Image
                                        src={(product.media_files as any)?.file_url || '/images/logo.png'}
                                        alt={product.ten_san_pham}
                                        width={300}
                                        height={200}
                                        className="w-full h-32 object-cover rounded-md mb-3"
                                    />
                                    <h3 className="font-semibold leading-snug">{product.ten_san_pham}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 flex-grow">
                                        {product.mo_ta?.substring(0, 50)}...
                                    </p>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="font-semibold text-primary">
                                            {formatCurrency(product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban)}
                                        </span>
                                        <Button size="sm" onClick={() => addToCart(product)} style={{ color: 'black' }}>
                                            Chọn
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}


// === COMPONENT TRANG CHÍNH (Giữ nguyên) ===
export default function SelectPage() {
    const router = useRouter();
    const { info } = useBookingStore();

    // Bảo vệ route: Nếu chưa điền thông tin ở Bước 1, đá về
    useEffect(() => {
        if (!info.reservation_date || !info.party_size) {
            router.replace('/booking');
        }
    }, [info, router]);

    // Nếu state chưa sẵn sàng, hiển thị loading
    if (!info.reservation_date || !info.party_size) {
        return <GlobalSpinner />;
    }

    return (
        <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cột trái: Chọn Bàn và Món ăn */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 font-secondary text-primary">
                            1. Chọn bàn của bạn
                        </h2>
                        <TableSelector />
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 font-secondary text-primary">
                            2. Chọn món ăn
                        </h2>
                        <ScrollArea className="h-[600px] w-full">
                            <ProductSelector />
                        </ScrollArea>
                    </section>
                </div>

                {/* Cột phải: Giỏ hàng */}
                <div className="lg:col-span-1">
                    <BookingCart />
                </div>
            </div>
        </div>
    );
}