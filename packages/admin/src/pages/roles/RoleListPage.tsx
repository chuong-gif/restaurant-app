// packages/admin/src/pages/roles/RoleListPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, Button, Input, Space, App, Tooltip, Typography, Tag, Row, Col, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';

import { useGetRolesQuery, useDeleteRoleMutation } from '../../features/roles/roleApi';
import RoleFormModal from '../../features/roles/RoleFormModal';
import { Role } from '../../types/user';
import { formatDateTime } from '../../utils/FormatDateTime'; // Import hàm format

const { Search } = Input;
const { Text } = Typography;

const RoleListPage: React.FC = () => {
    const { message, modal } = App.useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // State cho tìm kiếm và phân trang
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 }); // Bắt đầu với 5 mục/trang như hình

    // RTK Query hooks
    const { data: rolesData, isLoading, isFetching, error } = useGetRolesQuery({
        page: pagination.current,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
    });
    const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

    // Reset về trang 1 khi tìm kiếm
    useEffect(() => {
        setPagination(prev => ({ ...prev, current: 1 }));
    }, [debouncedSearchTerm]);


    // Handlers
    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleTableChange = useCallback((newPagination: any) => {
        setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    }, []);

    const handleAddNew = useCallback(() => {
        setSelectedRole(null);
        setIsModalOpen(true);
    }, []);

    const handleEdit = useCallback((role: Role) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((id: number, name: string) => {
        modal.confirm({
            title: `Xác nhận xóa vai trò "${name}"`,
            content: 'Người dùng thuộc vai trò này sẽ được chuyển về vai trò mặc định. Bạn có chắc muốn xóa?',
            okText: 'Xác nhận xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteRole(id).unwrap();
                    message.success(`Xóa vai trò "${name}" thành công.`);
                    // Reset về trang 1 nếu trang hiện tại không còn item nào sau khi xóa
                    if (rolesData?.data.length === 1 && pagination.current > 1) {
                        setPagination(prev => ({ ...prev, current: prev.current - 1 }));
                    }
                } catch (error: any) {
                    message.error(error.data?.message || `Xóa vai trò "${name}" thất bại.`);
                }
            },
        });
    }, [deleteRole, message, modal, rolesData, pagination]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedRole(null);
    }, []);

    // Table columns (dựa theo hình ảnh)
    const columns = useMemo(() => [
        {
            title: 'STT', key: 'stt', align: 'center' as const, width: 80,
            render: (_: any, __: Role, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        { title: 'Tên', dataIndex: 'ten_vai_tro', key: 'name' },
        { title: 'Mô tả', dataIndex: 'mo_ta', key: 'description', render: (desc: string) => desc || '-' },
        {
            title: 'Ngày tạo/Cập nhật', key: 'dates', width: 250,
            // Cần thêm created_at, updated_at vào type Role và API backend nếu muốn hiển thị
            render: (_: any, record: Role) => (
                <div>
                    {/* Giả sử có created_at, updated_at */}
                    {/* <div>Ngày tạo: {formatDateTime(record.created_at)}</div>
                    <div>Cập nhật: {formatDateTime(record.updated_at)}</div> */}
                    <Text type="secondary">Chưa có dữ liệu ngày</Text>
                </div>
            )
        },
        {
            title: 'Thao tác', key: 'action', align: 'center' as const, width: 150,
            render: (_: any, record: Role) => {
                // Không cho sửa/xóa vai trò đặc biệt
                const isDisabled = record.ten_vai_tro === 'Super Admin' || record.ten_vai_tro === 'Chưa phân loại';
                let tooltipTitle = '';
                if (isDisabled) {
                    tooltipTitle = `Không thể ${record.ten_vai_tro === 'Super Admin' ? 'sửa/xóa Super Admin' : 'sửa/xóa vai trò mặc định'}`;
                }

                return (
                    <Tooltip title={tooltipTitle}>
                        <Space size="small">
                            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} disabled={isDisabled}>Sửa</Button>
                            <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id, record.ten_vai_tro)} disabled={isDisabled}>Xóa</Button>
                        </Space>
                    </Tooltip>
                );
            },
        },
    ], [pagination, handleEdit, handleDelete]);


    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý Vai trò</h2>

            <Row gutter={[16, 16]} className="mb-4" justify="space-between">
                <Col xs={24} sm={12} md={8}>
                    <Search
                        placeholder="Tìm kiếm vai trò ở đây!"
                        onChange={(e) => handleSearch(e.target.value)}
                        allowClear
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                        Thêm mới Vai trò
                    </Button>
                </Col>
            </Row>

            {error && <Alert message="Lỗi tải dữ liệu" description={(error as any)?.data?.message || 'Không thể tải danh sách vai trò.'} type="error" showIcon className="mb-4" />}

            <Table
                columns={columns}
                dataSource={rolesData?.data || []}
                rowKey="id"
                loading={isLoading || isFetching || isDeleting}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: rolesData?.total || 0,
                    pageSizeOptions: ['5', '10', '20', '50'], // Giống hình ảnh
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} vai trò`,
                }}
                onChange={handleTableChange} // Sử dụng onChange của antd để xử lý cả phân trang và đổi pageSize
                scroll={{ x: 'max-content' }}
            />

            <RoleFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                role={selectedRole}
            />
        </div>
    );
};

export default RoleListPage;