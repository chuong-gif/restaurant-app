// BackToTop.tsx
'use client';
import React, { useEffect, useState } from 'react';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <a
            href="#"
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600 to-purple-600 
                       border border-cyan-400/50 text-white shadow-2xl shadow-cyan-500/30 transition-all duration-500 hover:scale-110 hover:shadow-cyan-400/40
                       ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="relative">
                <div className="text-lg font-bold">↑</div>
                <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/30"></div>
            </div>
            <div className="absolute -inset-1 bg-cyan-500/20 blur-md rounded-full"></div>
        </a>
    );
}