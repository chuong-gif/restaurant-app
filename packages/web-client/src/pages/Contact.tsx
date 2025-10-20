import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { Phone, Mail, MapPin } from 'lucide-react';

interface ContactFormInputs {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const Contact: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormInputs>();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    const showAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
    };

    const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
        setLoading(true);
        void data;
        try {
            // **LƯU Ý**: Bạn cần có API endpoint để nhận contact
            // await axios.post('http://localhost:8080/api/contacts', data);

            showAlert('Gửi tin nhắn thành công!', 'success');
            reset(); // Xóa form sau khi gửi
        } catch (error) {
            showAlert('Gửi tin nhắn thất bại. Vui lòng thử lại.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 text-white">
            {/* Thông báo (Alert) */}
            {alert.show && (
                <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg z-50 ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {alert.message}
                </div>
            )}

            {/* Hero Header */}
            <div className="py-24 bg-gray-800 text-center">
                <h1 className="text-5xl font-bold mb-4">Liên Hệ</h1>
                <p className="text-gray-300">Chúng tôi luôn sẵn lòng lắng nghe bạn</p>
            </div>

            <div className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h5 className="font-serif text-yellow-500 text-xl font-semibold">Liên lạc với chúng tôi</h5>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white">Giữ kết nối</h1>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="text-center"><MapPin className="mx-auto text-yellow-500 mb-2" size={32} /> <h4 className="font-bold">Địa chỉ</h4><p className="text-gray-400">123 Đường ABC, Quận 1, TP.HCM</p></div>
                        <div className="text-center"><Mail className="mx-auto text-yellow-500 mb-2" size={32} /> <h4 className="font-bold">Email</h4><p className="text-gray-400">contact@amthuc.com</p></div>
                        <div className="text-center"><Phone className="mx-auto text-yellow-500 mb-2" size={32} /> <h4 className="font-bold">Điện thoại</h4><p className="text-gray-400">+84 123 456 789</p></div>
                    </div>

                    {/* Bản đồ và Form */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            {/* Thay src bằng link nhúng Google Map của bạn */}
                            <iframe
                                className="w-full h-full rounded-lg min-h-[400px]"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447174292193!2d106.70203431526038!3d10.77698949232115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4a3e7a3c3f%3A0x23223a3d835158a5!2zQml0ZXhjbyBGaW5hbmNpYWwgVG93ZXIsIDE5LTE5YSDEkC4gSMawbmcgVsawxqFuZywgQuG6v24gTmdow6ksIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdG5hbQ!5e0!3m2!1svi!2s!4v1678886456789!5m2!1svi!2s"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                        <div className="bg-gray-800 p-8 rounded-lg">
                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input {...register("name", { required: "Vui lòng nhập tên" })} placeholder="Tên của bạn" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <input {...register("email", { required: "Vui lòng nhập email" })} placeholder="Email của bạn" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <input {...register("subject", { required: "Vui lòng nhập chủ đề" })} placeholder="Chủ đề" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                                        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <textarea {...register("message", { required: "Vui lòng nhập tin nhắn" })} rows={6} placeholder="Tin nhắn" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"></textarea>
                                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                                    </div>
                                    <div className="md:col-span-2 text-right">
                                        <button type="submit" disabled={loading} className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition disabled:bg-gray-600">
                                            {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;