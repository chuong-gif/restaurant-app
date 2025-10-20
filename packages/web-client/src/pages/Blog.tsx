import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import BlogCard from '../components/blog/BlogCard'; // Import khuôn mẫu
import type { PostSummary } from '../components/blog/BlogCard';

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // **LƯU Ý**: Đảm bảo API endpoint này là đúng
                const response = await axios.get('http://localhost:8080/api/blogs');
                setPosts(response.data);
            } catch (err) {
                setError('Không thể tải danh sách bài viết.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Hero Header */}
            <div className="py-24 bg-gray-800 text-center">
                <h1 className="text-5xl font-bold mb-4">Tin Tức & Blog</h1>
                <p className="text-gray-300">Cập nhật các công thức và câu chuyện từ bếp của chúng tôi</p>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                {loading && (
                    <div className="flex justify-center"><Spinner /></div>
                )}

                {error && (
                    <p className="text-center text-red-500">{error}</p>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;