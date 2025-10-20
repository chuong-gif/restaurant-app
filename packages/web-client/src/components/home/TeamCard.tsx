import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho các props mà component sẽ nhận
interface TeamCardProps {
    image: string;
    name: string;
    designation: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ image, name, designation }) => {
    // Nối địa chỉ server backend vào trước đường dẫn ảnh
    const imageUrl = `http://localhost:8080${image}`;

    return (
        <div className="group text-center transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative inline-block">
                <img
                    className="h-48 w-48 rounded-full object-cover mx-auto mb-4 border-4 border-gray-700 group-hover:border-yellow-500 transition-colors duration-300"
                    src={imageUrl}
                    alt={name}
                />
                {/* Lớp phủ chứa icon mạng xã hội, chỉ hiện khi di chuột vào */}
                <div className="absolute inset-0 h-48 w-48 mx-auto rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <a href="#" className="text-white hover:text-yellow-500"><Facebook size={20} /></a>
                    <a href="#" className="text-white hover:text-yellow-500"><Twitter size={20} /></a>
                    <a href="#" className="text-white hover:text-yellow-500"><Instagram size={20} /></a>
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mt-2">{name}</h3>
            <p className="text-base text-gray-400">{designation}</p>
        </div>
    );
};

export default TeamCard;