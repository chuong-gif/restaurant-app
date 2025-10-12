import React from 'react';
import { useNavigate } from 'react-router-dom';
import unidecode from 'unidecode';

// Định nghĩa kiểu dữ liệu (có thể import từ một file chung sau này)
interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    sale_price?: number;
}

interface RelatedProductsProps {
    products: Product[];
}

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
const createSlug = (name: string) => unidecode(name).toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
    const navigate = useNavigate();

    const handleProductClick = (name: string) => {
        const slug = createSlug(name);
        navigate(`/menu/${slug}`);
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi xem sản phẩm khác
    };

    return (
        <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={() => handleProductClick(product.name)}
                    >
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h4 className="font-semibold text-lg truncate">{product.name}</h4>
                            <p className="text-yellow-600 font-bold mt-2">
                                {formatPrice(product.price - (product.sale_price || 0))}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;