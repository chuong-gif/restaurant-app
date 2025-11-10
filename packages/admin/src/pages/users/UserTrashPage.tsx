// packages/admin/src/pages/users/UserTrashPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
    Table, Button, Input, Select, Tag, Space, Row, Col, Avatar, App, Tabs
} from 'antd';
import { UndoOutlined, ArrowLeftOutlined, WarningOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';

import { useGetUsersQuery, useRestoreUserMutation, usePermanentlyDeleteUserMutation } from '../../features/users/userApi';
import { useGetRolesQuery } from '../../features/roles/roleApi';
import { setUserFilters, setUserPage } from '../../features/users/userSlice';
import type { RootState } from '../../app/store';
import { User, UserType } from '../../types/user';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const UserTrashPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message, modal } = App.useApp();

    const filters = useSelector((state: RootState) => state.userFilters);
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const { data: usersData, isLoading, isFetching } = useGetUsersQuery({
        ...filters,
        search: debouncedSearchTerm,
        trang_thai: false,
    });
    const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery({ page: 1, limit: 100 });
    const [restoreUser, { isLoading: isRestoring }] = useRestoreUserMutation();
    const [permanentlyDeleteUser, { isLoading: isHardDeleting }] = usePermanentlyDeleteUserMutation();

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

    const handleRestore = useCallback((id: number) => {
        modal.confirm({
            title: 'Xác nhận khôi phục',
            content: 'Bạn có chắc muốn khôi phục người dùng này?',
            okText: 'Khôi phục',
            cancelText: 'Hủy',
            className: 'glass-modal',
            onOk: async () => {
                try {
                    await restoreUser(id).unwrap();
                    message.success('Khôi phục người dùng thành công.');
                } catch (error: any) {
                    message.error(error.data?.message || 'Khôi phục người dùng thất bại.');
                }
            },
        });
    }, [restoreUser, message, modal]);

    const handlePermanentDelete = useCallback((id: number) => {
        modal.confirm({
            title: 'XÁC NHẬN XÓA VĨNH VIỄN',
            icon: <WarningOutlined style={{ color: 'red' }} />,
            content: 'Hành động này không thể hoàn tác! Bạn có chắc muốn XÓA VĨNH VIỄN người dùng này?',
            okText: 'Xóa vĩnh viễn',
            okType: 'danger',
            cancelText: 'Hủy',
            className: 'glass-modal-danger',
            onOk: async () => {
                try {
                    await permanentlyDeleteUser(id).unwrap();
                    message.success('Xóa vĩnh viễn người dùng thành công.');
                } catch (error: any) {
                    message.error(error.data?.message || 'Xóa vĩnh viễn thất bại.');
                }
            },
        });
    }, [permanentlyDeleteUser, message, modal]);

    const columns = useMemo(() => [
        {
            title: 'Avatar',
            dataIndex: 'media_files',
            key: 'avatar',
            render: (media: User['media_files']) => (
                <div className="glass-avatar rounded-xl p-1">
                    <Avatar src={media?.file_url} size={40} />
                </div>
            ),
        },
        {
            title: 'Họ tên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
            render: (text: string) => <span className="font-medium text-gray-800">{text}</span>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => <span className="text-gray-600">{text}</span>
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
                    <Button
                        type="primary"
                        icon={<UndoOutlined />}
                        onClick={() => handleRestore(record.id)}
                        className="glass-button-restore rounded-lg shadow-soft hover:shadow-float transition-all"
                    >
                        Khôi phục
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handlePermanentDelete(record.id)}
                        className="rounded-lg shadow-soft hover:shadow-float transition-all"
                    >
                        Xóa vĩnh viễn
                    </Button>
                </Space>
            ),
        },
    ], [handleRestore, handlePermanentDelete]);

    const activeTabKey = filters.searchUserType === UserType.KHACH_HANG ? 'customers' : (filters.searchUserType === UserType.NHAN_VIEN ? 'employees' : 'all');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="animate-fade-in">
                <div className="glass-card rounded-3xl p-8 shadow-soft">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/users')}
                        className="glass-button-back rounded-xl mb-6 shadow-soft hover:shadow-float transition-all"
                    >
                        Quay lại danh sách
                    </Button>

                    <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                        Người dùng đã xóa (Thùng rác)
                    </h2>
                    <p className="text-gray-600 mb-6">Quản lý và khôi phục người dùng đã bị xóa tạm thời</p>

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
                                {roles?.data?.map((role) => (
                                    <Option key={role.id} value={role.id}>{role.ten_vai_tro}</Option>
                                ))}
                            </Select>
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
                            loading={isLoading || isFetching || isRestoring || isHardDeleting || isLoadingRoles}
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

                .glass-button-back {
                    background: rgba(255, 255, 255, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    color: #667eea;
                }

                .glass-button-restore {
                    background: rgba(255, 255, 255, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    color: #52c41a;
                }

                .glass-search :global(.ant-input),
                .glass-select :global(.ant-select-selector) {
                    background: rgba(255, 255, 255, 0.4) !important;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    border-radius: 12px !important;
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

                .glass-modal :global(.ant-modal-content),
                .glass-modal-danger :global(.ant-modal-content) {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 20px;
                }

                .glass-modal-danger :global(.ant-modal-content) {
                    border: 1px solid rgba(245, 34, 45, 0.3);
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

export default UserTrashPage;