// ChatPopup.placeholder.tsx
'use client';
import React, { useState } from 'react';

export default function ChatPopupPlaceholder() {
    const [isOpen, setIsOpen] = useState(false);

    if (isOpen) {
        return (
            <div
                className="fixed bottom-0 right-5 w-80 h-96 bg-[#0a0a0f]/90 backdrop-blur-xl border border-cyan-500/30 rounded-t-lg shadow-2xl shadow-cyan-500/20 z-50 flex flex-col"
                style={{
                    borderRadius: '12px 12px 0 0',
                }}
            >
                <div
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white p-4 flex justify-between items-center rounded-t-lg border-b border-cyan-400/30"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="font-mono font-bold">NEURAL CHAT INTERFACE</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-none border-none text-white text-xl cursor-pointer hover:text-cyan-300 transition-colors"
                    >
                        ╳
                    </button>
                </div>
                <div className="flex-1 p-6 text-center flex flex-col items-center justify-center bg-gradient-to-b from-cyan-500/5 to-transparent">
                    <div className="text-4xl mb-4">🌀</div>
                    <p className="text-cyan-300 font-mono text-sm mb-2">SYSTEM INITIALIZING</p>
                    <p className="text-cyan-400/60 text-xs font-mono">Chat protocols under development</p>
                    <div className="mt-4 w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 px-5 rounded-full cursor-pointer shadow-2xl shadow-cyan-500/30 z-50 flex items-center gap-2 border border-cyan-400/50 hover:scale-105 transition-all duration-300 group"
        >
            <div className="relative">
                <div className="text-lg">💬</div>
                <div className="absolute -inset-1 bg-cyan-400/20 blur-sm rounded-full group-hover:bg-cyan-400/30 transition-all"></div>
            </div>
            <span className="font-mono text-sm font-bold">NEURAL CHAT</span>
        </div>
    );
}