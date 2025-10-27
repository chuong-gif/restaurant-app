// packages/admin/src/layouts/AdminLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'; // Thêm useLocation
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useAuth } from '../hooks/useAuth';
// Import icons từ Ant Design
import {
    DashboardOutlined, AppstoreOutlined, FileTextOutlined, SettingOutlined, UserOutlined,
    CalendarOutlined, TeamOutlined, DownOutlined, GiftOutlined, ShopOutlined, ReadOutlined,
    MessageOutlined, SafetyCertificateOutlined, SolutionOutlined, RightOutlined, DeleteOutlined
} from '@ant-design/icons';



// --- Cấu trúc Menu Mới ---
interface MenuItem {
    key: string;
    icon: React.ReactNode;
    label: React.ReactNode;
    path?: string;
    children?: MenuItem[];
}

const menuItems: MenuItem[] = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/dashboard' },
    {
        key: 'food', icon: <ShopOutlined />, label: 'Quản Lý Món Ăn', children: [
            { key: 'categories', icon: <AppstoreOutlined />, label: 'Danh mục', path: '/categories' },
            { key: 'products', icon: <AppstoreOutlined />, label: 'Sản phẩm', path: '/products' },
            { key: 'products-trash', icon: <DeleteOutlined />, label: 'Thùng rác SP', path: '/products/trash' },
        ]
    },
    {
        key: 'blog', icon: <ReadOutlined />, label: 'Quản Lý Bài Viết', children: [
            // Thêm các key và path cho blog sau này
            { key: 'blog-categories', icon: <AppstoreOutlined />, label: 'Danh mục bài viết', path: '/blog-categories' },
            { key: 'blog-posts', icon: <FileTextOutlined />, label: 'Bài viết', path: '/blog-posts' },
        ]
    },
    {
        key: 'other', icon: <SettingOutlined />, label: 'Quản lý Khác', children: [
            { key: 'promotions', icon: <GiftOutlined />, label: 'Khuyến mãi', path: '/promotions' },
        ]
    },
    {
        key: 'accounts', icon: <UserOutlined />, label: 'Quản Lý Tài Khoản', children: [
            { key: 'users', icon: <TeamOutlined />, label: 'Tất cả tài khoản', path: '/users' },
            // Có thể thêm link lọc sẵn Khách hàng/Nhân viên nếu muốn
            // { key: 'customers', label: 'Khách hàng', path: '/users?type=customer' },
            // { key: 'employees', label: 'Nhân viên', path: '/users?type=employee' },
            { key: 'users-trash', icon: <DeleteOutlined />, label: 'Thùng rác TK', path: '/users/trash' },
        ]
    },
    {
        key: 'booking', icon: <CalendarOutlined />, label: 'Quản Lý Đặt Bàn', children: [
            // Thêm key và path cho bàn ăn sau này
            { key: 'tables', icon: <AppstoreOutlined />, label: 'Quản lý bàn ăn', path: '/tables' },
            { key: 'reservations', icon: <SolutionOutlined />, label: 'Quản lý đặt bàn', path: '/reservations' },
            { key: 'reservations-trash', icon: <DeleteOutlined />, label: 'Đơn đã hủy', path: '/reservations/trash' },
        ]
    },
    { // === THÊM NHÓM MỚI ===
        key: 'roles', icon: <SafetyCertificateOutlined />, label: 'Quản Lý Vai Trò', children: [
            { key: 'assign-permissions', icon: <SolutionOutlined />, label: 'Phân quyền', path: '/roles/permissions' },
            { key: 'role-list', icon: <TeamOutlined />, label: 'Vai trò', path: '/roles' },
        ]
    }, // =====================
    { key: 'chat', icon: <MessageOutlined />, label: 'Tư vấn với khách hàng', path: '/chat' },
];
// -----------------------


const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // Lấy path hiện tại
    const { user } = useAuth();
    const [openKeys, setOpenKeys] = useState<string[]>([]); // State để quản lý menu đang mở

    // Tìm key của menu cha dựa trên path con
    useEffect(() => {
        const currentPath = location.pathname;
        for (const item of menuItems) {
            if (item.children) {
                for (const child of item.children) {
                    if (child.path === currentPath) {
                        setOpenKeys([item.key]);
                        return;
                    }
                }
            } else if (item.path === currentPath) {
                // Nếu là menu cấp 1, không cần mở gì
                setOpenKeys([]);
                return;
            }
        }
    }, [location.pathname]);


    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Hàm xử lý đóng/mở menu cha
    const onOpenChange = (keys: string[]) => {
        setOpenKeys(keys);
    };

    // Render menu item (đệ quy nếu có con)
    const renderMenuItems = (items: MenuItem[]) => {
        return items.map(item => {
            if (item.children) {
                return (
                    <li key={item.key} className={`px-2 py-1 ${openKeys.includes(item.key) ? 'bg-gray-700 rounded' : ''}`}>
                        <div
                            className="flex items-center justify-between px-2 py-2 rounded hover:bg-gray-700 cursor-pointer"
                            onClick={() => onOpenChange(openKeys.includes(item.key) ? openKeys.filter(k => k !== item.key) : [...openKeys, item.key])}
                        >
                            <span className="flex items-center">
                                {item.icon}
                                <span className="ml-3">{item.label}</span>
                            </span>
                            {openKeys.includes(item.key) ? <DownOutlined className="text-xs" /> : <RightOutlined className="text-xs" />}
                        </div>
                        {openKeys.includes(item.key) && (
                            <ul className="pl-4 mt-1 border-l border-gray-600">
                                {renderMenuItems(item.children)}
                            </ul>
                        )}
                    </li>
                );
            }
            return (
                <li key={item.key} className="px-2 py-1">
                    <Link to={item.path || '#'}
                        className={`flex items-center px-2 py-2 rounded hover:bg-gray-700 ${location.pathname === item.path ? 'bg-gray-600 font-semibold' : ''}`}
                    >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </Link>
                </li>
            );
        });
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col overflow-y-auto">
                <div className="p-4 text-xl font-bold border-b border-gray-700">Huong Sen Admin</div>
                <nav className="flex-1 px-2 py-4">
                    <ul className="space-y-1">
                        {renderMenuItems(menuItems)}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between p-4 bg-white border-b">
                    <div></div>
                    <div className="flex items-center">
                        <span className="mr-4">Chào, {user?.ho_ten}</span>
                        <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                            Đăng xuất
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;