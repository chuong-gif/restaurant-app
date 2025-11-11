// packages/client/src/components/home/TeamSection.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Dữ liệu từ About.js 
const teamMembers = [
    { name: 'Ngô Văn Chương', role: 'Đội Trưởng', img: '/images/team/team-1.jpg' },
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
        <div className="bg-[#0a0a0f] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-cyan-500/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto max-w-7xl px-4 py-20 relative z-10">
                <div className="text-center mb-16">
                    <h5 className="font-mono text-cyan-400 text-lg tracking-wider mb-4">NHÀ HÀNG ENVISI</h5>
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Đội ngũ tạo ra trang web này
                    </h2>
                    <p className="text-cyan-200/60 max-w-2xl mx-auto">
                        Những con người đằng sau trải nghiệm ẩm thực kỹ thuật số của bạn
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            key={member.name}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                            className="relative"
                        >
                            {/* Holographic effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md group-hover:blur-xl"></div>

                            <Card className="text-center overflow-hidden bg-[#0a0a0f] border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500 group backdrop-blur-sm h-full">
                                <div className="overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10"></div>
                                    <Image
                                        src={member.img}
                                        alt={member.name}
                                        width={300}
                                        height={300}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Scanning line effect */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/50 shadow-lg shadow-cyan-400/50 animate-scan rounded-full z-20"></div>
                                </div>
                                <CardContent className="p-6 relative z-20 bg-[#0a0a0f]/90">
                                    <h5 className="text-lg font-bold text-cyan-100 group-hover:text-white transition-colors mb-2">
                                        {member.name}
                                    </h5>
                                    <small className="text-cyan-400/80 font-mono tracking-wider group-hover:text-cyan-300 transition-colors">
                                        {member.role}
                                    </small>

                                    {/* Status indicator */}
                                    <div className="flex justify-center items-center mt-4 space-x-2">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-cyan-400/70 font-mono">ONLINE</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(400%); }
                }
                .animate-scan {
                    animation: scan 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}