import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../components/menu/ProductCard';
import Pagination from '../components/menu/Pagination';
import Spinner from '../components/Spinner';

// Định nghĩa kiểu dữ liệu
interface Product {
    id: number; name: string; image: string; price: number; sale_price?: number; description: string; category_id: number;
}
interface Category {
    id: number; name: string;
}

const PRODUCTS_PER_PAGE = 8; // Số sản phẩm trên mỗi trang

const Menu: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Gọi API để lấy dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Thay thế URL API của bạn ở đây
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/products'),
                    axios.get('http://localhost:8080/api/categories'),
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
                if (categoriesRes.data.length > 0) {
                    setSelectedCategory(categoriesRes.data[0].id); // Mặc định chọn danh mục đầu tiên
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Lọc và tìm kiếm sản phẩm
    const filteredProducts = useMemo(() => {
        return products
            .filter(p => selectedCategory === null || p.category_id === selectedCategory)
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, selectedCategory, searchTerm]);

    // Tính toán cho phân trang
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    if (loading) {
        return <div className="h-screen"><Spinner /></div>;
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h5 className="font-serif text-yellow-500 text-xl">Thực đơn</h5>
                <h1 className="text-4xl font-bold">Các món ăn phổ biến</h1>
            </div>

            {/* Thanh tìm kiếm và Lọc danh mục */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Tìm kiếm món ăn..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                    }}
                    className="w-full md:w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <div className="flex-grow flex items-center justify-center flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat.id);
                                setCurrentPage(1); // Reset về trang 1 khi đổi danh mục
                            }}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${selectedCategory === cat.id
                                ? 'bg-yellow-500 text-black'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lưới sản phẩm */}
            {currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {currentProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg">Không tìm thấy món ăn nào.</p>
            )}


            {/* Phân trang */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default Menu;