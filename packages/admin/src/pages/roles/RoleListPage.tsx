// packages/admin/src/pages/roles/RoleListPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, Button, Input, Space, App, Tooltip, Typography, Tag, Row, Col, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';

import { useGetRolesQuery, useDeleteRoleMutation } from '../../features/roles/roleApi';
import RoleFormModal from '../../features/roles/RoleFormModal';
import { Role } from '../../types/user';
import { formatDateTime } from '../../utils/FormatDateTime';

const { Search } = Input;
const { Text } = Typography;

const RoleListPage: React.FC = () => {
    const { message, modal } = App.useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

    const { data: rolesData, isLoading, isFetching, error } = useGetRolesQuery({
        page: pagination.current,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
    });
    const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

    useEffect(() => {
        setPagination(prev => ({ ...prev, current: 1 }));
    }, [debouncedSearchTerm]);

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

    const columns = useMemo(() => [
        {
            title: 'STT', key: 'stt', align: 'center' as const, width: 80,
            render: (_: any, __: Role, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'ten_vai_tro',
            key: 'name',
            render: (text: string) => <span className="text-blue-700 font-medium">{text}</span>
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            key: 'description',
            render: (desc: string) => <span className="text-gray-600">{desc || '-'}</span>
        },
        {
            title: 'Ngày tạo/Cập nhật', key: 'dates', width: 250,
            render: (_: any, record: Role) => (
                <div className="text-gray-500 text-sm">
                    <Text type="secondary">Chưa có dữ liệu ngày</Text>
                </div>
            )
        },
        {
            title: 'Thao tác', key: 'action', align: 'center' as const, width: 150,
            render: (_: any, record: Role) => {
                const isDisabled = record.ten_vai_tro === 'Super Admin' || record.ten_vai_tro === 'Chưa phân loại';
                let tooltipTitle = '';
                if (isDisabled) {
                    tooltipTitle = `Không thể ${record.ten_vai_tro === 'Super Admin' ? 'sửa/xóa Super Admin' : 'sửa/xóa vai trò mặc định'}`;
                }

                return (
                    <Tooltip title={tooltipTitle}>
                        <Space size="small">
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                                disabled={isDisabled}
                                className="glass-button-secondary rounded-lg"
                            >
                                Sửa
                            </Button>
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record.id, record.ten_vai_tro)}
                                disabled={isDisabled}
                                className="rounded-lg"
                            >
                                Xóa
                            </Button>
                        </Space>
                    </Tooltip>
                );
            },
        },
    ], [pagination, handleEdit, handleDelete]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="animate-fade-in">
                <div className="glass-card rounded-3xl p-8 mb-8 shadow-soft">
                    <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Quản lý Vai trò
                    </h2>
                    <p className="text-gray-600 mb-6">Quản lý và phân quyền cho các vai trò trong hệ thống</p>

                    <Row gutter={[16, 16]} className="mb-4" justify="space-between">
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="Tìm kiếm vai trò ở đây!"
                                onChange={(e) => handleSearch(e.target.value)}
                                allowClear
                                className="glass-search rounded-xl"
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddNew}
                                className="glass-button-primary rounded-xl shadow-soft hover:shadow-float transition-all duration-300"
                            >
                                Thêm mới Vai trò
                            </Button>
                        </Col>
                    </Row>

                    {error && (
                        <div className="animate-slide-up mb-4">
                            <Alert
                                message="Lỗi tải dữ liệu"
                                description={(error as any)?.data?.message || 'Không thể tải danh sách vai trò.'}
                                type="error"
                                showIcon
                                className="rounded-2xl"
                            />
                        </div>
                    )}

                    <div className="glass-table rounded-2xl overflow-hidden">
                        <Table
                            columns={columns}
                            dataSource={rolesData?.data || []}
                            rowKey="id"
                            loading={isLoading || isFetching || isDeleting}
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: rolesData?.total || 0,
                                pageSizeOptions: ['5', '10', '20', '50'],
                                showSizeChanger: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} vai trò`,
                            }}
                            onChange={handleTableChange}
                            scroll={{ x: 'max-content' }}
                            className="neumorphic-table"
                        />
                    </div>
                </div>

                <RoleFormModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    role={selectedRole}
                />
            </div>

            <style >{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                }

                .glass-search {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(10px);
                }

                .glass-table {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(15px);
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

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }

                .animate-slide-up {
                    animation: slide-up 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default RoleListPage;