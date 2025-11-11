// ProtectedRoute.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import GlobalSpinner from './GlobalSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const token = useAuthStore(state => state.token);
    const [isChecking, setIsChecking] = React.useState(true);

    useEffect(() => {
        if (!token) {
            router.replace('/login');
        } else {
            setIsChecking(false);
        }
    }, [token, router]);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="h-20 w-20 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent shadow-lg shadow-cyan-500/30"></div>
                        <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg shadow-purple-500/30" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                        <div className="absolute inset-3 h-14 w-14 animate-pulse rounded-full bg-cyan-500/10"></div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-cyan-300 font-mono text-lg">SECURITY PROTOCOL</p>
                        <div className="w-48 h-1.5 bg-cyan-500/20 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse w-3/4"></div>
                        </div>
                        <p className="text-cyan-400/60 text-sm font-mono">Verifying neural identity...</p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}