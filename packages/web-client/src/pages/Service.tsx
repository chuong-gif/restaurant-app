import React from 'react';
import { ChefHat, Truck, HeartHandshake, Gem } from 'lucide-react';

// Dữ liệu mẫu cho các dịch vụ
const services = [
    {
        icon: <ChefHat size={48} className="text-yellow-500 mb-4" />,
        title: 'Đầu bếp hàng đầu',
        description: 'Đội ngũ đầu bếp của chúng tôi là những chuyên gia dày dặn kinh nghiệm, luôn sáng tạo để mang đến những món ăn tuyệt hảo.'
    },
    {
        icon: <Truck size={48} className="text-yellow-500 mb-4" />,
        title: 'Giao hàng nhanh chóng',
        description: 'Dịch vụ giao hàng tận nơi đảm bảo món ăn đến tay bạn vẫn còn nóng hổi, thơm ngon như dùng tại nhà hàng.'
    },
    {
        icon: <HeartHandshake size={48} className="text-yellow-500 mb-4" />,
        title: 'Hỗ trợ tận tình',
        description: 'Đội ngũ nhân viên luôn sẵn sàng lắng nghe và phục vụ, mang đến cho bạn trải nghiệm thoải mái và hài lòng nhất.'
    },
    {
        icon: <Gem size={48} className="text-yellow-500 mb-4" />,
        title: 'Chất lượng cao cấp',
        description: 'Chúng tôi cam kết sử dụng những nguyên liệu tươi ngon nhất, đảm bảo chất lượng và an toàn cho mỗi món ăn.'
    }
];

const Service: React.FC = () => {
    return (
        <div className="bg-gray-900 text-white">
            {/* Hero Header */}
            <div className="py-24 bg-gray-800 text-center">
                <h1 className="text-5xl font-bold mb-4">Dịch Vụ Của Chúng Tôi</h1>
                <p className="text-gray-300">Luôn tận tâm vì trải nghiệm của bạn</p>
            </div>

            {/* Services Section */}
            <div className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-gray-800 text-center p-8 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-yellow-500/10"
                            >
                                {service.icon}
                                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                <p className="text-gray-400">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Service;