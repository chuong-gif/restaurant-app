// packages/admin/src/pages/users/UserListPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
    Table,
    Button,
    Input,
    Select,
    Tag,
    Space,
    Row,
    Col,
    Avatar,
    App,
    Tabs // <-- Import Tabs
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';

import { useGetUsersQuery, useDeleteUserMutation } from '../../features/users/userApi';
import { useGetRolesQuery } from '../../features/roles/roleApi'; // Import Role API
import { setUserFilters, setUserPage } from '../../features/users/userSlice';
import { RootState } from '../../app/store';
import { User, UserType } from '../../types/user';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const UserListPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message, modal } = App.useApp();

    const filters = useSelector((state: RootState) => state.userFilters);
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    // --- RTK Query ---
    const {
        data: usersData,
        isLoading,
        isFetching,
    } = useGetUsersQuery({
        ...filters,
        search: debouncedSearchTerm,
        trang_thai: true, // Chỉ lấy user đang hoạt động ở trang chính
    });

    // Lấy danh sách Vai trò cho bộ lọc
    const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery({ page: 1, limit: 100 });

    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

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

    // --- Table columns ---
    const columns = useMemo(() => [
        {
            title: 'Avatar',
            dataIndex: 'media_files',
            key: 'avatar',
            render: (media_files: User['media_files']) => <Avatar src={media_files?.file_url} />,
        },
        { title: 'Họ tên', dataIndex: 'ho_ten', key: 'ho_ten', sorter: (a: User, b: User) => a.ho_ten.localeCompare(b.ho_ten) },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Điện thoại', dataIndex: 'dien_thoai', key: 'dien_thoai' },
        {
            title: 'Loại TK', dataIndex: 'loai_nguoi_dung', key: 'loai_nguoi_dung',
            render: (type: UserType) => <Tag color={type === UserType.NHAN_VIEN ? 'blue' : 'purple'}>{type}</Tag>
        },
        {
            title: 'Vai trò', dataIndex: 'vai_tro', key: 'vai_tro',
            render: (role: User['vai_tro']) => role?.ten_vai_tro || '-'
        },
        {
            title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trang_thai',
            render: (status: boolean) => <Tag color={status ? 'green' : 'red'}>{status ? 'Hoạt động' : 'Ngưng'}</Tag>
        },
        {
            title: 'Thao tác', key: 'action', align: 'center' as const,
            render: (_: any, record: User) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>Sửa</Button>
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Xóa</Button>
                </Space>
            ),
        },
    ], [handleEdit, handleDelete]);

    // Xác định tab đang active
    const activeTabKey = filters.searchUserType === UserType.KHACH_HANG ? 'customers' : (filters.searchUserType === UserType.NHAN_VIEN ? 'employees' : 'all');

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý Người dùng</h2>

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
                        disabled={filters.searchUserType === UserType.KHACH_HANG} // Disable nếu đang xem KH
                    >
                        {roles?.map((role) => (
                            <Option key={role.id} value={role.id}>{role.ten_vai_tro}</Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={24} md={8} className="flex justify-end gap-2">
                    <Button type="default" icon={<DeleteOutlined />} onClick={() => navigate('/users/trash')}>
                        Thùng rác
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                        Thêm mới
                    </Button>
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
                loading={isLoading || isFetching || isDeleting || isLoadingRoles}
                pagination={{
                    current: usersData?.currentPage || 1,
                    pageSize: filters.limit || 10,
                    total: usersData?.total || 0,
                    onChange: handlePageChange,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
                }}
                scroll={{ x: 'max-content' }} // Cho phép cuộn ngang nếu bảng quá rộng
            />
        </div>
    );
};

export default UserListPage;