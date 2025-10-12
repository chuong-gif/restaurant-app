// packages/web-client/src/components/home/NewProductsSection.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Cần cài đặt: npm install axios
import unidecode from 'unidecode'; // Cần cài đặt: npm install unidecode
import Spinner from '../Spinner'; // Import component Spinner đã tạo

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    sale_price: number;
}

const NewProductsSection: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Thay thế Redux bằng cách gọi API trực tiếp
        const fetchProducts = async () => {
            try {
                // Cập nhật URL API của bạn ở đây
                const response = await axios.get('http://localhost:8080/api/products/new');
                setProducts(response.data.slice(0, 8)); // Lấy 8 sản phẩm đầu tiên
            } catch (error) {
                console.error("Failed to fetch new products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const createSlug = (name: string) => {
        return unidecode(name).toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    };

    const handleProductClick = (name: string) => {
        const slug = createSlug(name);
        navigate(`/menu/${slug}`); // Điều hướng đến trang chi tiết
    };

    if (loading) {
        return <div className="py-16"><Spinner /></div>;
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h5 className="font-serif text-yellow-500 text-xl">Nhà Hàng Hương Sen</h5>
                <h1 className="text-4xl font-bold">Món ăn mới</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex items-center gap-4 cursor-pointer group"
                        onClick={() => handleProductClick(product.name)}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="w-full">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <h5 className="text-lg font-semibold group-hover:text-yellow-600">{product.name}</h5>
                                <span className="text-yellow-500 font-bold">
                                    {formatPrice(product.price - (product.sale_price || 0))}
                                </span>
                            </div>
                            {product.sale_price > 0 && (
                                <div className="text-right mt-1">
                                    <span className="text-gray-500 line-through text-sm">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewProductsSection;