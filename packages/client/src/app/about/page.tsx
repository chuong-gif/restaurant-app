// packages/client/src/app/about/page.tsx
import React from 'react';
import Link from 'next/link';
// Import các component đã xây dựng
import AboutSection from '@/components/home/AboutSection';
import TeamSection from '@/components/home/TeamSection';

export default function AboutPage() {
    return (
        <div className="w-full">
            {/* Hero Header [cite: 7-20] */}
            <div className="w-full py-20 bg-dark flex items-center justify-center mb-12">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-secondary">Về Chúng Tôi</h1>
                    <nav aria-label="breadcrumb" className="mt-2">
                        <ol className="breadcrumb justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Về Chúng Tôi</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <AboutSection />
            <TeamSection />
        </div>
    );
}