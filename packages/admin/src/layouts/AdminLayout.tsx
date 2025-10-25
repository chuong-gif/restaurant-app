// packages/admin/src/layouts/AdminLayout.tsx
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
    // ... (code handleLogout và user giữ nguyên)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-xl font-bold">Trang Admin</div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">
                        Dashboard
                    </Link>
                    <Link to="/products" className="block px-4 py-2 rounded hover:bg-gray-700">
                        Sản phẩm
                    </Link>
                    {/* === THÊM DÒNG MỚI === */}
                    <Link to="/categories" className="block px-4 py-2 rounded hover:bg-gray-700">
                        Danh mục
                    </Link>
                    {/* ===================== */}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between p-4 bg-white border-b">
                    <div>{/* Search bar or other header content */}</div>
                    <div className="flex items-center">
                        <span className="mr-4">Chào, {user?.ho_ten}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;