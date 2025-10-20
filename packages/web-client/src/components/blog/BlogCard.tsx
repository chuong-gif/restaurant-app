import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho một bài post (tóm tắt)
export interface PostSummary {
    id: number;
    title: string;
    poster: string; // Ảnh bìa
    author: string;
    createdAt: string;
    slug: string; // Đường dẫn
    description: string; // Mô tả ngắn
}

interface BlogCardProps {
    post: PostSummary;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
    const navigate = useNavigate();
    const imageUrl = `http://localhost:8080${post.poster}`;

    const handleCardClick = () => {
        navigate(`/blog/${post.slug}`);
    };

    return (
        <div
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            onClick={handleCardClick}
        >
            <img src={imageUrl} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 h-14 overflow-hidden">{post.title}</h3>
                <p className="text-gray-400 text-sm h-20 overflow-hidden mb-4">
                    {post.description}
                </p>
                <div className="flex justify-between items-center text-gray-500 text-sm border-t border-gray-700 pt-4">
                    <span className="flex items-center gap-2">
                        <User size={16} /> {post.author}
                    </span>
                    <span className="flex items-center gap-2">
                        <Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;