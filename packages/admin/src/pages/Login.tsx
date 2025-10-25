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
            const response = await login(data).unwrap(); // .unwrap() để bắt lỗi từ RTK Query
            dispatch(setCredentials({ user: response.data, accessToken: response.accessToken }));
            toast.success('Đăng nhập thành công!');
            navigate('/dashboard'); // Chuyển hướng đến trang dashboard
        } catch (err) {
            // Lỗi sẽ được bắt ở đây
            console.error('Failed to login: ', err);
        }
    };

    // Hiển thị toast lỗi từ server
    useEffect(() => {
        if (error && 'data' in error) {
            const errorData = error.data as { message?: string };
            toast.error(errorData.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    }, [error]);


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Toaster position="top-right" />
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    Đăng Nhập Trang Quản Trị
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email</label>
                            <input
                                id="email-address"
                                type="email"
                                autoComplete="email"
                                {...register('email', { required: 'Email là bắt buộc' })}
                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Mật khẩu</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                {...register('password', { required: 'Mật khẩu là bắt buộc' })}
                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Mật khẩu"
                            />
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;