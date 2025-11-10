// packages/admin/src/layouts/AdminLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useAuth } from '../hooks/useAuth'; // <-- Đã có
import {
    DashboardOutlined, AppstoreOutlined, FileTextOutlined, SettingOutlined, UserOutlined,
    CalendarOutlined, TeamOutlined, DownOutlined, GiftOutlined, ShopOutlined, ReadOutlined,
    MessageOutlined, SafetyCertificateOutlined, SolutionOutlined, RightOutlined, DeleteOutlined
} from '@ant-design/icons';

// --- Cấu trúc Menu Mới (Thêm requiredPermission) ---
interface MenuItem {
    key: string;
    icon: React.ReactNode;
    label: React.ReactNode;
    path?: string;
    children?: MenuItem[];
    requiredPermission?: string; // <-- THÊM DÒNG NÀY
}

// Bổ sung quyền yêu cầu cho từng mục
const menuItems: MenuItem[] = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/dashboard' }, // Dashboard không cần quyền
    {
        key: 'food', icon: <ShopOutlined />, label: 'Quản Lý Món Ăn', requiredPermission: 'view_product_category', children: [ // Quyền 'view_product_category' hoặc 'view_product'
            { key: 'categories', icon: <AppstoreOutlined />, label: 'Danh mục', path: '/categories', requiredPermission: 'view_product_category' },
            { key: 'products', icon: <AppstoreOutlined />, label: 'Sản phẩm', path: '/products', requiredPermission: 'view_product' },
            { key: 'products-trash', icon: <DeleteOutlined />, label: 'Thùng rác SP', path: '/products/trash', requiredPermission: 'view_product_trash' },
        ]
    },
    {
        key: 'blog', icon: <ReadOutlined />, label: 'Quản Lý Bài Viết', children: [ // Blog chưa có quyền
            { key: 'blog-categories', icon: <AppstoreOutlined />, label: 'Danh mục bài viết', path: '/blog-categories' },
            { key: 'blog-posts', icon: <FileTextOutlined />, label: 'Bài viết', path: '/blogs' },
        ]
    },
    {
        key: 'other', icon: <SettingOutlined />, label: 'Quản lý Khác', requiredPermission: 'view_promotion', children: [
            { key: 'promotions', icon: <GiftOutlined />, label: 'Khuyến mãi', path: '/promotions', requiredPermission: 'view_promotion' },
        ]
    },
    {
        key: 'accounts', icon: <UserOutlined />, label: 'Quản Lý Tài Khoản', requiredPermission: 'view_user', children: [
            { key: 'users', icon: <TeamOutlined />, label: 'Tất cả tài khoản', path: '/users', requiredPermission: 'view_user' },
            {
                key: 'users-trash',
                icon: <DeleteOutlined />,
                label: 'Thùng rác TK',
                path: '/users/trash',
                // === SỬA TÊN QUYỀN Ở ĐÂY ===
                requiredPermission: 'view_user' // Sửa từ 'view_user_trash'
            },
        ]
    },
    {
        key: 'booking', icon: <CalendarOutlined />, label: 'Quản Lý Đặt Bàn', requiredPermission: 'view_table', children: [ // Quyền 'view_table' hoặc 'view_reservation'
            { key: 'tables', icon: <AppstoreOutlined />, label: 'Quản lý bàn ăn', path: '/tables', requiredPermission: 'view_table' },
            { key: 'reservations', icon: <SolutionOutlined />, label: 'Quản lý đặt bàn', path: '/reservations', requiredPermission: 'view_reservation' },
            { key: 'reservations-trash', icon: <DeleteOutlined />, label: 'Đơn đã hủy', path: '/reservations/trash', requiredPermission: 'view_reservation_trash' },
        ]
    },
    {
        key: 'roles', icon: <SafetyCertificateOutlined />, label: 'Quản Lý Vai Trò', requiredPermission: 'view_role', children: [
            {
                key: 'assign-permissions',
                icon: <SolutionOutlined />,
                label: 'Phân quyền',
                path: '/roles/permissions',
                // === SỬA TÊN QUYỀN Ở ĐÂY ===
                requiredPermission: 'assign_permission_to_role' // Sửa từ 'assign_permission'
            },
            { key: 'role-list', icon: <TeamOutlined />, label: 'Vai trò', path: '/roles', requiredPermission: 'view_role' },
        ]
    },
    // { key: 'chat', icon: <MessageOutlined />, label: 'Tư vấn với khách hàng', path: '/chat' }, // Tạm ẩn nếu chưa có quyền
];

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth(); // Lấy user từ hook
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    // === HÀM KIỂM TRA QUYỀN ===
    const hasPermission = (permission?: string): boolean => {
        if (!permission) return true; // Nếu mục không yêu cầu quyền, cho phép
        return user?.permissions?.includes(permission) ?? false; // Kiểm tra quyền
    };

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
                setOpenKeys([]);
                return;
            }
        }
    }, [location.pathname]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const onOpenChange = (keys: string[]) => {
        setOpenKeys(keys);
    };

    // === SỬA HÀM RENDER MENU ===
    const renderMenuItems = (items: MenuItem[]): React.ReactNode[] => {
        return items
            .filter(item => hasPermission(item.requiredPermission)) // Lọc các mục người dùng có quyền
            .map(item => {
                // Lọc tiếp các mục con
                const visibleChildren = item.children?.filter(child => hasPermission(child.requiredPermission));

                // Nếu có mục con, nhưng không mục con nào hiển thị -> ẩn luôn cha
                if (item.children && visibleChildren?.length === 0) {
                    return null;
                }

                // Nếu có mục con
                if (item.children && visibleChildren && visibleChildren.length > 0) {
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
                                    {renderMenuItems(visibleChildren)} {/* Chỉ render con có quyền */}
                                </ul>
                            )}
                        </li>
                    );
                }

                // Nếu là mục cha (không có con)
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
            })
            .filter(Boolean); // Lọc bỏ các giá trị null
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col overflow-y-auto">
                <div className="p-4 text-xl font-bold border-b border-gray-700">Trang Quản Lý</div>
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