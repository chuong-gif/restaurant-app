import React from 'react';
import { useNavigate } from 'react-router-dom';
import unidecode from 'unidecode';

// Định nghĩa kiểu dữ liệu cho Product
interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    sale_price?: number; // `?` nghĩa là thuộc tính này có thể không có
    description: string;
}

interface ProductCardProps {
    product: Product;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const createSlug = (name: string) => {
    return unidecode(name).toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();

    const handleProductClick = () => {
        const slug = createSlug(product.name);
        navigate(`/menu/${slug}`); // Điều hướng đến trang chi tiết
    };

    const finalPrice = product.price - (product.sale_price || 0);

    return (
        <div
            className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={handleProductClick}
        >
            <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h5 className="text-lg font-semibold mb-1">{product.name}</h5>
                    <span className="text-yellow-600 font-bold text-lg whitespace-nowrap">{formatPrice(finalPrice)}</span>
                </div>
                {product.sale_price && (
                    <span className="text-gray-500 line-through text-sm">{formatPrice(product.price)}</span>
                )}
                <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                    {product.description}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;