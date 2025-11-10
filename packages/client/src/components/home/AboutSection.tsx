// AboutSection.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AboutSection() {
    return (
        <div className="bg-[#0a0a0f] text-white py-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div className="container mx-auto max-w-7xl px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                        className="grid grid-cols-2 gap-4 relative"
                    >
                        {/* Grid Pattern Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

                        <Image src="/images/home/about-1.jpg" alt="About 1" width={300} height={300} className="rounded-lg w-full object-cover shadow-lg shadow-cyan-500/20 border border-cyan-500/30 hover:shadow-cyan-500/40 transition-all duration-300" />
                        <Image src="/images/home/about-2.jpg" alt="About 2" width={300} height={300} className="rounded-lg w-3/4 object-cover shadow-lg shadow-purple-500/20 border border-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300 justify-self-end self-start" />
                        <Image src="/images/home/about-3.jpg" alt="About 3" width={300} height={300} className="rounded-lg w-3/4 object-cover shadow-lg shadow-cyan-500/20 border border-cyan-500/30 hover:shadow-cyan-500/40 transition-all duration-300 justify-self-start self-end" />
                        <Image src="/images/home/about-4.jpg" alt="About 4" width={300} height={300} className="rounded-lg w-full object-cover shadow-lg shadow-purple-500/20 border border-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300" />
                    </motion.div>

                    {/* Text Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                        className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
                    >
                        <h5 className="font-mono text-cyan-400 text-lg tracking-wider mb-2">SYSTEM_CORE_ONLINE</h5>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">
                            Chào mừng đến với EnViSi
                        </h2>
                        <p className="mb-4 text-gray-300 leading-relaxed">
                            Với hơn 5 năm kinh nghiệm, EnViSi tự hào mang đến cho thực khách những món ăn ngon, độc đáo và chất lượng.
                        </p>
                        <p className="mb-6 text-gray-300 leading-relaxed">
                            Đội ngũ đầu bếp tài năng của chúng tôi luôn không ngừng sáng tạo để mang đến những trải nghiệm ẩm thực mới lạ. Không gian nhà hàng ấm cúng, sang trọng, cùng với phong cách phục vụ chuyên nghiệp sẽ khiến quý khách hài lòng.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="border-l-4 border-cyan-400 pl-4 hover:border-cyan-400/80 transition-colors">
                                <span className="text-4xl font-bold text-cyan-400">5</span>
                                <p className="text-sm text-cyan-300/80">Năm</p>
                                <h6 className="font-semibold uppercase text-cyan-200 tracking-wider">Kinh Nghiệm</h6>
                            </div>
                            <div className="border-l-4 border-purple-400 pl-4 hover:border-purple-400/80 transition-colors">
                                <span className="text-4xl font-bold text-purple-400">20</span>
                                <p className="text-sm text-purple-300/80">Đầu Bếp</p>
                                <h6 className="font-semibold uppercase text-purple-200 tracking-wider">Tài Năng</h6>
                            </div>
                        </div>

                        <Button asChild size="lg" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all">
                            <Link href="/about">
                                ACCESS_SYSTEM →
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}