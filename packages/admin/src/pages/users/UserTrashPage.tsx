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

    // --- RTK Query ---
    const { data: usersData, isLoading, isFetching } = useGetUsersQuery({
        ...filters,
        search: debouncedSearchTerm,
        trang_thai: false, // Chỉ lấy user đã xóa (ngưng hoạt động)
    });
    const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery({ page: 1, limit: 100 });
    const [restoreUser, { isLoading: isRestoring }] = useRestoreUserMutation();
    const [permanentlyDeleteUser, { isLoading: isHardDeleting }] = usePermanentlyDeleteUserMutation();


    // --- Handlers ---
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


    // --- Table columns ---
    const columns = useMemo(() => [
        {
            title: 'Avatar', dataIndex: 'media_files', key: 'avatar',
            render: (media: User['media_files']) => <Avatar src={media?.file_url} />,
        },
        { title: 'Họ tên', dataIndex: 'ho_ten', key: 'ho_ten' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Loại TK', dataIndex: 'loai_nguoi_dung', key: 'loai_nguoi_dung',
            render: (type: UserType) => <Tag color={type === UserType.NHAN_VIEN ? 'blue' : 'purple'}>{type}</Tag>
        },
        {
            title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trang_thai',
            render: (status: boolean) => <Tag color={status ? 'green' : 'red'}>{status ? 'Hoạt động' : 'Ngưng'}</Tag>
        },
        {
            title: 'Thao tác', key: 'action', align: 'center' as const,
            render: (_: any, record: User) => (
                <Space size="middle">
                    <Button type="primary" icon={<UndoOutlined />} onClick={() => handleRestore(record.id)}>Khôi phục</Button>
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handlePermanentDelete(record.id)}>Xóa vĩnh viễn</Button>
                </Space>
            ),
        },
    ], [handleRestore, handlePermanentDelete]);

    const activeTabKey = filters.searchUserType === UserType.KHACH_HANG ? 'customers' : (filters.searchUserType === UserType.NHAN_VIEN ? 'employees' : 'all');

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/users')} className="mb-4">
                Quay lại danh sách
            </Button>
            <h2 className="text-2xl font-bold mb-4">Người dùng đã xóa (Thùng rác)</h2>

            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} md={8}>
                    <Search
                        placeholder="Tìm theo tên hoặc email..."
                        onSearch={handleSearch}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        allowClear
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
                    >
                        {roles?.map((role) => (
                            <Option key={role.id} value={role.id}>{role.ten_vai_tro}</Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            <Tabs activeKey={activeTabKey} onChange={handleTabChange} className="mb-4">
                <TabPane tab="Tất cả" key="all" />
                <TabPane tab="Khách hàng" key="customers" />
                <TabPane tab="Nhân viên" key="employees" />
            </Tabs>

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
            />
        </div>
    );
};

export default UserTrashPage;