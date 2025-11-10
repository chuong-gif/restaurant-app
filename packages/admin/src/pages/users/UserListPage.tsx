// packages/admin/src/pages/users/UserListPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Table, Button, Input, Select, Tag, Space, Row, Col, Avatar, App, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';

import { useGetUsersQuery, useDeleteUserMutation } from '../../features/users/userApi';
import { useGetRolesQuery } from '../../features/roles/roleApi';
import { setUserFilters, setUserPage } from '../../features/users/userSlice';
import { RootState } from '../../app/store';
import { User, UserType } from '../../types/user';
import { useAuth } from '../../hooks/useAuth';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const UserListPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message, modal } = App.useApp();
    const { user } = useAuth();

    const filters = useSelector((state: RootState) => state.userFilters);
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const { data: usersData, isLoading, isFetching } = useGetUsersQuery({
        ...filters,
        search: debouncedSearchTerm,
        trang_thai: true,
    });
    const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery({ page: 1, limit: 100 });
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const hasPermission = useCallback((permission: string): boolean => {
        return user?.permissions?.includes(permission) ?? false;
    }, [user]);

    const handleTabChange = useCallback((key: string) => {
        let userType: UserType | undefined;
        if (key === 'customers') userType = UserType.KHACH_HANG;
        else if (key === 'employees') userType = UserType.NHAN_VIEN;
        dispatch(setUserFilters({ searchUserType: userType, page: 1 }));
    }, [dispatch]);

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        dispatch(setUserFilters({ search: value, page: 1 }));
    }, [dispatch]);

    const handleRoleChange = useCallback((value: number | undefined) => {
        dispatch(setUserFilters({ searchRoleId: value, page: 1 }));
    }, [dispatch]);

    const handlePageChange = useCallback((page: number) => {
        dispatch(setUserPage(page));
    }, [dispatch]);

    const handleAddNew = useCallback(() => {
        navigate('/users/new');
    }, [navigate]);

    const handleEdit = useCallback((id: number) => {
        navigate(`/users/edit/${id}`);
    }, [navigate]);

    const handleDelete = useCallback((id: number) => {
        modal.confirm({
            title: 'Xác nhận tạm xóa',
            content: 'Bạn có chắc muốn tạm xóa (ngưng hoạt động) người dùng này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            className: 'glass-modal',
            onOk: async () => {
                try {
                    await deleteUser(id).unwrap();
                    message.success('Tạm xóa người dùng thành công.');
                } catch (error: any) {
                    message.error(error.data?.message || 'Tạm xóa người dùng thất bại.');
                }
            },
        });
    }, [deleteUser, message, modal]);

    const columns = useMemo(() => [
        {
            title: 'Avatar',
            dataIndex: 'media_files',
            key: 'avatar',
            render: (media_files: User['media_files']) => (
                <div className="glass-avatar rounded-xl p-1">
                    <Avatar src={media_files?.file_url} size={40} />
                </div>
            ),
        },
        {
            title: 'Họ tên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
            sorter: (a: User, b: User) => a.ho_ten.localeCompare(b.ho_ten),
            render: (text: string) => <span className="font-medium text-gray-800">{text}</span>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => <span className="text-gray-600">{text}</span>
        },
        {
            title: 'Điện thoại',
            dataIndex: 'dien_thoai',
            key: 'dien_thoai',
            render: (text: string) => <span className="text-gray-600">{text || '-'}</span>
        },
        {
            title: 'Loại TK',
            dataIndex: 'loai_nguoi_dung',
            key: 'loai_nguoi_dung',
            render: (type: UserType) => (
                <Tag
                    color={type === UserType.NHAN_VIEN ? 'blue' : 'purple'}
                    className="rounded-full px-3 py-1 font-medium shadow-soft"
                >
                    {type === UserType.NHAN_VIEN ? 'Nhân viên' : 'Khách hàng'}
                </Tag>
            )
        },
        {
            title: 'Vai trò',
            dataIndex: 'vai_tro',
            key: 'vai_tro',
            render: (role: User['vai_tro']) => (
                <span className="text-gray-600">{role?.ten_vai_tro || '-'}</span>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            render: (status: boolean) => (
                <Tag
                    color={status ? 'green' : 'red'}
                    className="rounded-full px-3 py-1 font-medium shadow-soft"
                >
                    {status ? 'Hoạt động' : 'Ngưng'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
            render: (_: any, record: User) => (
                <Space size="middle">
                    {hasPermission('edit_user') && (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.id)}
                            className="glass-button-edit rounded-lg shadow-soft hover:shadow-float transition-all"
                        >
                            Sửa
                        </Button>
                    )}
                    {hasPermission('soft_delete_user') && (
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                            className="rounded-lg shadow-soft hover:shadow-float transition-all"
                        >
                            Xóa
                        </Button>
                    )}
                </Space>
            ),
        },
    ], [handleEdit, handleDelete, hasPermission]);

    const activeTabKey = filters.searchUserType === UserType.KHACH_HANG ? 'customers' : (filters.searchUserType === UserType.NHAN_VIEN ? 'employees' : 'all');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="animate-fade-in">
                <div className="glass-card rounded-3xl p-8 shadow-soft">
                    <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Quản lý Người dùng
                    </h2>
                    <p className="text-gray-600 mb-6">Quản lý và theo dõi tất cả người dùng trong hệ thống</p>

                    <Row gutter={[16, 16]} className="mb-6">
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="Tìm theo tên hoặc email..."
                                onSearch={handleSearch}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                                allowClear
                                className="glass-search rounded-xl"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Select
                                placeholder="Lọc theo vai trò (chỉ NV)"
                                style={{ width: '100%' }}
                                onChange={handleRoleChange}
                                value={filters.searchRoleId}
                                allowClear
                                loading={isLoadingRoles}
                                disabled={filters.searchUserType === UserType.KHACH_HANG}
                                className="glass-select rounded-xl"
                            >
                                {Array.isArray(roles) && roles.map((role) => (
                                    <Option key={role.id} value={role.id}>{role.ten_vai_tro}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs={24} sm={24} md={8} className="flex justify-end gap-2">
                            {hasPermission('view_user_trash') && (
                                <Button
                                    type="default"
                                    icon={<DeleteOutlined />}
                                    onClick={() => navigate('/users/trash')}
                                    className="glass-button-secondary rounded-xl shadow-soft hover:shadow-float transition-all"
                                >
                                    Thùng rác
                                </Button>
                            )}
                            {hasPermission('add_user') && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddNew}
                                    className="glass-button-primary rounded-xl shadow-soft hover:shadow-float transition-all"
                                >
                                    Thêm mới
                                </Button>
                            )}
                        </Col>
                    </Row>

                    <div className="glass-tabs rounded-2xl p-1 mb-6">
                        <Tabs
                            activeKey={activeTabKey}
                            onChange={handleTabChange}
                            className="custom-tabs"
                        >
                            <TabPane tab="Tất cả" key="all" />
                            <TabPane tab="Khách hàng" key="customers" />
                            <TabPane tab="Nhân viên" key="employees" />
                        </Tabs>
                    </div>

                    <div className="glass-table rounded-2xl overflow-hidden">
                        <Table
                            columns={columns}
                            dataSource={usersData?.data || []}
                            rowKey="id"
                            loading={isLoading || isFetching || isDeleting || isLoadingRoles}
                            pagination={{
                                current: usersData?.currentPage || 1,
                                pageSize: filters.limit || 10,
                                total: usersData?.total || 0,
                                onChange: handlePageChange,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
                            }}
                            scroll={{ x: 'max-content' }}
                            className="neumorphic-table"
                        />
                    </div>
                </div>
            </div>

            <style >{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                }

                .glass-search :global(.ant-input),
                .glass-select :global(.ant-select-selector) {
                    background: rgba(255, 255, 255, 0.4) !important;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    border-radius: 12px !important;
                }

                .glass-button-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    box-shadow: 0 4px 15px 0 rgba(116, 75, 162, 0.3);
                }

                .glass-button-secondary {
                    background: rgba(255, 255, 255, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    color: #667eea;
                }

                .glass-button-edit {
                    background: rgba(255, 255, 255, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    color: #667eea;
                }

                .glass-tabs {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                }

                .glass-table {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(15px);
                }

                .glass-avatar {
                    background: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                }

                .glass-modal :global(.ant-modal-content) {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 20px;
                }

                .shadow-soft {
                    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.8) inset;
                }

                .shadow-float {
                    box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
                }

                .neumorphic-table :global(.ant-table) {
                    background: transparent;
                }

                .neumorphic-table :global(.ant-table-thead > tr > th) {
                    background: rgba(255, 255, 255, 0.3) !important;
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
                }

                .neumorphic-table :global(.ant-table-tbody > tr > td) {
                    background: rgba(255, 255, 255, 0.2);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                }

                .neumorphic-table :global(.ant-table-tbody > tr:hover > td) {
                    background: rgba(255, 255, 255, 0.4) !important;
                }

                .custom-tabs :global(.ant-tabs-nav) {
                    margin-bottom: 0;
                }

                .custom-tabs :global(.ant-tabs-tab) {
                    background: transparent !important;
                    border: none !important;
                    border-radius: 12px;
                    margin: 0 2px;
                }

                .custom-tabs :global(.ant-tabs-tab-active) {
                    background: rgba(255, 255, 255, 0.4) !important;
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

export default UserListPage;