// packages/web-client/src/components/Header.tsx
import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// SỬA Ở ĐÂY: Thay thế '@/' bằng '../'
import { useUser } from '../hooks/useUser';
import normalAvatar from '../assets/images/default-avatar.png'; // Giả sử thư mục assets ngang hàng với components

// Định nghĩa kiểu dữ liệu cho User
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface User {
    fullname: string;
    avatar: string;
}

const Header: React.FC = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [setUser]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setUser(null);
        navigate('/');
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const truncateName = (name: string, maxLength: number): string => {
        return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
    };

    return (
        <header className="bg-gray-900 text-white px-5 lg:px-8 py-3">
            <nav className="flex justify-between items-center">
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2">
                    <img src="/huong-sen-logo.png" alt="Logo" className="h-10" /> {/* Ảnh từ thư mục public */}
                    <h1 className="text-2xl text-yellow-500 font-serif m-0">Ẩm Thực</h1>
                </NavLink>

                {/* Menu cho Desktop */}
                <div className="hidden lg:flex items-center gap-4">
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'text-yellow-500' : 'hover:text-yellow-400')}>Trang chủ</NavLink>
                    <NavLink to="/menu" className={({ isActive }) => (isActive ? 'text-yellow-500' : 'hover:text-yellow-400')}>Thực đơn</NavLink>
                    {/* ... các link khác ... */}
                </div>

                {/* Nút Đặt bàn và User */}
                <div className="flex items-center gap-3">
                    <NavLink to="/booking" className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-full hover:bg-yellow-600">
                        Đặt bàn
                    </NavLink>
                    {user ? (
                        <div className="relative">
                            {/* Nút Avatar */}
                            <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500">
                                <img src={user.avatar || normalAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            </button>
                            {/* Dropdown Menu (Cần thêm logic để ẩn/hiện) */}
                        </div>
                    ) : (
                        <NavLink to="/login" className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-full hover:bg-yellow-600">
                            Đăng nhập
                        </NavLink>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;