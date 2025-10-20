import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, History, AlertTriangle } from 'lucide-react';

const ConfirmPay: React.FC = () => {
    return (
        <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-gray-800 p-8 sm:p-12 rounded-lg shadow-xl text-center">

                <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6" />

                <h1 className="text-3xl font-bold text-white mb-4">
                    CẢM ƠN ĐÃ SỬ DỤNG DỊCH VỤ!
                </h1>

                <p className="text-gray-300 text-lg mb-6">
                    Bạn đã đặt bàn ở nhà hàng chúng tôi thành công. Chúng tôi sẽ liên hệ để xác nhận lại trong thời gian sớm nhất.
                </p>

                <p className="text-gray-400 mb-8">
                    Nếu bạn có thắc mắc hay cần hỗ trợ, vui lòng liên hệ:
                    <span className="text-yellow-500 font-bold ml-2">078.546.8567</span>
                </p>

                <div className="text-center mb-8">
                    <Link
                        to="/my-bookings"
                        className="inline-flex items-center gap-2 bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition"
                    >
                        <History size={18} />
                        Xem lịch sử đặt bàn
                    </Link>
                </div>

                {/* Lưu ý */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-4 rounded-lg flex items-start gap-4 text-left">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold">Lưu ý quan trọng</h4>
                        <p>Nếu quý khách đến trễ quá 30 phút, nhà hàng sẽ huỷ bàn và không hoàn lại cọc (nếu có).</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConfirmPay;