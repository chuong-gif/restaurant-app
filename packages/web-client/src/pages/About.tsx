import React from 'react';
import { ChefHat, Award } from 'lucide-react';

// Import component TeamCard đã tạo trước đó
import TeamCard from '../components/home/TeamCard';

// --- Dữ liệu mẫu (sau này bạn sẽ lấy từ API) ---
const teamMembers = [
    { image: '/uploads/team-1.jpg', name: 'Nguyễn Văn A', designation: 'Bếp trưởng' },
    { image: '/uploads/team-2.jpg', name: 'Trần Thị B', designation: 'Chuyên gia Bánh ngọt' },
    { image: '/uploads/team-3.jpg', name: 'Lê Văn C', designation: 'Đầu bếp chính' },
    { image: '/uploads/team-4.jpg', name: 'Phạm Thị D', designation: 'Phụ bếp' }
];

const About: React.FC = () => {
    return (
        <div className="bg-gray-900 text-white">
            {/* === 1. HERO HEADER === */}
            <div className="py-24 bg-gray-800 text-center">
                <h1 className="text-5xl font-bold mb-4">Về Chúng Tôi</h1>
                <p className="text-gray-300">Hành trình mang hương vị Việt đến mọi nhà</p>
            </div>

            {/* === 2. ABOUT US SECTION === */}
            <section className="py-24">
                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center px-4">
                    {/* Cột ảnh (Bố cục 4 ảnh hiện đại) */}
                    <div className="grid grid-cols-2 gap-4">
                        <img src="/src/assets/images/about-1.jpg" alt="Không gian 1" className="rounded-lg shadow-lg w-full h-full object-cover" />
                        <img src="/src/assets/images/about-2.jpg" alt="Món ăn 1" className="rounded-lg shadow-lg w-full h-full object-cover mt-8" />
                        <img src="/src/assets/images/about-3.jpg" alt="Món ăn 2" className="rounded-lg shadow-lg w-full h-full object-cover" />
                        <img src="/src/assets/images/about-4.jpg" alt="Không gian 2" className="rounded-lg shadow-lg w-full h-full object-cover mt-8" />
                    </div>

                    {/* Cột nội dung */}
                    <div>
                        <h3 className="font-serif text-yellow-500 text-xl font-semibold">Câu chuyện của chúng tôi</h3>
                        <h2 className="text-4xl font-bold mt-2 mb-4">Chào mừng đến với Ẩm Thực</h2>
                        <p className="text-gray-400 mb-6">
                            Ra đời từ niềm đam mê với ẩm thực truyền thống Việt Nam, Hương Sen là nơi hội tụ của những hương vị tinh tế và không gian ấm cúng. Chúng tôi tin rằng mỗi bữa ăn là một cơ hội để tạo ra những kỷ niệm đáng nhớ.
                        </p>
                        <p className="text-gray-400 mb-6">
                            Với đội ngũ đầu bếp tài năng và sự tận tâm trong từng chi tiết, chúng tôi mang đến những món ăn không chỉ ngon miệng mà còn là những tác phẩm nghệ thuật, kết hợp hài hòa giữa truyền thống và hiện đại.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                <Award className="text-yellow-500 w-8 h-8 flex-shrink-0" />
                                <span className="font-bold">15+ Năm Kinh nghiệm</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                <ChefHat className="text-yellow-500 w-8 h-8 flex-shrink-0" />
                                <span className="font-bold">50+ Đầu bếp tài năng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === 3. TEAM SECTION === */}
            <div className="py-24 bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h5 className="font-serif text-yellow-500 text-xl font-semibold">Thành viên</h5>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white">Gặp gỡ các Đầu bếp bậc thầy</h1>
                    </div>
                    {/* Tái sử dụng component TeamCard */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
                        {teamMembers.map((member, index) => (
                            <TeamCard
                                key={index}
                                image={member.image}
                                name={member.name}
                                designation={member.designation}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;