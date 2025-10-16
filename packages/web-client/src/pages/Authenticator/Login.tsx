import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho form đăng nhập
interface LoginFormInputs {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            // Thay thế URL API đăng nhập của bạn ở đây
            const response = await axios.post('http://localhost:8080/api/auth/login', data);

            // Lưu thông tin user và token vào localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('accessToken', response.data.accessToken);

            console.log('Đăng nhập thành công:', response.data);
            navigate('/'); // Chuyển về trang chủ sau khi đăng nhập thành công
            window.location.reload(); // Tải lại trang để header cập nhật trạng thái đăng nhập

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                setServerError(error.response.data.message || 'Sai email hoặc mật khẩu.');
            } else {
                setServerError('Không thể kết nối đến server. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-white mb-2">Đăng nhập</h2>
                <p className="text-center text-gray-400 mb-6">Chào mừng trở lại!</p>

                {serverError && <p className="bg-red-500/20 text-red-400 text-center p-3 rounded-lg mb-4">{serverError}</p>}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <input type="email" {...register("email", { required: "Vui lòng nhập email", pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" } })} placeholder="Email" className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} {...register("password", { required: "Vui lòng nhập mật khẩu" })} placeholder="Mật khẩu" className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400">
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm -mt-3">{errors.password.message}</p>}
                    </div>

                    <div className="text-right mt-2">
                        <a href="#" className="text-sm text-yellow-500 hover:underline">Quên mật khẩu?</a>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition duration-300 mt-6 disabled:bg-yellow-800">
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>

                    <p className="text-center text-gray-400 mt-6">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-yellow-500 hover:underline font-bold">
                            Đăng ký ngay
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;