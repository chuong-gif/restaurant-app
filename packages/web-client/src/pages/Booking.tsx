import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

// Định nghĩa kiểu dữ liệu cho form
interface BookingFormInputs {
    fullname: string;
    email: string;
    reservation_date: string;
    party_size: number;
    tel: string;
    note?: string;
}

const Booking: React.FC = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<BookingFormInputs>();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            setShowModal(true);
        } else {
            const user = JSON.parse(userData);
            setValue("fullname", user.fullname || "");
            setValue("email", user.email || "");
            setValue("tel", user.tel || "");
        }
    }, [setValue]);

    const onSubmit: SubmitHandler<BookingFormInputs> = (data) => {
        localStorage.setItem("bookingInfo", JSON.stringify(data));
        console.log("Dữ liệu đặt bàn:", data);
        alert("Đặt bàn thành công! (Dữ liệu đã được lưu, sẽ chuyển đến trang thanh toán ở các bước sau)");
    };

    const handleRedirectToLogin = () => {
        setShowModal(false);
        navigate("/login");
    };

    const handleCancel = () => {
        setShowModal(false);
        navigate("/");
    };

    return (
        <div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                        <h5 className="text-lg font-bold mb-4">Thông báo</h5>
                        <p>Bạn cần đăng nhập để đặt bàn. <br /> Bạn có muốn đăng nhập không?</p>
                        <div className="flex justify-center gap-4 mt-6">
                            <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
                            <button onClick={handleRedirectToLogin} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600">Đăng nhập</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-24 bg-gray-800 text-center text-white">
                <h1 className="text-5xl font-bold mb-4">Đặt bàn Online</h1>
                <p>Trang chủ / Đặt bàn</p>
            </div>

            <div className="bg-gray-900 py-16">
                <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center px-4">
                    <div className="h-full min-h-[400px] bg-cover bg-center rounded-lg" style={{ backgroundImage: "url('/src/assets/images/about-1.jpg')" }}></div>
                    <div className="p-8">
                        <h5 className="font-serif text-yellow-500 text-xl mb-2">Đặt chỗ</h5>
                        <h1 className="text-white text-4xl font-bold mb-6">Điền thông tin khách hàng</h1>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input type="text" {...register("fullname", { required: "Vui lòng nhập họ tên" })} placeholder="Họ và tên bạn" className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                                    {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>}
                                </div>
                                <div>
                                    <input type="email" {...register("email", { required: "Vui lòng nhập email", pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" } })} placeholder="Email của bạn" className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <input type="datetime-local" {...register("reservation_date", {
                                        required: "Vui lòng chọn ngày giờ",
                                        validate: value => {
                                            const selectedDate = new Date(value);
                                            const now = new Date();
                                            if (selectedDate < now) return "Không thể chọn thời gian trong quá khứ.";
                                            const hours = selectedDate.getHours();
                                            if (hours < 9 || hours >= 21) return "Chỉ nhận đặt bàn từ 9:00 đến 21:00.";
                                            return true;
                                        }
                                    })} className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                                    {errors.reservation_date && <p className="text-red-500 text-sm mt-1">{errors.reservation_date.message}</p>}
                                </div>
                                <div>
                                    <input type="number" {...register("party_size", { required: "Vui lòng nhập số người", min: { value: 1, message: "Số người phải lớn hơn 0" } })} placeholder="Số người ăn" className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                                    {errors.party_size && <p className="text-red-500 text-sm mt-1">{errors.party_size.message}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <input type="tel" {...register("tel", { required: "Vui lòng nhập số điện thoại" })} placeholder="Số điện thoại" className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                                    {errors.tel && <p className="text-red-500 text-sm mt-1">{errors.tel.message}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <textarea {...register("note")} placeholder="Ghi chú thêm (ví dụ: cho trẻ em, ngồi gần cửa sổ...)" rows={4} className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"></textarea>
                                </div>
                                <div className="md:col-span-2 text-right">
                                    <button type="submit" className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition duration-300">
                                        Đặt bàn ngay
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;