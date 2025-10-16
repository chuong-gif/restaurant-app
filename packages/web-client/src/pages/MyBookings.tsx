import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Users, CheckCircle, XCircle, Clock, CreditCard, Trash2, Eye } from 'lucide-react';
import Spinner from '../components/Spinner';

// Định nghĩa kiểu dữ liệu cho một lần đặt bàn
interface Booking {
    id: number;
    reservation_date: string;
    party_size: number;
    status: 'confirmed' | 'cancelled' | 'completed' | 'pending_payment';
    note?: string;
}

// Hàm để định dạng ngày giờ cho dễ đọc
const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('vi-VN', {
        dateStyle: 'long',
        timeStyle: 'short',
    });
};

// Hàm để hiển thị tag trạng thái
const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
        case 'confirmed':
            return <span className="flex items-center gap-1.5 bg-green-500/20 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full"><CheckCircle size={14} /> Đã xác nhận</span>;
        case 'cancelled':
            return <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 text-xs font-medium px-2.5 py-1 rounded-full"><XCircle size={14} /> Đã hủy</span>;
        case 'completed':
            return <span className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full"><Clock size={14} /> Hoàn thành</span>;
        case 'pending_payment':
            return <span className="flex items-center gap-1.5 bg-orange-500/20 text-orange-400 text-xs font-medium px-2.5 py-1 rounded-full"><CreditCard size={14} /> Chờ thanh toán</span>;
        default:
            return null;
    }
};


const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const userString = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');
            if (!userString || !token) throw new Error('Bạn cần đăng nhập để xem lịch sử.');

            const user = JSON.parse(userString);
            const response = await axios.get(`http://localhost:8080/api/bookings/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const sortedBookings = response.data.sort((a: Booking, b: Booking) =>
                new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime()
            );
            setBookings(sortedBookings);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Không thể tải lịch sử đặt bàn.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleCancelBooking = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đơn đặt bàn này không?')) {
            // Logic hủy đơn ở đây
            alert(`Đã gửi yêu cầu hủy cho đơn #${id}`);
        }
    };

    const handleViewDetails = (id: number) => {
        navigate(`/my-bookings/${id}`);
    };

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Spinner /></div>;
    if (error) return <div className="min-h-screen bg-gray-900 text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="py-24 bg-gray-800 text-center">
                <h1 className="text-5xl font-bold mb-4">Lịch sử Đặt bàn</h1>
                <p>Quản lý các lần đặt bàn của bạn</p>
            </div>
            <div className="container mx-auto p-4 md:p-8">
                {bookings.length > 0 ? (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 text-lg font-bold">
                                        <Calendar size={18} className="text-yellow-500" />
                                        <span>{formatDateTime(booking.reservation_date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Users size={18} className="text-yellow-500" />
                                        <span>{booking.party_size} người</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {getStatusBadge(booking.status)}
                                    <button onClick={() => handleViewDetails(booking.id)} className="flex items-center gap-2 bg-blue-500 text-white text-sm font-bold py-2 px-3 rounded-lg hover:bg-blue-600 transition">
                                        <Eye size={16} /> Xem chi tiết
                                    </button>
                                    {booking.status === 'confirmed' && (
                                        <button onClick={() => handleCancelBooking(booking.id)} className="flex items-center gap-2 bg-red-500 text-white text-sm font-bold py-2 px-3 rounded-lg hover:bg-red-600 transition">
                                            <Trash2 size={16} /> Hủy
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 bg-gray-800 p-8 rounded-lg">Bạn chưa có lịch đặt bàn nào.</p>
                )}
            </div>
        </div>
    );
};

export default MyBookings;