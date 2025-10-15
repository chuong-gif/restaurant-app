import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { User, Lock, History } from 'lucide-react';
import Spinner from '../components/Spinner'; // Import Spinner component

// --- Định nghĩa các kiểu dữ liệu cho form ---
interface ProfileFormInputs {
    fullname: string;
    email: string;
    tel: string;
}

interface PasswordFormInputs {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const Account: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    interface UserData {
        fullname: string;
        email: string;
        tel: string;
        // Add other user properties if needed
    }

    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Thêm state để quản lý việc tải dữ liệu
    const [isSubmitting, setIsSubmitting] = useState(false); // State cho việc submit form
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    const profileForm = useForm<ProfileFormInputs>();
    const passwordForm = useForm<PasswordFormInputs>();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            profileForm.setValue('fullname', parsedUser.fullname);
            profileForm.setValue('email', parsedUser.email);
            profileForm.setValue('tel', parsedUser.tel);
        }
        setIsLoading(false); // Đánh dấu đã tải xong
    }, [profileForm]);

    const showAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
    };

    const onProfileSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
        setIsSubmitting(true);
        // ... logic submit
        const updatedUser = { ...user, ...data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showAlert('Cập nhật thông tin thành công!', 'success');
        setIsSubmitting(false);
    };

    const onPasswordSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            passwordForm.setError('confirmNewPassword', { type: 'manual', message: 'Mật khẩu mới không khớp' });
            return;
        }
        setIsSubmitting(true);
        // ... logic submit
        showAlert('Đổi mật khẩu thành công!', 'success');
        passwordForm.reset();
        setIsSubmitting(false);
    };

    // QUAN TRỌNG: Hiển thị màn hình loading trong khi chờ dữ liệu user
    if (isLoading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    // Hiển thị thông báo nếu không có user (ví dụ: bị đăng xuất)
    if (!user) {
        return <div className="bg-gray-900 min-h-screen text-center py-20 text-white">Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            {alert.show && (
                <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg z-50 ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {alert.message}
                </div>
            )}

            <div className="py-24 bg-gray-800 text-center">
                <h1 className="text-5xl font-bold mb-4">Tài khoản của tôi</h1>
                <p>Quản lý thông tin cá nhân của bạn</p>
            </div>

            <div className="container mx-auto p-4 md:p-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Xin chào, {user.fullname}</h3>
                            <nav className="flex flex-col space-y-2">
                                <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 p-3 rounded-lg text-left ${activeTab === 'profile' ? 'bg-yellow-500 text-black' : 'hover:bg-gray-700'}`}>
                                    <User size={20} />
                                    <span>Thông tin cá nhân</span>
                                </button>
                                <button onClick={() => setActiveTab('password')} className={`flex items-center gap-3 p-3 rounded-lg text-left ${activeTab === 'password' ? 'bg-yellow-500 text-black' : 'hover:bg-gray-700'}`}>
                                    <Lock size={20} />
                                    <span>Đổi mật khẩu</span>
                                </button>
                                <button onClick={() => setActiveTab('history')} className={`flex items-center gap-3 p-3 rounded-lg text-left ${activeTab === 'history' ? 'bg-yellow-500 text-black' : 'hover:bg-gray-700'}`}>
                                    <History size={20} />
                                    <span>Lịch sử đặt bàn</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <div className="bg-gray-800 p-8 rounded-lg">
                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
                                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                                        {/* Form fields */}
                                        <div>
                                            <label className="block mb-2">Họ và tên</label>
                                            <input {...profileForm.register('fullname', { required: true })} className="w-full p-3 bg-gray-700 rounded" />
                                        </div>
                                        <div>
                                            <label className="block mb-2">Email</label>
                                            <input type="email" {...profileForm.register('email', { required: true })} className="w-full p-3 bg-gray-700 rounded" readOnly />
                                            <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi.</p>
                                        </div>
                                        <div>
                                            <label className="block mb-2">Số điện thoại</label>
                                            <input type="tel" {...profileForm.register('tel', { required: true })} className="w-full p-3 bg-gray-700 rounded" />
                                        </div>
                                        <div className="text-right">
                                            <button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 disabled:bg-gray-600">
                                                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {activeTab === 'password' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>
                                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                        {/* Form fields */}
                                        <div>
                                            <label className="block mb-2">Mật khẩu hiện tại</label>
                                            <input type="password" {...passwordForm.register('currentPassword', { required: 'Vui lòng nhập mật khẩu hiện tại' })} className="w-full p-3 bg-gray-700 rounded" />
                                            {passwordForm.formState.errors.currentPassword && <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.currentPassword.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block mb-2">Mật khẩu mới</label>
                                            <input type="password" {...passwordForm.register('newPassword', { required: 'Vui lòng nhập mật khẩu mới', minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' } })} className="w-full p-3 bg-gray-700 rounded" />
                                            {passwordForm.formState.errors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block mb-2">Xác nhận mật khẩu mới</label>
                                            <input type="password" {...passwordForm.register('confirmNewPassword', { required: 'Vui lòng xác nhận mật khẩu mới' })} className="w-full p-3 bg-gray-700 rounded" />
                                            {passwordForm.formState.errors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.confirmNewPassword.message}</p>}
                                        </div>
                                        <div className="text-right">
                                            <button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 disabled:bg-gray-600">
                                                {isSubmitting ? 'Đang đổi...' : 'Đổi mật khẩu'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {activeTab === 'history' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Lịch sử đặt bàn</h2>
                                    <p className="text-gray-400">Tính năng này sẽ sớm được cập nhật.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;