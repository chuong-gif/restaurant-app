// packages/client/src/components/home/AboutSection.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AboutSection() {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Cột ảnh */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                    className="grid grid-cols-2 gap-4"
                >
                    {/* === ẢNH GIỮ CHỖ ===
              Vui lòng thêm 4 ảnh của bạn vào:
              /public/images/home/about-1.jpg
              /public/images/home/about-2.jpg
              /public/images/home/about-3.jpg
              /public/images/home/about-4.jpg
          ====================== */}
                    <Image src="/images/home/about-1.jpg" alt="About 1" width={300} height={300} className="rounded-lg w-full object-cover shadow-md" />
                    <Image src="/images/home/about-2.jpg" alt="About 2" width={300} height={300} className="rounded-lg w-3/4 object-cover shadow-md justify-self-end self-start" />
                    <Image src="/images/home/about-3.jpg" alt="About 3" width={300} height={300} className="rounded-lg w-3/4 object-cover shadow-md justify-self-start self-end" />
                    <Image src="/images/home/about-4.jpg" alt="About 4" width={300} height={300} className="rounded-lg w-full object-cover shadow-md" />
                </motion.div>

                {/* Cột chữ */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                >
                    <h5 className="font-secondary text-2xl text-primary">Giới thiệu</h5>
                    <h2 className="text-4xl font-semibold my-4">Chào mừng đến với EnViSi</h2>
                    <p className="mb-4 text-muted-foreground">
                        Với hơn 5 năm kinh nghiệm, EnViSi tự hào mang đến cho thực khách những món ăn ngon, độc đáo và chất lượng.
                    </p>
                    <p className="mb-6 text-muted-foreground">
                        Đội ngũ đầu bếp tài năng của chúng tôi luôn không ngừng sáng tạo để mang đến những trải nghiệm ẩm thực mới lạ. Không gian nhà hàng ấm cúng, sang trọng, cùng với phong cách phục vụ chuyên nghiệp sẽ khiến quý khách hài lòng.
                    </p>
                    {/* Stats [cite: 213-220] */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="border-l-4 border-primary pl-4">
                            <span className="text-4xl font-bold text-primary">5</span>
                            <p className="text-sm text-muted-foreground">Năm</p>
                            <h6 className="font-semibold uppercase">Kinh Nghiệm</h6>
                        </div>
                        <div className="border-l-4 border-primary pl-4">
                            <span className="text-4xl font-bold text-primary">20</span>
                            <p className="text-sm text-muted-foreground">Đầu Bếp</p>
                            <h6 className="font-semibold uppercase">Tài Năng</h6>
                        </div>
                    </div>
                    <Button asChild size="lg" style={{ color: 'black' }}>
                        <Link href="/about">
                            Xem thêm
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}