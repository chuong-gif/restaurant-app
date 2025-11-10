// packages/admin/src/pages/tables/TableListPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, Button, InputNumber, Select, Tag, Space, App, Tooltip, Row, Col, Avatar, Alert, Typography, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, NumberOutlined, EnvironmentOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';

import { useGetAdminTablesQuery, useDeleteTableMutation } from '../../features/tables/tableApi';
import TableFormModal from './TableFormModal';
import { Table as RestaurantTable } from '../../types/product';

const { Option } = Select;

const TableListPage: React.FC = () => {
    const { message, modal } = App.useApp();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);

    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
    const [currentTableNumber, setCurrentTableNumber] = useState<number | null>(null);

    const [filters, setFilters] = useState<{
        page: number;
        limit: number;
        so_ban?: number;
        suc_chua?: number;
        tang?: number;
    }>({ page: 1, limit: 10 });

    const [debouncedFilters] = useDebounce(filters, 500);

    const { data: tablesData, isLoading, isFetching, error } = useGetAdminTablesQuery({
        page: debouncedFilters.page,
        limit: debouncedFilters.limit,
        so_ban: debouncedFilters.so_ban,
        suc_chua: debouncedFilters.suc_chua,
        tang: debouncedFilters.tang,
    });
    const [deleteTable, { isLoading: isDeleting }] = useDeleteTableMutation();

    const handleFilterChange = useCallback((name: keyof typeof filters, value: any) => {
        let processedValue = value;
        if (['so_ban', 'suc_chua', 'tang'].includes(name)) {
            processedValue = value ? parseInt(value, 10) : undefined;
            if (isNaN(processedValue as number)) processedValue = undefined;
        }
        setFilters(prev => ({ ...prev, [name]: processedValue, page: 1 }));
    }, []);

    const handleTableChange = useCallback((newPagination: any) => {
        setFilters(prev => ({
            ...prev,
            page: newPagination.current,
            limit: newPagination.pageSize,
        }));
    }, []);

    const handleAddNew = useCallback(() => {
        setSelectedTable(null);
        setIsFormModalOpen(true);
    }, []);

    const handleEdit = useCallback((table: RestaurantTable) => {
        setSelectedTable(table);
        setIsFormModalOpen(true);
    }, []);

    const handleDelete = useCallback((id: number, tableNumber: number) => {
        modal.confirm({
            title: `Xác nhận xóa Bàn ${tableNumber}`,
            content: 'Bạn có chắc muốn xóa bàn này? Hành động này không thể hoàn tác nếu bàn chưa từng được đặt.',
            okText: 'Xác nhận xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteTable(id).unwrap();
                    message.success(`Xóa Bàn ${tableNumber} thành công.`);
                    if (tablesData?.data.length === 1 && filters.page > 1) {
                        setFilters(prev => ({ ...prev, page: prev.page - 1 }));
                    }
                } catch (error: any) {
                    message.error(error.data?.message || `Xóa Bàn ${tableNumber} thất bại.`);
                }
            },
        });
    }, [deleteTable, message, modal, tablesData, filters]);

    const handleCloseFormModal = useCallback(() => {
        setIsFormModalOpen(false);
        setSelectedTable(null);
    }, []);

    const handleOpenVideoModal = useCallback((videoUrl: string, tableNumber: number) => {
        setCurrentVideoUrl(videoUrl);
        setCurrentTableNumber(tableNumber);
        setIsVideoModalOpen(true);
    }, []);

    const handleCloseVideoModal = useCallback(() => {
        setIsVideoModalOpen(false);
        setCurrentVideoUrl(null);
        setCurrentTableNumber(null);
    }, []);

    const columns = useMemo(() => [
        {
            title: 'Ảnh',
            dataIndex: 'media_files_ban_an_anh_ban_idTomedia_files',
            key: 'image',
            width: 80,
            align: 'center' as const,
            render: (media: { file_url: string } | null) => (
                <div className="glass-avatar rounded-xl p-1">
                    <Avatar src={media?.file_url} shape="square" size={48} className="rounded-lg" />
                </div>
            )
        },
        {
            title: 'Số bàn',
            dataIndex: 'so_ban',
            key: 'so_ban',
            sorter: (a: RestaurantTable, b: RestaurantTable) => a.so_ban - b.so_ban,
            width: 100,
            align: 'center' as const,
            render: (so_ban: number) => <span className="text-blue-700 font-semibold">{so_ban}</span>
        },
        {
            title: 'Sức chứa',
            dataIndex: 'suc_chua',
            key: 'suc_chua',
            sorter: (a: RestaurantTable, b: RestaurantTable) => a.suc_chua - b.suc_chua,
            width: 120,
            align: 'center' as const,
            render: (suc_chua: number) => (
                <div className="flex items-center justify-center space-x-1">
                    <TeamOutlined className="text-green-500" />
                    <span className="text-gray-700">{suc_chua}</span>
                </div>
            )
        },
        {
            title: 'Tầng',
            dataIndex: 'tang',
            key: 'tang',
            sorter: (a: RestaurantTable, b: RestaurantTable) => (a.tang ?? 0) - (b.tang ?? 0),
            width: 80,
            align: 'center' as const,
            render: (tang?: number) => tang ? (
                <div className="flex items-center justify-center space-x-1">
                    <EnvironmentOutlined className="text-purple-500" />
                    <span className="text-gray-700">{tang}</span>
                </div>
            ) : '-'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            width: 120,
            align: 'center' as const,
            render: (status: boolean) => {
                return (
                    <Tag
                        color={status === true ? 'green' : 'red'}
                        className="rounded-full px-3 py-1 font-medium shadow-soft"
                    >
                        {status === true ? 'Trống' : 'Có khách'}
                    </Tag>
                );
            }
        },
        {
            title: 'Mô tả vị trí',
            dataIndex: 'mo_ta_vi_tri',
            key: 'description',
            render: (desc: string) => <span className="text-gray-600">{desc || '-'}</span>
        },
        {
            title: 'Video',
            dataIndex: 'media_files_ban_an_video_ban_idTomedia_files',
            key: 'video',
            width: 80,
            align: 'center' as const,
            render: (media: { file_url: string } | null, record: RestaurantTable) => media ? (
                <Tooltip title="Xem video">
                    <Button
                        type="link"
                        icon={<VideoCameraOutlined style={{ fontSize: '18px' }} />}
                        onClick={() => handleOpenVideoModal(media.file_url, record.so_ban)}
                        className="glass-button-video rounded-lg hover:scale-110 transition-transform"
                    />
                </Tooltip>
            ) : '-'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
            fixed: 'right' as const,
            width: 150,
            render: (_: any, record: RestaurantTable) => (
                <Space size="small">
                    <Tooltip title="Sửa bàn">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            className="glass-button-edit shadow-soft hover:shadow-float transition-all"
                        />
                    </Tooltip>
                    <Tooltip title="Xóa bàn">
                        <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id, record.so_ban)}
                            className="shadow-soft hover:shadow-float transition-all"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ], [handleEdit, handleDelete, handleOpenVideoModal]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="animate-fade-in">
                <div className="glass-card rounded-3xl p-8 mb-8 shadow-soft">
                    <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Quản lý Bàn ăn
                    </h2>
                    <p className="text-gray-600 mb-6">Quản lý thông tin và trạng thái các bàn ăn trong nhà hàng</p>

                    <Row gutter={[16, 16]} className="mb-6">
                        <Col xs={24} sm={12} md={6}>
                            <InputNumber
                                placeholder="Tìm theo số bàn..."
                                value={filters.so_ban}
                                onChange={value => handleFilterChange('so_ban', value)}
                                className="glass-input rounded-xl w-full"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <InputNumber
                                placeholder="Tìm theo sức chứa..."
                                value={filters.suc_chua}
                                onChange={value => handleFilterChange('suc_chua', value)}
                                className="glass-input rounded-xl w-full"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <InputNumber
                                placeholder="Tìm theo tầng..."
                                value={filters.tang}
                                onChange={value => handleFilterChange('tang', value)}
                                className="glass-input rounded-xl w-full"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6} className="flex justify-end">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddNew}
                                className="glass-button-primary rounded-xl shadow-soft hover:shadow-float transition-all duration-300"
                            >
                                Thêm mới Bàn
                            </Button>
                        </Col>
                    </Row>

                    {error && (
                        <div className="animate-slide-up mb-6">
                            <Alert
                                message="Lỗi tải dữ liệu"
                                description={(error as any)?.data?.message || 'Không thể tải danh sách bàn ăn.'}
                                type="error"
                                showIcon
                                className="rounded-2xl"
                            />
                        </div>
                    )}

                    <div className="glass-table rounded-2xl overflow-hidden">
                        <Table
                            columns={columns}
                            dataSource={tablesData?.data || []}
                            rowKey="id"
                            loading={isLoading || isFetching || isDeleting}
                            pagination={{
                                current: filters.page,
                                pageSize: filters.limit,
                                total: tablesData?.total || 0,
                                pageSizeOptions: ['5', '10', '20', '50'],
                                showSizeChanger: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bàn`,
                            }}
                            onChange={handleTableChange}
                            scroll={{ x: 1200 }}
                            className="neumorphic-table"
                        />
                    </div>
                </div>

                <TableFormModal
                    open={isFormModalOpen}
                    onClose={handleCloseFormModal}
                    table={selectedTable}
                />

                <Modal
                    title={`Video giới thiệu Bàn ${currentTableNumber ?? ''}`}
                    open={isVideoModalOpen}
                    onCancel={handleCloseVideoModal}
                    footer={null}
                    destroyOnClose
                    width={800}
                    className="glass-modal"
                    styles={{
                        body: {
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)'
                        }
                    }}
                >
                    <div className="rounded-2xl overflow-hidden">
                        {currentVideoUrl ? (
                            <video controls autoPlay width="100%" src={currentVideoUrl} className="rounded-lg">
                                Trình duyệt của bạn không hỗ trợ thẻ video.
                            </video>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Không có video để hiển thị.</p>
                        )}
                    </div>
                </Modal>
            </div>

            <style >{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                }

                .glass-input :global(.ant-input-number) {
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

                .glass-button-video {
                    background: rgba(255, 255, 255, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    color: #667eea;
                }

                .glass-button-edit {
                    background: rgba(255, 255, 255, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    color: #667eea;
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
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
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

export default TableListPage;