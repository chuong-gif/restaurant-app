import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

interface BookingDetail {
    id: number;
    fullname: string;
    email: string;
    tel: string;
    reservation_date: string;
    party_size: number;
    status: string;
    note?: string;
    // Thêm các trường khác nếu có, ví dụ: danh sách món ăn đã đặt
}

const MyBookingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:8080/api/bookings/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooking(response.data);
            } catch (error) {
                console.error("Failed to fetch booking details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookingDetail();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Spinner /></div>;
    if (!booking) return <div className="min-h-screen bg-gray-900 text-center py-20 text-white">Không tìm thấy thông tin đặt bàn.</div>;

    return (
        <div className="bg-gray-900 min-h-screen text-white p-8">
            <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-4">Chi tiết Đặt bàn #{booking.id}</h1>
                {/* ... Giao diện chi tiết đặt bàn ... */}
                <div className="text-center mt-8">
                    <Link to="/my-bookings" className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition">
                        &larr; Quay lại danh sách
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MyBookingDetail;