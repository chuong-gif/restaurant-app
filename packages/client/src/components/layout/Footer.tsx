// Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <div className="bg-[#0a0a0f] text-cyan-100 pt-16 mt-16 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-purple-500/5"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

            <div className="container mx-auto max-w-7xl px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Col 1: About Restaurant */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                        <h4 className="font-mono text-cyan-400 text-lg tracking-wider mb-6">Các Mục Chính</h4>
                        <div className="flex flex-col gap-4">
                            <Link href="/about" className="hover:text-cyan-400 transition-all duration-300 font-mono text-sm tracking-wider group">
                                <span className="group-hover:tracking-widest transition-all">Về Chúng Tôi</span>
                            </Link>
                            <Link href="/contact" className="hover:text-cyan-400 transition-all duration-300 font-mono text-sm tracking-wider group">
                                <span className="group-hover:tracking-widest transition-all">Liên Hệ Vời Chúng Tôi</span>
                            </Link>
                            <Link href="/service" className="hover:text-cyan-400 transition-all duration-300 font-mono text-sm tracking-wider group">
                                <span className="group-hover:tracking-widest transition-all">Dịch Vụ</span>
                            </Link>
                            <Link href="/policy" className="hover:text-cyan-400 transition-all duration-300 font-mono text-sm tracking-wider group">
                                <span className="group-hover:tracking-widest transition-all">SECURITY_PROTOCOL</span>
                            </Link>
                        </div>
                    </div>

                    {/* Col 2: Information */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                        <h4 className="font-mono text-cyan-400 text-lg tracking-wider mb-6">Thông Tin Liên Hệ</h4>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-cyan-500/40 transition-all">
                                    <i className="fa fa-map-marker-alt text-cyan-400 text-sm"></i>
                                </div>
                                <span className="font-mono text-sm">Phường Trái Đất, Hệ Mặt Trời</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-cyan-500/40 transition-all">
                                    <i className="fa fa-phone-alt text-cyan-400 text-sm"></i>
                                </div>
                                <span className="font-mono text-sm">0123.546.789</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-cyan-500/40 transition-all">
                                    <i className="fa fa-envelope text-cyan-400 text-sm"></i>
                                </div>
                                <span className="font-mono text-sm">CONTACT.ENVISI@GMAIL.COM</span>
                            </div>
                            <div className="flex pt-4 gap-3">
                                <a className="h-10 w-10 flex items-center justify-center border border-cyan-500/50 rounded-full hover:bg-cyan-500 hover:border-cyan-400 hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40" href="#">
                                    <i className="fab fa-facebook-f text-cyan-400 hover:text-[#0a0a0f] transition-colors"></i>
                                </a>
                                <a className="h-10 w-10 flex items-center justify-center border border-purple-500/50 rounded-full hover:bg-purple-500 hover:border-purple-400 hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40" href="#">
                                    <i className="fab fa-youtube text-purple-400 hover:text-[#0a0a0f] transition-colors"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Col 3: Opening Hours */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                        <h4 className="font-mono text-cyan-400 text-lg tracking-wider mb-6">Thời Gian Làm Việc</h4>
                        <div className="space-y-4">
                            <div className="border-l-4 border-cyan-400 pl-4 hover:border-cyan-300 transition-colors">
                                <h5 className="font-mono text-cyan-300 text-sm tracking-wider">Thứ Hai - Thứ Sáu</h5>
                                <p className="font-mono text-cyan-100/80 text-sm">8:00 - 22:00</p>
                            </div>
                            <div className="border-l-4 border-purple-400 pl-4 hover:border-purple-300 transition-colors">
                                <h5 className="font-mono text-purple-300 text-sm tracking-wider">Thứ Bảy - Chủ Nhật</h5>
                                <p className="font-mono text-cyan-100/80 text-sm">10:00 - 23:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Col 4: Quick Contact */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                        <h4 className="font-mono text-cyan-400 text-lg tracking-wider mb-6">Liên Hệ</h4>
                        <p className="text-cyan-100/70 mb-6 font-mono text-sm leading-relaxed">
                            Để góp ý hoặc đặt câu hỏi nhanh, vui lòng sử dụng hộp liên hệ bên dưới. Chúng tôi luôn sẵn sàng hỗ trợ bạn!
                        </p>
                        {/* Input placeholder with futuristic style */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            <input
                                type="text"
                                placeholder="Nhập ở đây ..."
                                className="relative w-full bg-[#0a0a0f] border border-cyan-500/30 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="container mx-auto max-w-7xl px-4 py-8 border-t border-cyan-500/30 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-start gap-4">
                    <div className="mb-3 md:mb-0 font-mono text-cyan-400/70 text-sm">
                        &copy; <a className="border-b border-cyan-400/50 hover:border-cyan-400 transition-colors" href="#">Nhà Hàng ENVISI</a>, QUYỀN HỆ THỐNG ĐƯỢC BẢO LƯU.
                    </div>
                    <div className="flex justify-center gap-6 font-mono text-sm">
                        <Link href="/" className="text-cyan-400/70 hover:text-cyan-400 transition-colors hover:tracking-widest">
                            Trang Chủ
                        </Link>
                        <Link href="/menu" className="text-cyan-400/70 hover:text-cyan-400 transition-colors hover:tracking-widest">
                            Thực Đơn
                        </Link>
                        <Link href="/blog" className="text-cyan-400/70 hover:text-cyan-400 transition-colors hover:tracking-widest">
                            Blog
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom scanning line */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/30 animate-pulse"></div>
        </div>
    );
}