// packages/client/src/components/home/ServiceSection.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, UtensilsCrossed, Armchair, Headset } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
    {
        icon: <UserCog className="h-12 w-12" />,
        title: "Hệ thống Đầu bếp",
        description: "Các đầu bếp được đào tạo chuyên nghiệp, với hơn 5 năm kinh nghiệm, cung cấp các giải pháp ẩm thực tối ưu.",
    },
    {
        icon: <UtensilsCrossed className="h-12 w-12" />,
        title: "Nguyên liệu tươi",
        description: "Mỗi món ăn được chế biến với nguyên liệu tươi mới đảm bảo độ nguyên vẹn hương vị tối đa.",
    },
    {
        icon: <Armchair className="h-12 w-12" />,
        title: "Đặt chỗ Nhanh",
        description: "Đặt bàn an toàn. Món ăn được tối ưu trước khi bạn đến.",
    },
    {
        icon: <Headset className="h-12 w-12" />,
        title: "Hỗ trợ 24/7",
        description: "Mạng lưới hỗ trợ của chúng tôi luôn trực tuyến. Kết nối ngay để được hỗ trợ tức thì.",
    },
];

export default function ServiceSection() {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
            },
        }),
    };

    return (
        <div className="bg-[#0a0a0f] py-20 relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid"></div>

            <div className="container mx-auto max-w-7xl px-4 relative z-10">
                <div className="text-center mb-16">
                    <h5 className="font-mono text-cyan-400 text-lg tracking-wider mb-4">Dịch Vụ Đang Hoạt Động</h5>
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Dịch vụ hỗ trợ tích hợp
                    </h2>
                    <p className="text-cyan-200/60 max-w-2xl mx-auto">
                        Mạng lưới dịch vụ tích hợp của chúng tôi đảm bảo trải nghiệm ăn uống tối ưu thông qua các giao thức tiên tiến
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.title}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                        >
                            <Card className="h-full bg-[#0a0a0f] border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500 group backdrop-blur-sm">
                                <CardHeader className="items-center pt-8">
                                    <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-500 group-hover:scale-110">
                                        <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                            {service.icon}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-center p-6">
                                    <CardTitle className="mb-4 text-lg text-cyan-100 group-hover:text-white transition-colors">
                                        {service.title}
                                    </CardTitle>
                                    <p className="text-cyan-200/70 text-sm leading-relaxed group-hover:text-cyan-200/90 transition-colors">
                                        {service.description}
                                    </p>
                                </CardContent>

                                {/* Hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg -z-10"></div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes grid {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(4rem); }
                }
                .animate-grid {
                    animation: grid 20s linear infinite;
                }
            `}</style>
        </div>
    );
}