// packages/admin/src/layouts/AdminLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useAuth } from '../hooks/useAuth';
import {
    DashboardOutlined, AppstoreOutlined, FileTextOutlined, SettingOutlined, UserOutlined,
    CalendarOutlined, TeamOutlined, DownOutlined, GiftOutlined, ShopOutlined, ReadOutlined,
    MessageOutlined, SafetyCertificateOutlined, SolutionOutlined, RightOutlined, DeleteOutlined,
    LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, DesktopOutlined // <-- Thêm icon này
} from '@ant-design/icons';

interface MenuItem {
    key: string;
    icon: React.ReactNode;
    label: React.ReactNode;
    path?: string;
    children?: MenuItem[];
    requiredPermission?: string;
}

const menuItems: MenuItem[] = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/dashboard' },

    {
        key: 'food', icon: <ShopOutlined />, label: 'Quản Lý Món Ăn', requiredPermission: 'view_product_category', children: [
            { key: 'categories', icon: <AppstoreOutlined />, label: 'Danh mục', path: '/categories', requiredPermission: 'view_product_category' },
            { key: 'products', icon: <AppstoreOutlined />, label: 'Sản phẩm', path: '/products', requiredPermission: 'view_product' },
            { key: 'products-trash', icon: <DeleteOutlined />, label: 'Thùng rác SP', path: '/products/trash', requiredPermission: 'view_product_trash' },
        ]
    },
    {
        key: 'blog', icon: <ReadOutlined />, label: 'Quản Lý Bài Viết', children: [
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
                requiredPermission: 'view_user'
            },
        ]
    },
    {
        key: 'booking', icon: <CalendarOutlined />, label: 'Quản Lý Đặt Bàn', requiredPermission: 'view_table', children: [
            { key: 'pos', icon: <DesktopOutlined />, label: 'Sơ đồ bàn', path: '/pos', requiredPermission: 'view_pos' },
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
                requiredPermission: 'assign_permission_to_role'
            },
            { key: 'role-list', icon: <TeamOutlined />, label: 'Vai trò', path: '/roles', requiredPermission: 'view_role' },
        ]
    },
];

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const hasPermission = (permission?: string): boolean => {
        if (!permission) return true;
        return user?.permissions?.includes(permission) ?? false;
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

    const renderMenuItems = (items: MenuItem[]): React.ReactNode[] => {
        return items
            .filter(item => hasPermission(item.requiredPermission))
            .map(item => {
                const visibleChildren = item.children?.filter(child => hasPermission(child.requiredPermission));

                if (item.children && visibleChildren?.length === 0) {
                    return null;
                }

                if (item.children && visibleChildren && visibleChildren.length > 0) {
                    return (
                        <li key={item.key} className={`mb-1 ${openKeys.includes(item.key) ? 'bg-blue-700/30 rounded-xl' : ''}`}>
                            <div
                                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-700/20 cursor-pointer transition-all duration-300 group"
                                onClick={() => onOpenChange(openKeys.includes(item.key) ? openKeys.filter(k => k !== item.key) : [...openKeys, item.key])}
                            >
                                <span className="flex items-center">
                                    <span className="text-lg text-blue-100 group-hover:text-white transition-colors">
                                        {item.icon}
                                    </span>
                                    {!sidebarCollapsed && (
                                        <span className="ml-3 text-blue-100 group-hover:text-white transition-colors">
                                            {item.label}
                                        </span>
                                    )}
                                </span>
                                {!sidebarCollapsed && (
                                    openKeys.includes(item.key) ?
                                        <DownOutlined className="text-xs text-blue-200" /> :
                                        <RightOutlined className="text-xs text-blue-200" />
                                )}
                            </div>
                            {openKeys.includes(item.key) && !sidebarCollapsed && (
                                <ul className="pl-6 mt-2 border-l border-blue-400/30 ml-4">
                                    {renderMenuItems(visibleChildren)}
                                </ul>
                            )}
                        </li>
                    );
                }

                return (
                    <li key={item.key} className="mb-1">
                        <Link
                            to={item.path || '#'}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${location.pathname === item.path ?
                                'bg-blue-600 border border-blue-400/50 shadow-lg' :
                                'hover:bg-blue-700/20'
                                }`}
                        >
                            <span className={`text-lg transition-colors ${location.pathname === item.path ?
                                'text-white' :
                                'text-blue-100 group-hover:text-white'
                                }`}>
                                {item.icon}
                            </span>
                            {!sidebarCollapsed && (
                                <span className={`ml-3 transition-colors ${location.pathname === item.path ?
                                    'text-white font-medium' :
                                    'text-blue-100 group-hover:text-white'
                                    }`}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    </li>
                );
            })
            .filter(Boolean);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            {/* Sidebar */}
            <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} glass-sidebar flex flex-col transition-all duration-300 relative z-10`}>
                <div className="p-6 border-b border-blue-500/30">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-lg">
                                    <span className="text-blue-700 font-bold text-sm">A</span>
                                </div>
                                <h1 className="text-xl font-bold text-white">
                                    Admin Panel
                                </h1>
                            </div>
                        )}
                        {sidebarCollapsed && (
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mx-auto shadow-lg">
                                <span className="text-blue-700 font-bold text-sm">A</span>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="glass-button-icon rounded-lg p-2 hover:bg-blue-600 transition-all"
                        >
                            {sidebarCollapsed ?
                                <MenuUnfoldOutlined className="text-blue-100" /> :
                                <MenuFoldOutlined className="text-blue-100" />
                            }
                        </button>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-6 overflow-y-auto">
                    <ul className="space-y-1">
                        {renderMenuItems(menuItems)}
                    </ul>
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-blue-500/30">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-700 font-semibold shadow-lg">
                            {user?.ho_ten?.charAt(0) || 'U'}
                        </div>
                        {!sidebarCollapsed && (
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{user?.ho_ten}</p>
                                <p className="text-blue-200 text-sm truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="glass-button-logout w-full flex items-center justify-center px-4 py-2 rounded-xl hover:bg-red-600/30 transition-all duration-300 group border border-red-400/30"
                    >
                        <LogoutOutlined className="text-red-200 group-hover:text-red-100 transition-colors" />
                        {!sidebarCollapsed && (
                            <span className="ml-2 text-red-200 group-hover:text-red-100 transition-colors">
                                Đăng xuất
                            </span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="glass-header px-6 py-4 border-b border-blue-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {menuItems.find(item =>
                                    item.path === location.pathname ||
                                    item.children?.some(child => child.path === location.pathname)
                                )?.label || 'Dashboard'}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-gray-700 font-medium">{user?.ho_ten}</p>
                                <p className="text-gray-500 text-sm">{user?.vai_tro?.ten_vai_tro || 'Người dùng'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                {user?.ho_ten?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto bg-blue-50/30">
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>

            <style>{`
                .glass-sidebar {
                    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
                    backdrop-filter: blur(20px);
                    border-right: 1px solid rgba(59, 130, 246, 0.3);
                    box-shadow: 0 8px 32px 0 rgba(30, 58, 138, 0.2);
                }

                .glass-header {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(59, 130, 246, 0.2);
                }

                .glass-button-icon {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .glass-button-logout {
                    background: rgba(239, 68, 68, 0.1);
                    backdrop-filter: blur(10px);
                }

                /* Custom scrollbar for sidebar */
                .glass-sidebar nav::-webkit-scrollbar {
                    width: 6px;
                }

                .glass-sidebar nav::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }

                .glass-sidebar nav::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                }

                .glass-sidebar nav::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;