import React from 'react';
import { Link } from 'react-router-dom';

const ReservationGuide: React.FC = () => {
    return (
        <div className="bg-gray-900 text-white">
            <div className="py-24 bg-gray-800 text-center">
                <h1 className="text-5xl font-bold mb-4">Hướng Dẫn Đặt Bàn</h1>
                <p className="text-gray-300">Các bước đơn giản để có một bữa ăn tuyệt vời</p>
            </div>

            <div className="py-16">
                <div className="container mx-auto max-w-4xl px-4 prose prose-invert prose-h3:text-yellow-500 prose-h3:font-bold prose-h4:text-white">
                    <h3>Quy trình đặt bàn</h3>
                    <h4>1. Điền thông tin</h4>
                    <p>
                        Tại trang "Đặt Bàn", quý khách vui lòng điền đầy đủ thông tin cơ bản như họ tên, số điện thoại, ngày giờ và số lượng người. Điều này giúp chúng tôi chuẩn bị và phục vụ bạn tốt nhất.
                    </p>
                    <h4>2. Xác nhận</h4>
                    <p>
                        Sau khi điền thông tin, nhấn nút "Hoàn tất Đặt bàn". Hệ thống sẽ ghi nhận yêu cầu của bạn.
                    </p>
                    <h4>3. Hoàn tất</h4>
                    <p>
                        Hệ thống sẽ gửi email xác nhận đặt bàn thành công trong vòng 5 phút. Vui lòng kiểm tra hộp thư của bạn. Nếu không nhận được, hãy liên hệ trực tiếp với chúng tôi.
                    </p>
                    <div className="text-center mt-12">
                        <Link to="/booking" className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition">
                            Thử Đặt bàn ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationGuide;