// packages/client/src/app/booking/layout.tsx
'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const steps = [
    { path: '/booking', label: 'DATA_INPUT' },
    { path: '/booking/select', label: 'SELECT_TABLE_FOOD' },
    { path: '/booking/confirm', label: 'CONFIRMATION' },
];

export default function BookingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const activeIndex = steps.findIndex(step => step.path === pathname);

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
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
                        Hệ thống đặt chỗ
                    </h1>
                    <nav aria-label="breadcrumb" className="mt-4">
                        <ol className="flex justify-center items-center space-x-4 font-mono text-sm tracking-wider">
                            <li className="flex items-center">
                                <Link href="/" className="text-cyan-300/70 hover:text-cyan-400 transition-colors hover:tracking-widest">
                                    TRANG CHỦ
                                </Link>
                                <span className="mx-2 text-cyan-400/50">/</span>
                            </li>
                            <li className="text-cyan-400 font-semibold" aria-current="page">
                                QUY TRÌNH ĐẶT CHỖ
                            </li>
                        </ol>
                    </nav>
                </div>

                {/* Scanning line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50 animate-pulse"></div>
            </div>

            {/* Progress Steps - Futuristic Style */}
            <div className="container mx-auto max-w-4xl px-4 text-center my-16 relative z-10">
                <div className="cyber-progress-steps">
                    {steps.map((step, index) => {
                        const isActive = index === activeIndex;
                        const isCompleted = index < activeIndex;

                        return (
                            <div
                                key={step.path}
                                className={`cyber-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                            >
                                <div className="cyber-step-connector"></div>
                                <div className="cyber-step-content">
                                    <div className={`cyber-step-circle ${isActive ? 'pulse' : ''}`}>
                                        <span className="cyber-step-number">{index + 1}</span>
                                        {isCompleted && (
                                            <div className="cyber-step-check">
                                                <div className="cyber-check-icon"></div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="cyber-step-label font-mono tracking-wider">{step.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="container-xxl pb-20 px-4 relative z-10">
                {children}
            </div>

            <style jsx>{`
                .cyber-progress-steps {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                }

                .cyber-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex: 1;
                    position: relative;
                }

                .cyber-step-connector {
                    position: absolute;
                    top: 24px;
                    left: -50%;
                    right: 50%;
                    height: 3px;
                    background: linear-gradient(90deg, 
                        rgba(0, 255, 255, 0.3) 0%, 
                        rgba(138, 43, 226, 0.3) 100%);
                    z-index: 1;
                    transition: all 0.5s ease;
                }

                .cyber-step:first-child .cyber-step-connector {
                    display: none;
                }

                .cyber-step.completed .cyber-step-connector {
                    background: linear-gradient(90deg, 
                        rgba(0, 255, 255, 0.8) 0%, 
                        rgba(138, 43, 226, 0.8) 100%);
                    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                }

                .cyber-step-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    z-index: 2;
                }

                .cyber-step-circle {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(0, 255, 255, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    transition: all 0.5s ease;
                    backdrop-filter: blur(10px);
                }

                .cyber-step.active .cyber-step-circle {
                    border-color: rgba(0, 255, 255, 0.8);
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                    background: rgba(0, 255, 255, 0.1);
                }

                .cyber-step.completed .cyber-step-circle {
                    border-color: rgba(0, 255, 255, 0.8);
                    background: rgba(0, 255, 255, 0.2);
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
                }

                .cyber-step-number {
                    color: rgba(0, 255, 255, 0.7);
                    font-weight: bold;
                    font-family: monospace;
                    transition: all 0.5s ease;
                }

                .cyber-step.active .cyber-step-number {
                    color: rgba(0, 255, 255, 1);
                    text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
                }

                .cyber-step.completed .cyber-step-number {
                    opacity: 0;
                }

                .cyber-step-check {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }

                .cyber-step.completed .cyber-step-check {
                    opacity: 1;
                }

                .cyber-check-icon {
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(45deg, #00ffff, #8a2be2);
                    clip-path: polygon(45% 64%, 82% 36%, 100% 58%, 45% 100%, 0 70%, 15% 55%);
                }

                .cyber-step-label {
                    margin-top: 12px;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.875rem;
                    transition: all 0.5s ease;
                }

                .cyber-step.active .cyber-step-label {
                    color: rgba(0, 255, 255, 1);
                    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                }

                .cyber-step.completed .cyber-step-label {
                    color: rgba(0, 255, 255, 0.9);
                }

                .pulse {
                    animation: cyber-pulse 2s infinite;
                }

                @keyframes cyber-pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(0, 255, 255, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(0, 255, 255, 0);
                    }
                }
            `}</style>
        </div>
    );
}