// packages/client/src/app/service/page.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    UserCog,
    UtensilsCrossed,
    Armchair,
    Headset,
    ShieldCheck,
    Truck,
    HandHelping,
    Gem,
} from 'lucide-react';
import { motion } from 'framer-motion';

// 8 dịch vụ từ Service.js [cite: 28-83]
const services = [
    {
        icon: <UserCog className="h-12 w-12 text-cyan-400" />,
        title: "Hệ thống Đầu bếp",
        description: "Mạng lưới đầu bếp được tăng cường, mang đến trải nghiệm ẩm thực vô song.",
    },
    {
        icon: <UtensilsCrossed className="h-12 w-12 text-cyan-400" />,
        title: "Nguyên liệu tươi",
        description: "Tối ưu hóa nguyên liệu ở cấp độ phân tử đảm bảo mỗi món ăn đạt được hương vị tối đa và hiệu quả dinh dưỡng.",
    },
    {
        icon: <Armchair className="h-12 w-12 text-cyan-400" />,
        title: "Đặt chỗ Nhanh",
        description: "Hệ thống đặt chỗ lượng tử tiên tiến với khả năng tương thích giao diện thần kinh thời gian thực để phân bổ bàn ngay lập tức.",
    },
    {
        icon: <Headset className="h-12 w-12 text-cyan-400" />,
        title: "Hỗ trợ 24/7",
        description: "Hỗ trợ AI 24/7 với khả năng tương thích liên kết để giải quyết dịch vụ khách hàng ngay lập tức.",
    },
    {
        icon: <ShieldCheck className="h-12 w-12 text-cyan-400" />,
        title: "Mã hóa Lượng tử",
        description: "Mã hóa lượng tử cấp quân sự bảo vệ tất cả các giao dịch dữ liệu và luồng thông tin cá nhân.",
    },
    {
        icon: <Truck className="h-12 w-12 text-cyan-400" />,
        title: "Giao hàng",
        description: "Hệ thống giao hàng lượng tử đảm bảo vận chuyển thực phẩm gần như tức thời qua mạng.",
    },
    {
        icon: <HandHelping className="h-12 w-12 text-cyan-400" />,
        title: "Hỗ trợ",
        description: "Đại lý hỗ trợ AI được tăng cường mạng cung cấp trợ giúp thời gian thực thông qua các giao thức giao diện nhận thức trực tiếp.",
    },
    {
        icon: <Gem className="h-12 w-12 text-cyan-400" />,
        title: "DỊCH VỤ",
        description: "Các giao thức dịch vụ cao cấp được tăng cường lượng tử mang lại trải nghiệm vượt ra ngoài giới hạn không gian-thời gian thông thường.",
    },
];

// Animation
const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            type: "spring" as const,
            stiffness: 100,
            damping: 10,
        },
    }),
    hover: {
        y: -10,
        scale: 1.05,
        transition: {
            duration: 0.3,
            type: "spring" as const,
            stiffness: 400,
            damping: 10
        }
    }
};

export default function ServicePage() {
    return (
        <div className="w-full bg-[#0a0a0f] min-h-screen">
            {/* Hero Header */}
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
                            DỊCH VỤ
                        </span>
                    </h1>
                    <p className="text-cyan-300 text-lg mb-4 font-mono">MẠNG LƯỚI DỊCH VỤ </p>
                    <nav aria-label="breadcrumb" className="mt-2">
                        <ol className="flex justify-center items-center space-x-2 text-sm uppercase font-mono">
                            <li className="flex items-center">
                                <Link href="/" className="text-cyan-300 hover:text-cyan-100 transition-colors duration-300">
                                    HỆ THỐNG CHÍNH
                                </Link>
                                <span className="mx-2 text-cyan-500">/</span>
                            </li>
                            <li className="text-cyan-100 font-semibold">MẠNG LƯỚI DỊCH VỤ</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-7xl px-4 py-20">
                <div className="text-center mb-16 relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                    <h5 className="font-mono text-2xl text-cyan-400 mb-4 tracking-wider">GIAO THỨC</h5>
                    <h2 className="text-5xl font-bold text-white mb-6">
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            MẠNG LƯỚI DỊCH VỤ TRỰC TUYẾN
                        </span>
                    </h2>
                    <p className="text-cyan-200 text-lg max-w-2xl mx-auto font-mono">
                        Giao thức dịch vụ đã được kích hoạt. Tất cả hệ thống hoạt động bình thường.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.title}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                        >
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-[#0f0f1a] border border-cyan-500/30 backdrop-blur-lg h-full text-center group-hover:border-cyan-400/50 transition-all duration-300 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                                    <CardHeader className="items-center pt-8 pb-4">
                                        <motion.div
                                            className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all duration-300"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {service.icon}
                                        </motion.div>
                                    </CardHeader>
                                    <CardContent className="pb-8">
                                        <CardTitle className="mb-4 text-lg font-mono text-cyan-300">
                                            {service.title}
                                        </CardTitle>
                                        <p className="text-cyan-200/80 text-sm font-mono leading-relaxed">
                                            {service.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Status Panel */}
                <div className="mt-16 p-6 bg-black/50 border border-cyan-500/30 rounded-2xl backdrop-blur-lg">
                    <div className="text-center">
                        <h3 className="font-mono text-cyan-400 text-xl mb-4">Trạng thái hệ thống: Trực tuyến</h3>
                        <div className="flex justify-center items-center space-x-4 text-sm font-mono">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-cyan-300">LÕI LƯỢNG TỬ: HOẠT ĐỘNG</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-cyan-300">MẠNG: ỔN ĐỊNH</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-cyan-300">DỊCH VỤ: TỐI ƯU</span>
                            </div>
                        </div>
                    </div>
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