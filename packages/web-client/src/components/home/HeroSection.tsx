// packages/web-client/src/components/home/HeroSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/hero.png'; // Giả sử bạn đã copy ảnh vào src/assets/images

const HeroSection: React.FC = () => {
    return (
        <div className="bg-gray-900">
            <div className="container mx-auto px-4 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            NHỮNG MÓN ĂN NGON SẴN SÀN PHỤC VỤ THỰC KHÁCH
                        </h1>
                        <p className="text-gray-300 mt-4 mb-8">
                            Khám phá hành trình ẩm thực châu Á đầy màu sắc. Với menu phong phú, từ những món ăn truyền thống đến những biến tấu mới lạ, chúng tôi mang đến cho thực khách những trải nghiệm ẩm thực độc đáo.
                        </p>
                        <Link
                            to="/booking"
                            className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-600 transition duration-300"
                        >
                            Đặt bàn ngay
                        </Link>
                    </div>
                    <div className="text-center lg:text-right">
                        <img src={heroImage} alt="Hero" className="max-w-full h-auto mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;