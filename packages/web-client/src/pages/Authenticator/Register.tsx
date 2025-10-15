import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho form đăng ký
interface RegisterFormInputs {
    fullname: string;
    email: string;
    tel: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const password = watch("password");

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            // Thay thế URL API đăng ký của bạn ở đây
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                fullname: data.fullname,
                email: data.email,
                tel: data.tel,
                password: data.password,
            });

            console.log('Đăng ký thành công:', response.data);
            alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
            navigate('/login');

        } catch (error: unknown) {
            if (
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                typeof (error as { response?: { data?: { message?: string } } }).response === "object" &&
                (error as { response?: { data?: { message?: string } } }).response !== null &&
                "data" in (error as { response?: { data?: { message?: string } } }).response!
            ) {
                setServerError(
                    ((error as { response: { data: { message?: string } } }).response.data.message as string) ||
                    "Email đã tồn tại hoặc có lỗi xảy ra."
                );
            } else {
                setServerError("Không thể kết nối đến server. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-white mb-2">Tạo tài khoản</h2>
                <p className="text-center text-gray-400 mb-6">Chào mừng bạn đến với Hương Sen</p>

                {serverError && <p className="bg-red-500/20 text-red-400 text-center p-3 rounded-lg mb-4">{serverError}</p>}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-4">
                        {/* Fullname */}
                        <div>
                            <input type="text" {...register("fullname", { required: "Vui lòng nhập họ tên" })} placeholder="Họ và tên" className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <input type="email" {...register("email", { required: "Vui lòng nhập email", pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" } })} placeholder="Email" className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <input type="tel" {...register("tel", { required: "Vui lòng nhập số điện thoại" })} placeholder="Số điện thoại" className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            {errors.tel && <p className="text-red-500 text-sm mt-1">{errors.tel.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} {...register("password", { required: "Vui lòng nhập mật khẩu", minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" } })} placeholder="Mật khẩu" className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400">
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm -mt-3">{errors.password.message}</p>}

                        {/* Confirm Password */}
                        <div className="relative">
                            <input type={showConfirmPassword ? "text" : "password"} {...register("confirmPassword", { required: "Vui lòng xác nhận mật khẩu", validate: value => value === password || "Mật khẩu không khớp" })} placeholder="Xác nhận mật khẩu" className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400">
                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm -mt-3">{errors.confirmPassword.message}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition duration-300 mt-6 disabled:bg-yellow-800">
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>

                    <p className="text-center text-gray-400 mt-6">
                        Bạn đã có tài khoản?{' '}
                        <Link to="/login" className="text-yellow-500 hover:underline font-bold">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;