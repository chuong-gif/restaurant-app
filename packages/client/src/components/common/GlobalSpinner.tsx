'use client';
import React from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';

export default function GlobalSpinner() {
    const { isLoading } = useGlobalStore();
    if (!isLoading) return null;

    return (
        <div
            id="spinner"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm"
        >
            <div
                className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}