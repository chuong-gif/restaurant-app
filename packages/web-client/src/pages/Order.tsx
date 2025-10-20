import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
}
interface SelectedProducts {
    [productId: string]: {
        name: string;
        price: number;
        quantity: number;
    };
}

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const Order: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<SelectedProducts>({});

    useEffect(() => {
        // Kiểm tra xem đã có thông tin đặt bàn chưa
        const customerInfo = localStorage.getItem('bookingInfo');
        if (!customerInfo) {
            alert('Vui lòng điền thông tin đặt bàn trước.');
            navigate('/booking');
        }

        // Tải danh sách món ăn
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // Tải các món đã chọn (nếu quay lại từ Bước 3)
        const savedProducts = localStorage.getItem("selectedProducts");
        if (savedProducts) {
            setSelected(JSON.parse(savedProducts));
        }
    }, [navigate]);

    const handleQuantityChange = (product: Product, quantity: number) => {
        const newSelected = { ...selected };
        if (quantity > 0) {
            newSelected[product.id] = { name: product.name, price: product.price, quantity: quantity };
        } else {
            delete newSelected[product.id];
        }
        setSelected(newSelected);
    };

    const calculateTotal = () => {
        return Object.values(selected).reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const handleNext = () => {
        if (Object.keys(selected).length === 0) {
            alert('Bạn chưa chọn món ăn nào. Vui lòng chọn ít nhất 1 món.');
            return;
        }
        // Lưu các món đã chọn và tổng tiền vào localStorage
        localStorage.setItem("selectedProducts", JSON.stringify(selected));
        localStorage.setItem("totalPrice", calculateTotal().toString());
        navigate('/pay'); // Chuyển đến trang thanh toán
    };

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="py-24 bg-gray-800 text-center">
                <h1 className="text-5xl font-bold mb-4">Chọn Món Ăn (Bước 2/3)</h1>
                <p>Chọn các món bạn muốn đặt trước</p>
            </div>
            <div className="container mx-auto p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-gray-800 rounded-lg p-4 flex gap-4">
                            <img src={`http://localhost:8080${product.image}`} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                            <div className="flex-1">
                                <h3 className="font-bold">{product.name}</h3>
                                <p className="text-yellow-500">{formatPrice(product.price)}</p>
                                <input
                                    type="number"
                                    min="0"
                                    defaultValue={selected[product.id]?.quantity || 0}
                                    onChange={(e) => handleQuantityChange(product, parseInt(e.target.value))}
                                    className="w-20 p-1 bg-gray-700 rounded text-center mt-2"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-gray-800 rounded-lg shadow-lg sticky bottom-4">
                    <h2 className="text-2xl font-bold mb-4">Tổng cộng: <span className="text-yellow-500">{formatPrice(calculateTotal())}</span></h2>
                    <div className="flex justify-between">
                        <button onClick={() => navigate('/booking')} className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700">
                            &larr; Quay lại
                        </button>
                        <button onClick={handleNext} className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-600">
                            Tiếp theo: Thanh toán &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;