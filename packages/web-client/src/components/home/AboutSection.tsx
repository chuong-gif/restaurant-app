import React from 'react';
import { Link } from 'react-router-dom';
// Bạn cần copy các ảnh about-1.jpg, about-2.jpg... vào thư mục `src/assets/images`
import about1 from '../../assets/images/about-1.jpg';
import about2 from '../../assets/images/about-2.jpg';
import about3 from '../../assets/images/about-3.jpg';
import about4 from '../../assets/images/about-4.jpg';
import logo from '../../assets/images/huong-sen-logo.png';

const AboutSection: React.FC = () => {
    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="pt-8"><img className="rounded-lg shadow-lg w-full h-auto" src={about1} alt="About 1" /></div>
                        <div><img className="rounded-lg shadow-lg w-3/4 h-auto" src={about2} alt="About 2" /></div>
                        <div className="text-right"><img className="rounded-lg shadow-lg w-3/4 h-auto inline-block" src={about3} alt="About 3" /></div>
                        <div className="pt-8"><img className="rounded-lg shadow-lg w-full h-auto" src={about4} alt="About 4" /></div>
                    </div>
                    <div>
                        <h5 className="font-serif text-yellow-500 text-xl mb-2">Giới thiệu</h5>
                        <h1 className="text-4xl font-bold mb-4">CHÀO MỪNG ĐẾN VỚI</h1>
                        <div className="flex items-center mb-4">
                            <img src={logo} alt="Logo" className="h-12 mr-3" />
                            <span className="font-serif text-yellow-500 text-4xl">Ẩm Thực</span>
                        </div>
                        <p className="text-gray-600 mb-6">Với hơn 5 năm kinh nghiệm trong lĩnh vực ẩm thực, Ẩm Thực tự hào mang đến cho thực khách những món ăn ngon, độc đáo và chất lượng.</p>
                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-center border-l-4 border-yellow-500 pl-4">
                                <div>
                                    <div className="text-4xl font-bold text-yellow-500">5</div>
                                    <p className="text-gray-500 mb-0">Năm</p>
                                    <h6 className="font-semibold uppercase">Kinh Nghiệm</h6>
                                </div>
                            </div>
                            <div className="flex items-center border-l-4 border-yellow-500 pl-4">
                                <div>
                                    <div className="text-4xl font-bold text-yellow-500">20</div>
                                    <p className="text-gray-500 mb-0">Đầu Bếp</p>
                                    <h6 className="font-semibold uppercase">Nhiều Năm Kinh Nghiệm</h6>
                                </div>
                            </div>
                        </div>
                        <Link to="/about" className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-600 transition duration-300">
                            Xem thêm tại đây
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;