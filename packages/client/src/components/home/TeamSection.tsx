// packages/client/src/components/home/TeamSection.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Dữ liệu từ About.js 
const teamMembers = [
    { name: 'Ngô Văn Chương', role: 'Nhóm Trưởng', img: '/images/team/team-1.jpg' },
    { name: 'Nguyễn Văn An', role: 'Thành Viên', img: '/images/team/team-2.jpg' },
    { name: 'Hồ Sĩ Tuấn Đạt', role: 'Thành Viên', img: '/images/team/team-3.jpg' },
    { name: 'Đình Anh lộc', role: 'Thành Viên', img: '/images/team/team-4.jpg' },
];

export default function TeamSection() {
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
        <div className="bg-gray-50/50">
            <div className="container mx-auto max-w-7xl px-4 py-20">
                <div className="text-center mb-12">
                    <h5 className="font-secondary text-2xl text-primary">Thành Viên</h5>
                    <h2 className="text-4xl font-semibold">Đội Ngũ Đầu Bếp</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            key={member.name}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            variants={cardVariants}
                        >
                            <Card className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                                <div className="overflow-hidden">
                                    {/* === ẢNH GIỮ CHỖ ===
                      Vui lòng thêm 4 ảnh của bạn vào:
                      /public/images/team/team-1.jpg (đến 4)
                  ====================== */}
                                    <Image
                                        src={member.img}
                                        alt={member.name}
                                        width={300}
                                        height={300}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h5 className="text-lg font-semibold">{member.name}</h5>
                                    <small className="text-muted-foreground">{member.role}</small>
                                    {/* Social media icons (nếu cần) */}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}