// HeroSection.tsx
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
    const variants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };
    const pathname = usePathname();

    const navLinkClass = "bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-500 hover:to-purple-500 border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40";

    return (
        <div className="w-full bg-[#0a0a0f] text-white py-20 md:py-32 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

            <div className="container mx-auto max-w-7xl px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Column */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, staggerChildren: 0.2 }}
                        className="text-center lg:text-left"
                    >
                        <motion.h1
                            variants={variants}
                            className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-gradient"
                        >
                            NEURAL_CUISINE_ACTIVATED
                        </motion.h1>
                        <motion.p
                            variants={variants}
                            className="mt-6 text-lg text-cyan-100/80 leading-relaxed"
                        >
                            <span className="text-cyan-400 font-mono">SYSTEM_READY</span> - Khám phá hành trình ẩm thực châu Á đầy màu sắc. Với menu phong phú, từ những món ăn truyền thống đến những biến tấu mới lạ, chúng tôi mang đến cho thực khách những trải nghiệm ẩm thực độc đáo.
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
                                    INITIATE_BOOKING_PROTOCOL
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.7, type: "spring" }}
                        className="flex justify-center lg:justify-end relative"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                            <Image
                                src="/images/home/hero.png"
                                alt="Món ăn đặc sắc"
                                width={500}
                                height={500}
                                className="rounded-full object-cover w-[300px] h-[300px] md:w-[500px] md:h-[500px] border-4 border-cyan-500/50 shadow-2xl shadow-cyan-500/30 relative z-10 hover:border-cyan-400/80 hover:shadow-cyan-400/40 transition-all duration-500"
                            />
                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50"></div>
                            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s linear infinite;
                }
            `}</style>
        </div>
    );
}