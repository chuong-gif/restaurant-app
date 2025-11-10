// packages/client/src/components/home/ServiceSection.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, UtensilsCrossed, Armchair, Headset } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
    {
        icon: <UserCog className="h-12 w-12" />,
        title: "AI Chef Network",
        description: "Neural network-trained chefs with 5+ years of experience delivering optimal culinary solutions.",
    },
    {
        icon: <UtensilsCrossed className="h-12 w-12" />,
        title: "Quantum Fresh Ingredients",
        description: "Each dish is processed with quantum-preserved ingredients ensuring maximum flavor integrity.",
    },
    {
        icon: <Armchair className="h-12 w-12" />,
        title: "Instant Reservation Protocol",
        description: "Secure your table through our neural booking system. Dishes are pre-optimized upon arrival.",
    },
    {
        icon: <Headset className="h-12 w-12" />,
        title: "24/7 Support Matrix",
        description: "Our support neural network is always online. Connect instantly for immediate assistance.",
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
                    <h5 className="font-mono text-cyan-400 text-lg tracking-wider mb-4">SERVICE_MATRIX_ACTIVE</h5>
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Cybernetic Services
                    </h2>
                    <p className="text-cyan-200/60 max-w-2xl mx-auto">
                        Our integrated service network ensures optimal dining experience through advanced protocols
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