import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import RelatedProducts from '../components/products/RelatedProducts';

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    sale_price?: number;
    description: string;
    category_id: number;
}

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const DetailProduct: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setProduct(null);
            try {
                const productRes = await axios.get(`http://localhost:8080/api/products/slug/${slug}`);

                if (productRes.data && Array.isArray(productRes.data) && productRes.data.length > 0) {
                    const fetchedProduct: Product = productRes.data[0];
                    setProduct(fetchedProduct);

                    const relatedRes = await axios.get(`http://localhost:8080/api/products/related/${fetchedProduct.id}?categoryId=${fetchedProduct.category_id}`);
                    setRelatedProducts(relatedRes.data);
                } else {
                    setProduct(null);
                }

            } catch (error) {
                console.error("Failed to fetch product details:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    }

    if (!product) {
        return <div className="text-center py-20 text-xl text-gray-600">Không tìm thấy sản phẩm hoặc có lỗi xảy ra.</div>;
    }

    const finalPrice = product.price - (product.sale_price || 0);

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12">
                <div>
                    <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold text-yellow-600">{formatPrice(finalPrice)}</span>
                        {product.sale_price && (
                            <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
                        )}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-8">{product.description}</p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded-lg">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 font-bold text-lg">-</button>
                            <input type="text" value={quantity} readOnly className="w-12 text-center border-none focus:ring-0" />
                            <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 font-bold text-lg">+</button>
                        </div>
                        <button className="flex-grow bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition duration-300">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
        </div>
    );
};

export default DetailProduct;