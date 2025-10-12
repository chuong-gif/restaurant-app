// packages/web-client/src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 mt-12">
            <div className="container mx-auto px-4 py-10">
                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Cột 1: Về nhà hàng */}
                    <div>
                        <h4 className="font-serif text-yellow-500 text-xl mb-4">Về nhà hàng</h4>
                        <div className="flex flex-col space-y-2">
                            <Link to="/about" className="hover:text-yellow-400">Về chúng tôi</Link>
                            <Link to="/contact" className="hover:text-yellow-400">Liên hệ</Link>
                            <Link to="/service" className="hover:text-yellow-400">Dịch vụ</Link>
                        </div>
                    </div>

                    {/* Cột 2: Thông tin liên lạc */}
                    <div>
                        <h4 className="font-serif text-yellow-500 text-xl mb-4">Thông tin liên lạc</h4>
                        <p className="mb-2">📍 Quận Ninh Kiều, TP.Cần Thơ</p>
                        <p className="mb-2">📞 0123.546.789</p>
                        <p className="mb-2">✉️ contact.restaurant@gmail.com</p>
                    </div>

                    {/* Cột 3: Giờ mở cửa */}
                    <div>
                        <h4 className="font-serif text-yellow-500 text-xl mb-4">Giờ mở cửa</h4>
                        <h5 className="font-semibold text-white">Thứ Hai - Thứ Sáu</h5>
                        <p>8:00 - 22:00</p>
                        <h5 className="font-semibold text-white mt-2">Thứ Bảy - Chủ Nhật</h5>
                        <p>10:00 - 23:00</p>
                    </div>

                    {/* Cột 4: Liên hệ nhanh */}
                    <div>
                        <h4 className="font-serif text-yellow-500 text-xl mb-4">Liên hệ nhanh</h4>
                        <p>Nếu có thắc mắc hoặc muốn nhận thêm ưu đãi...</p>
                        {/* Form */}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 mt-8 py-6">
                <div className="container mx-auto px-4 text-center md:flex md:justify-between">
                    <p>&copy; Fast Restaurant, All Right Reserved.</p>
                    <div className="flex justify-center gap-4 mt-4 md:mt-0">
                        <Link to="/" className="hover:text-yellow-400">Trang chủ</Link>
                        <Link to="/menu" className="hover:text-yellow-400">Thực đơn</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;