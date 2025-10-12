// packages/web-client/src/components/home/ServicesSection.tsx
import React from 'react';

// Dữ liệu cho các dịch vụ
const services = [
    { icon: 'fa-user-tie', title: 'Đầu bếp nhiều năm kinh nghiệm', description: 'Đầu bếp của chúng tôi với hơn 5 năm kinh nghiệm, sẽ luôn mang đến cho quý khách những món ăn hảo hạng và đậm chất Việt Nam.' },
    { icon: 'fa-utensils', title: 'Nguyên liệu tươi ngon nhất', description: 'Mỗi món ăn tại nhà hàng đều được chế biến từ những nguyên liệu tươi ngon nhất, đảm bảo hương vị thơm ngon và chất lượng.' },
    { icon: 'fa-chair', title: 'Đặt bàn dễ dàng, nhanh chóng', description: 'Đặt bàn dễ dàng chỉ với vài cú click. Món ăn sẽ nhanh chóng được phục vụ khi khách hàng đến nơi.' },
    { icon: 'fa-headset', title: 'Phục vụ tận tình, xuyên suốt 24/7', description: 'Chúng tôi luôn sẵn sàng phục vụ quý khách 24/7. Liên hệ ngay để được tư vấn dịch vụ nhà hàng và đặt bàn.' },
];

// Component con cho mỗi item dịch vụ
const ServiceItem: React.FC<typeof services[0]> = ({ icon, title, description }) => (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform duration-300 hover:-translate-y-2">
        <i className={`fa fa-3x ${icon} text-yellow-500 mb-4`}></i>
        <h5 className="text-xl font-semibold mb-2">{title}</h5>
        <p className="text-gray-600">{description}</p>
    </div>
);

const ServicesSection: React.FC = () => {
    return (
        <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <ServiceItem key={index} {...service} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesSection;