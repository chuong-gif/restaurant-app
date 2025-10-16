import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { User, Calendar } from 'lucide-react';

// --- Định nghĩa các kiểu dữ liệu ---
interface Post {
  id: number;
  title: string;
  poster: string;
  content: string;
  author: string;
  createdAt: string;
  slug: string;
}


const DetailBlog: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  // const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        // **LƯU Ý**: Bạn cần có các API endpoint này trên backend
        // const postRes = await axios.get(`http://localhost:8080/api/blogs/slug/${slug}`);
        // setPost(postRes.data);
        
        // if (postRes.data) {
        //   const relatedRes = await axios.get(`http://localhost:8080/api/blogs/related/${postRes.data.id}`);
        //   setRelatedPosts(relatedRes.data);

        //   const commentsRes = await axios.get(`http://localhost:8080/api/blogs/${postRes.data.id}/comments`);
        //   setComments(commentsRes.data);
        // }

        // --- Dữ liệu giả để test giao diện ---
        setPost({ id: 1, title: 'Bí quyết nấu phở bò Hà Nội chuẩn vị', slug: 'bi-quyet-nau-pho', poster: '/src/assets/images/menu-1.jpg', content: '<p>Nội dung chi tiết của bài viết...</p>', author: 'Bếp trưởng Nguyễn Văn A', createdAt: new Date().toISOString() });
        setRelatedPosts([
            { id: 2, title: 'Cách làm nem rán giòn rụm', slug: 'cach-lam-nem-ran', poster: '/src/assets/images/menu-2.jpg', content: '', author: '', createdAt: '' },
            { id: 3, title: 'Top 5 món tráng miệng dễ làm', slug: 'top-5-mon-trang-mieng', poster: '/src/assets/images/menu-3.jpg', content: '', author: '', createdAt: '' }
        ]);
        // setComments([ { id: 1, user: { fullname: 'Trần Văn B' }, content: 'Bài viết rất hay và hữu ích!' } ]);
        // --- Kết thúc dữ liệu giả ---

      } catch (error) {
        console.error("Failed to fetch blog data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Spinner /></div>;
  if (!post) return <div className="min-h-screen bg-gray-900 text-center py-20 text-white">Không tìm thấy bài viết.</div>;

  return (
    <div className="bg-gray-900 text-white">
      <div className="py-24 bg-gray-800 text-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${post.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h1 className="text-5xl font-bold mb-4 container mx-auto">{post.title}</h1>
        <div className="flex justify-center items-center gap-4 text-gray-300">
            <span className="flex items-center gap-2"><User size={16}/> {post.author}</span>
            <span className="flex items-center gap-2"><Calendar size={16}/> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto grid lg:grid-cols-3 gap-8 px-4">
          {/* Main content */}
          <div className="lg:col-span-2 prose prose-invert max-w-none prose-h2:text-yellow-500" dangerouslySetInnerHTML={{ __html: post.content }}>
            {/* Nội dung bài viết sẽ được hiển thị ở đây */}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Bài viết liên quan</h3>
              <div className="space-y-4">
                {relatedPosts.map(p => (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="flex items-center gap-4 group">
                    <img src={p.poster} alt={p.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold group-hover:text-yellow-500 transition">{p.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DetailBlog;