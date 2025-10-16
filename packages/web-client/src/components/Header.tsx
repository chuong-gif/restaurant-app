import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import UserDropdown from '../components/UserDropdown'; // Import component mới

const Header: React.FC = () => {
    const [user, setUser] = useState<{ fullname: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra localStorage khi component được tải
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setUser(null);
        navigate('/'); // Chuyển về trang chủ
        window.location.reload(); // Tải lại để đảm bảo mọi thứ được cập nhật
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? 'text-yellow-500 font-bold' : 'text-white hover:text-yellow-500 transition-colors';

    return (
        <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/" className="text-2xl font-bold text-yellow-500 font-serif">
                    Ẩm Thực
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <NavLink to="/" className={navLinkClass}>Trang chủ</NavLink>
                    <NavLink to="/about" className={navLinkClass}>Về chúng tôi</NavLink>
                    <NavLink to="/menu" className={navLinkClass}>Thực đơn</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>Liên hệ</NavLink>
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        // Nếu đã đăng nhập, hiển thị UserDropdown
                        <UserDropdown username={user.fullname} onLogout={handleLogout} />
                    ) : (
                        // Nếu chưa đăng nhập, hiển thị nút Đăng nhập/Đăng ký
                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/login" className="text-white hover:text-yellow-500 transition-colors">Đăng nhập</Link>
                            <Link to="/register" className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition">
                                Đăng ký
                            </Link>
                        </div>
                    )}
                    <Link to="/booking" className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition ml-4">
                        Đặt bàn
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;