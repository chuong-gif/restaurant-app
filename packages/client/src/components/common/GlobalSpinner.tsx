// GlobalSpinner.tsx
'use client';
import React from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';

export default function GlobalSpinner() {
    const { isLoading } = useGlobalStore();
    if (!isLoading) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-xl"
        >
            <div className="text-center space-y-6">
                <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent shadow-lg shadow-cyan-500/30"></div>
                    <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg shadow-purple-500/30" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                    <div className="absolute inset-2 h-12 w-12 animate-pulse rounded-full bg-cyan-500/20"></div>
                </div>
                <div className="space-y-2">
                    <p className="text-cyan-300 font-mono text-sm">SYSTEM LOADING</p>
                    <div className="w-32 h-1 bg-cyan-500/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse"></div>
                    </div>
                    <p className="text-cyan-400/60 text-xs font-mono">Initializing neural networks...</p>
                </div>
            </div>
        </div>
    );
}