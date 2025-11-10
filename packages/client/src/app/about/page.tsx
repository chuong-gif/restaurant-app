// packages/client/src/app/about/page.tsx
import React from 'react';
import Link from 'next/link';
import AboutSection from '@/components/home/AboutSection';
import TeamSection from '@/components/home/TeamSection';

export default function AboutPage() {
    return (
        <div className="w-full bg-[#0a0a0f] min-h-screen">
            {/* Hero Header */}
            <div className="w-full py-28 bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center mb-16">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-cyan-500/10"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

                <div className="text-center text-white relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                        SYSTEM_ABOUT
                    </h1>
                    <nav aria-label="breadcrumb" className="mt-4">
                        <ol className="flex justify-center items-center space-x-4 font-mono text-sm tracking-wider">
                            <li className="flex items-center">
                                <Link href="/" className="text-cyan-300/70 hover:text-cyan-400 transition-colors hover:tracking-widest">
                                    HOME_NODE
                                </Link>
                                <span className="mx-2 text-cyan-400/50">/</span>
                            </li>
                            <li className="text-cyan-400 font-semibold" aria-current="page">
                                ABOUT_SYSTEM
                            </li>
                        </ol>
                    </nav>
                </div>

                {/* Scanning line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50 animate-pulse"></div>
            </div>

            {/* Main Content */}
            <AboutSection />
            <TeamSection />
        </div>
    );
}