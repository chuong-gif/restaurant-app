import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <div className="bg-dark text-light pt-12 mt-12">
            <div className="container mx-auto max-w-7xl px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Col 1: Về nhà hàng */}
                    <div>
                        <h4 className="font-secondary text-xl text-primary mb-4">Về nhà hàng</h4>
                        <div className="flex flex-col gap-2">
                            <Link href="/about" className="hover:text-primary transition-colors">Về chúng tôi</Link>
                            <Link href="/contact" className="hover:text-primary transition-colors">Liên hệ</Link>
                            <Link href="/service" className="hover:text-primary transition-colors">Dịch vụ</Link>
                            <Link href="/policy" className="hover:text-primary transition-colors">Chính sách</Link>
                        </div>
                    </div>
                    {/* Col 2: Thông tin */}
                    <div>
                        <h4 className="font-secondary text-xl text-primary mb-4">Thông tin</h4>
                        <div className="flex flex-col gap-2">
                            <p className="flex items-center gap-3"><i className="fa fa-map-marker-alt"></i>Phường Quả Đất, Hệ Mặt Trời</p>
                            <p className="flex items-center gap-3"><i className="fa fa-phone-alt"></i>0123.546.789</p>
                            <p className="flex items-center gap-3"><i className="fa fa-envelope"></i>contact.envisi@gmail.com</p>
                            <div className="d-flex pt-2 gap-2">
                                <a className="h-9 w-9 flex items-center justify-center border border-light rounded-full hover:bg-primary hover:border-primary transition-colors" href="#">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a className="h-9 w-9 flex items-center justify-center border border-light rounded-full hover:bg-primary hover:border-primary transition-colors" href="#">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Col 3: Giờ mở cửa */}
                    <div>
                        <h4 className="font-secondary text-xl text-primary mb-4">Giờ mở cửa</h4>
                        <h5 className="font-semibold">Thứ Hai - Thứ Sáu</h5>
                        <p>8:00 - 22:00</p>
                        <h5 className="font-semibold">Thứ Bảy - Chủ Nhật</h5>
                        <p>10:00 - 23:00</p>
                    </div>
                    {/* Col 4: Liên hệ nhanh */}
                    <div>
                        <h4 className="font-secondary text-xl text-primary mb-4">Liên hệ nhanh</h4>
                        <p>Nếu có thắc mắc hoặc muốn nhận thêm ưu đãi hãy liên hệ ngay.</p>
                        {/* Input (sẽ dùng shadcn/ui sau) */}
                    </div>
                </div>
            </div>
            {/* Copyright */}
            <div className="container mx-auto max-w-7xl px-4 py-6 border-t border-gray-700">
                <div className="flex flex-col md:flex-row justify-between text-center md:text-start">
                    <div className="mb-3 md:mb-0">
                        &copy; <a className="border-b" href="#">EnViSi Restaurant</a>, All Right Reserved.
                    </div>
                    <div className="flex justify-center gap-4">
                        <Link href="/">Trang chủ</Link>
                        <Link href="/menu">Thực đơn</Link>
                        <Link href="/blog">Tin tức</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}