import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu
interface CustomerInfo {
    fullname: string;
    email: string;
    tel: string;
    reservation_date: string;
    party_size: number;
    note?: string;
}
interface SelectedProduct {
    name: string;
    price: number;
    quantity: number;
}
interface SelectedProducts {
    [productId: string]: SelectedProduct;
}

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const Spinner: React.FC = () => (
    <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
);

const Pay: React.FC = () => {
    const navigate = useNavigate();
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [products, setProducts] = useState<SelectedProducts>({});
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Tải toàn bộ thông tin từ localStorage
        const info = localStorage.getItem("bookingInfo");
        const prods = localStorage.getItem("selectedProducts");
        const tot = localStorage.getItem("totalPrice");

        if (!info || !prods || !tot) {
            alert("Thông tin đặt bàn bị thiếu. Vui lòng thử lại từ Bước 1.");
            navigate('/booking');
            return;
        }

        setCustomerInfo(JSON.parse(info));
        setProducts(JSON.parse(prods));
        setTotal(parseFloat(tot));
    }, [navigate]);

    const handleCompleteBooking = async () => {
        if (!paymentMethod) {
            alert("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        setLoading(true);

        try {
            const userString = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');
            if (!userString || !token) {
                alert('Bạn cần đăng nhập để hoàn tất.');
                navigate('/login');
                return;
            }
            const user = JSON.parse(userString);

            // Chuẩn bị dữ liệu để gửi lên server
            const bookingData = {
                ...customerInfo,
                userId: user.id,
                status: paymentMethod === 'cash' ? 'confirmed' : 'pending_payment',
                total_price: total,
                payment_method: paymentMethod,
                products: Object.keys(products).map(id => ({
                    product_id: id,
                    quantity: products[id].quantity,
                    price: products[id].price
                }))
            };

            // **LƯU Ý**: Đây là API cuối cùng để tạo đơn
            await axios.post('http://localhost:8080/api/bookings/create-full', bookingData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Xóa dữ liệu tạm
            localStorage.removeItem('bookingInfo');
            localStorage.removeItem('selectedProducts');
            localStorage.removeItem('totalPrice');

            // Chuyển đến trang thành công
            navigate('/confirm-pay');

        } catch (error) {
            alert('Tạo đơn đặt bàn thất bại. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!customerInfo) return <Spinner />;

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="py-24 bg-gray-800 text-center">
                <h1 className="text-5xl font-bold mb-4">Xác Nhận Đơn (Bước 3/3)</h1>
                <p>Vui lòng kiểm tra lại thông tin</p>
            </div>
            <div className="container mx-auto p-8 max-w-4xl">
                <div className="bg-gray-800 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold text-yellow-500 mb-4">1. Thông tin khách hàng</h2>
                    <p><strong>Họ tên:</strong> {customerInfo.fullname}</p>
                    <p><strong>Email:</strong> {customerInfo.email}</p>
                    <p><strong>Điện thoại:</strong> {customerInfo.tel}</p>
                    <p><strong>Ngày giờ:</strong> {new Date(customerInfo.reservation_date).toLocaleString('vi-VN')}</p>
                    <p><strong>Số người:</strong> {customerInfo.party_size}</p>

                    <h2 className="text-2xl font-bold text-yellow-500 mt-8 mb-4">2. Các món đã chọn</h2>
                    <div className="space-y-2">
                        {Object.values(products).map(item => (
                            <div key={item.name} className="flex justify-between">
                                <span>{item.name} (x{item.quantity})</span>
                                <span className="text-gray-300">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-700">
                            <span>TỔNG CỘNG</span>
                            <span className="text-yellow-500">{formatPrice(total)}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-yellow-500 mt-8 mb-4">3. Phương thức thanh toán</h2>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 p-4 bg-gray-700 rounded-lg cursor-pointer">
                            <input type="radio" name="paymentMethod" value="cash" onChange={(e) => setPaymentMethod(e.target.value)} className="form-radio text-yellow-500" />
                            <span>Thanh toán bằng tiền mặt tại nhà hàng</span>
                        </label>
                        <label className="flex items-center gap-2 p-4 bg-gray-700 rounded-lg cursor-pointer">
                            <input type="radio" name="paymentMethod" value="vnpay" onChange={(e) => setPaymentMethod(e.target.value)} className="form-radio text-yellow-500" />
                            <span>Thanh toán qua VNPAY (Khuyến nghị)</span>
                        </label>
                    </div>

                    <div className="flex justify-between mt-12">
                        <button onClick={() => navigate('/order')} className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700">
                            &larr; Quay lại chọn món
                        </button>
                        <button onClick={handleCompleteBooking} disabled={loading} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 disabled:bg-gray-600">
                            {loading ? 'Đang xử lý...' : 'Hoàn tất Đặt bàn'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pay;