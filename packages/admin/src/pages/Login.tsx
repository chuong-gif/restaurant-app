import { useForm, SubmitHandler } from 'react-hook-form';
import { useLoginMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type Inputs = {
    email: string;
    password: string;
};

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading, error }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await login(data).unwrap();
            dispatch(setCredentials({ user: response.data, accessToken: response.accessToken }));
            toast.success('Đăng nhập thành công!');
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to login: ', err);
        }
    };

    useEffect(() => {
        if (error && 'data' in error) {
            const errorData = error.data as { message?: string };
            toast.error(errorData.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <Toaster position="top-right" />

            <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl transition-all duration-300 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                        Đăng Nhập
                    </h2>
                    <p className="text-gray-600">Trang Quản Trị Hệ thống</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email-address"
                                type="email"
                                autoComplete="email"
                                {...register('email', { required: 'Email là bắt buộc' })}
                                className="relative block w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                {...register('password', { required: 'Mật khẩu là bắt buộc' })}
                                className="relative block w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-2xl text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang xử lý...
                                </span>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out; }
            `}</style>
        </div>
    );
};

export default Login;