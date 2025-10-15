import React from 'react';
import { Link } from 'react-router-dom';

const Policy: React.FC = () => {
    return (
        <div className="bg-gray-900 text-white">
            <div className="py-24 bg-gray-800 text-center">
                <h1 className="text-5xl font-bold mb-4">Chính Sách Hoạt Động</h1>
                <p className="text-gray-300">Các quy định chung tại nhà hàng Hương Sen</p>
            </div>

            <div className="py-16">
                <div className="container mx-auto max-w-4xl px-4 prose prose-invert prose-h3:text-yellow-500 prose-h3:font-bold prose-li:marker:text-yellow-500">
                    <h3>Giờ hoạt động</h3>
                    <h5>Từ thứ hai - thứ sáu:</h5>
                    <p>8:00 - 22:00</p>
                    <h5>Từ thứ bảy - chủ nhật:</h5>
                    <p>10:00 - 23:00</p>

                    <h3 className="mt-8">Lưu ý khi đặt bàn</h3>
                    <p>Khi đặt bàn trên website của nhà hàng, khách hàng hiểu và chấp nhận các điều kiện sau:</p>
                    <ul>
                        <li>Nhà hàng chỉ tiếp nhận đơn đặt bàn trực tuyến từ <strong>09:00 sáng</strong> đến trước <strong>21:00 tối</strong>.</li>
                        <li>Để đảm bảo chất lượng phục vụ, vui lòng đặt bàn trước ít nhất <strong>2 tiếng</strong> so với thời gian dự kiến đến.</li>
                        <li>Nếu quý khách đã thanh toán trước, việc hủy bàn hoặc thay đổi thời gian cần được thông báo cho nhà hàng ít nhất <strong>1 tiếng</strong> trước giờ đã đặt.</li>
                    </ul>

                    <div className="text-center mt-12">
                        <Link to="/" className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition">
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Policy;