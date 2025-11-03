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
            className={`back-to-top z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-black transition-opacity
        ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <i className="fa fa-arrow-up"></i>
        </a>
    );
}