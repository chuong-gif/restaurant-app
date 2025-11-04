// packages/client/src/components/home/ServiceSection.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, UtensilsCrossed, Armchair, Headset } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
    {
        icon: <UserCog className="h-10 w-10 text-primary" />, // Sửa ở đây
        title: "Đầu bếp kinh nghiệm",
        description: "Đầu bếp hơn 5 năm kinh nghiệm, mang đến những món ăn hảo hạng và đậm chất Việt Nam.",
    },
    {
        icon: <UtensilsCrossed className="h-10 w-10 text-primary" />,
        title: "Nguyên liệu tươi ngon",
        description: "Mỗi món ăn đều được chế biến từ những nguyên liệu tươi ngon nhất, đảm bảo chất lượng.",
    },
    {
        icon: <Armchair className="h-10 w-10 text-primary" />, // Sửa ở đây
        title: "Đặt bàn nhanh chóng",
        description: "Đặt bàn dễ dàng chỉ với vài cú click. Món ăn sẽ sẵn sàng khi bạn đến nơi.",
    },
    {
        icon: <Headset className="h-10 w-10 text-primary" />,
        title: "Phục vụ 24/7",
        description: "Chúng tôi luôn sẵn sàng phục vụ quý khách 24/7. Liên hệ ngay để được tư vấn.",
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
        <div className="container mx-auto max-w-7xl px-4 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, i) => (
                    <motion.div
                        key={service.title}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={cardVariants}
                    >
                        <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                            <CardHeader className="items-center">
                                <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                                    {service.icon}
                                </div>
                            </CardHeader>
                            <CardContent className="text-center">
                                <CardTitle className="mb-3 text-lg">{service.title}</CardTitle>
                                <p className="text-muted-foreground text-sm">{service.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}