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
        icon: <UserCog className="h-10 w-10 text-primary" />,
        title: "Đầu bếp hàng đầu",
        description: "Đội ngũ đầu bếp của chúng tôi là những chuyên gia giàu kinh nghiệm, mang đến những món ăn độc đáo và hấp dẫn.",
    },
    {
        icon: <UtensilsCrossed className="h-10 w-10 text-primary" />,
        title: "Thức ăn chất lượng",
        description: "Chúng tôi sử dụng nguyên liệu tươi ngon nhất để đảm bảo mỗi món ăn đều đạt chuẩn chất lượng cao nhất.",
    },
    {
        icon: <Armchair className="h-10 w-10 text-primary" />,
        title: "Đặt bàn trực tuyến",
        description: "Dễ dàng đặt món ăn yêu thích của bạn thông qua hệ thống trực tuyến của chúng tôi, nhanh chóng và tiện lợi.",
    },
    {
        icon: <Headset className="h-10 w-10 text-primary" />,
        title: "Dịch vụ 24/7",
        description: "Chúng tôi luôn sẵn sàng phục vụ bạn mọi lúc, mọi nơi, với dịch vụ khách hàng 24/7. Hỗ trợ chat trực tuyến.",
    },
    {
        icon: <ShieldCheck className="h-10 w-10 text-primary" />,
        title: "An toàn và bảo mật",
        description: "Chúng tôi cam kết cung cấp các dịch vụ an toàn và bảo mật, đảm bảo thông tin cá nhân của bạn được bảo vệ.",
    },
    {
        icon: <Truck className="h-10 w-10 text-primary" />,
        title: "Giao hàng nhanh chóng",
        description: "Dịch vụ giao hàng của chúng tôi đảm bảo bạn nhận được sản phẩm của mình một cách nhanh chóng và đúng thời gian.",
    },
    {
        icon: <HandHelping className="h-10 w-10 text-primary" />,
        title: "Hỗ trợ tận tình",
        description: "Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn với bất kỳ câu hỏi hay vấn đề nào bạn gặp phải.",
    },
    {
        icon: <Gem className="h-10 w-10 text-primary" />,
        title: "Dịch vụ cao cấp",
        description: "Chúng tôi cung cấp các dịch vụ cao cấp với chất lượng vượt trội, mang đến trải nghiệm tốt nhất cho khách hàng.",
    },
];

// Animation
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

export default function ServicePage() {
    return (
        <div className="w-full">
            {/* Hero Header [cite: 7-20] */}
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-secondary">Dịch vụ</h1>
                    <nav aria-label="breadcrumb" className="mt-2">
                        <ol className="breadcrumb justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Dịch vụ</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content [cite: 21-86] */}
            <div className="container mx-auto max-w-7xl px-4 py-20">
                <div className="text-center mb-12">
                    <h5 className="font-secondary text-2xl text-primary">Dịch vụ của chúng tôi</h5>
                    <h2 className="text-4xl font-semibold">Khám phá các dịch vụ</h2>
                </div>
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
                            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 group text-center">
                                <CardHeader className="items-center">
                                    <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                                        {service.icon}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="mb-3 text-lg">{service.title}</CardTitle>
                                    <p className="text-muted-foreground text-sm">{service.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}