// packages/client/src/components/home/HeroSection.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function HeroSection() {
    // Animation thay thế cho 'animated slideInLeft' [cite: 54]
    const variants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };
    const pathname = usePathname();
    
    const navLinkClass = "bg-yellow-600 text-light hover:text-light-800 focus:text-light-800 data-[active]:text-light-800";

    return (
        <div className="w-full bg-dark text-white py-20 md:py-32">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Cột chữ */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, staggerChildren: 0.2 }}
                        className="text-center lg:text-left"
                    >
                        <motion.h1
                            variants={variants}
                            className="text-4xl md:text-5xl font-semibold leading-tight"
                        >
                            NHỮNG MÓN ĂN NGON SẴN SÀN PHỤC VỤ THỰC KHÁCH
                        </motion.h1>
                        <motion.p
                            variants={variants}
                            className="mt-6 text-lg text-gray-300"
                        >
                            Khám phá hành trình ẩm thực châu Á đầy màu sắc. Với menu phong
                            phú, từ những món ăn truyền thống đến những biến tấu mới lạ,
                            chúng tôi mang đến cho thực khách những trải nghiệm ẩm thực độc
                            đáo.
                        </motion.p>
                        <motion.div variants={variants} className="mt-8">
                        <Button
                            asChild
                            size="lg"
                        >
                            <Link
                                href="/booking"
                                className={cn(navigationMenuTriggerStyle(), navLinkClass)}
                                data-active={pathname === '/booking'}
                            >
                                Đặt bàn ngay
                            </Link>
                        </Button>
                        </motion.div>
                    </motion.div>

                    {/* Cột ảnh */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center lg:justify-end"
                    >
                        {/* === ẢNH GIỮ CHỖ ===
                Vui lòng thêm ảnh của bạn tại:
                /public/images/home/hero.jpg
            ====================== */}
                        <Image
                            src="/images/home/hero.jpg"
                            alt="Món ăn đặc sắc"
                            width={500}
                            height={500}
                            className="rounded-full object-cover w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}