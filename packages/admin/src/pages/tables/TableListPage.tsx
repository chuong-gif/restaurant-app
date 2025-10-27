// packages/admin/src/pages/tables/TableListPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, Button, InputNumber, Select, Tag, Space, App, Tooltip, Row, Col, Avatar, Alert, Typography, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, NumberOutlined, EnvironmentOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';

import { useGetAdminTablesQuery, useDeleteTableMutation } from '../../features/tables/tableApi';
import TableFormModal from './TableFormModal'; // Import modal
import { Table as RestaurantTable } from '../../types/product'; // Import type

const { Option } = Select;


const TableListPage: React.FC = () => {
    const { message, modal } = App.useApp();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);

    // === THÊM STATE CHO VIDEO MODAL ===
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
    const [currentTableNumber, setCurrentTableNumber] = useState<number | null>(null);
    // =================================

    // State cho bộ lọc
    const [filters, setFilters] = useState<{
        page: number;
        limit: number;
        so_ban?: number;
        suc_chua?: number;
        tang?: number;
    }>({ page: 1, limit: 10 });

    const [debouncedFilters] = useDebounce(filters, 500); // Debounce toàn bộ filter

    // RTK Query hooks
    const { data: tablesData, isLoading, isFetching, error } = useGetAdminTablesQuery({
        page: debouncedFilters.page,
        limit: debouncedFilters.limit, // API service dùng 'limit'
        so_ban: debouncedFilters.so_ban,
        suc_chua: debouncedFilters.suc_chua,
        tang: debouncedFilters.tang,
    });
    const [deleteTable, { isLoading: isDeleting }] = useDeleteTableMutation();

    // Handlers
    const handleFilterChange = useCallback((name: keyof typeof filters, value: any) => {
        // Chuyển đổi sang number nếu là input number, undefined nếu rỗng
        let processedValue = value;
        if (['so_ban', 'suc_chua', 'tang'].includes(name)) {
            processedValue = value ? parseInt(value, 10) : undefined;
            if (isNaN(processedValue as number)) processedValue = undefined;
        }
        setFilters(prev => ({ ...prev, [name]: processedValue, page: 1 })); // Reset về trang 1 khi lọc
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
        setIsFormModalOpen(true); // Mở modal form
    }, []);

    const handleEdit = useCallback((table: RestaurantTable) => {
        setSelectedTable(table);
        setIsFormModalOpen(true); // Mở modal form
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
                    // Logic tự động refresh hoặc xử lý pagination nếu cần
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

    // === THÊM HANDLERS CHO VIDEO MODAL ===
    const handleOpenVideoModal = useCallback((videoUrl: string, tableNumber: number) => {
        setCurrentVideoUrl(videoUrl);
        setCurrentTableNumber(tableNumber);
        setIsVideoModalOpen(true);
    }, []);

    const handleCloseVideoModal = useCallback(() => {
        setIsVideoModalOpen(false);
        setCurrentVideoUrl(null); // Reset URL
        setCurrentTableNumber(null);
    }, []);
    // ===================================

    // Table columns
    const columns = useMemo(() => [
        {
            title: 'Ảnh', dataIndex: 'media_files_ban_an_anh_ban_idTomedia_files', key: 'image', width: 80, align: 'center' as const,
            render: (media: { file_url: string } | null) => <Avatar src={media?.file_url} shape="square" size={48} />
        },
        { title: 'Số bàn', dataIndex: 'so_ban', key: 'so_ban', sorter: (a: RestaurantTable, b: RestaurantTable) => a.so_ban - b.so_ban, width: 100, align: 'center' as const },
        { title: 'Sức chứa', dataIndex: 'suc_chua', key: 'suc_chua', sorter: (a: RestaurantTable, b: RestaurantTable) => a.suc_chua - b.suc_chua, width: 120, align: 'center' as const },
        { title: 'Tầng', dataIndex: 'tang', key: 'tang', sorter: (a: RestaurantTable, b: RestaurantTable) => (a.tang ?? 0) - (b.tang ?? 0), width: 80, align: 'center' as const, render: (tang?: number) => tang ?? '-' },
        {
            title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trang_thai', width: 120, align: 'center' as const,
            // === SỬA LẠI DÒNG RENDER NÀY (Chỉ check boolean) ===
            render: (status: boolean) => { // Kiểu dữ liệu giờ là boolean
                return <Tag color={status === true ? 'green' : 'red'}>{status === true ? 'Trống' : 'Có khách'}</Tag>;
            }
            // ============================================
        },
        { title: 'Mô tả vị trí', dataIndex: 'mo_ta_vi_tri', key: 'description' },
        // Video có thể hiển thị link hoặc icon
        // === THÊM CỘT VIDEO ===
        {
            title: 'Video', dataIndex: 'media_files_ban_an_video_ban_idTomedia_files', key: 'video', width: 80, align: 'center' as const,
            render: (media: { file_url: string } | null, record: RestaurantTable) => media ? ( // Thêm record để lấy số bàn
                <Tooltip title="Xem video">
                    {/* Thay Link bằng Button hoặc Icon */}
                    <Button
                        type="link"
                        icon={<VideoCameraOutlined style={{ fontSize: '18px' }} />}
                        onClick={() => handleOpenVideoModal(media.file_url, record.so_ban)} // Gọi hàm mở modal
                    />
                </Tooltip>
            ) : '-'
        },
        // =======================
        {
            title: 'Thao tác', key: 'action', align: 'center' as const, fixed: 'right' as const, width: 150,
            render: (_: any, record: RestaurantTable) => (
                <Space size="small">
                    <Tooltip title="Sửa bàn">
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa bàn">
                        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id, record.so_ban)} />
                    </Tooltip>
                </Space>
            ),
        },
    ], [handleEdit, handleDelete, handleOpenVideoModal]);


    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý Bàn ăn</h2>

            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} md={6}>
                    <InputNumber placeholder="Tìm theo số bàn..."
                        value={filters.so_ban} onChange={value => handleFilterChange('so_ban', value)} style={{ width: '100%' }} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <InputNumber placeholder="Tìm theo sức chứa..."
                        value={filters.suc_chua} onChange={value => handleFilterChange('suc_chua', value)} style={{ width: '100%' }} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <InputNumber placeholder="Tìm theo tầng..."
                        value={filters.tang} onChange={value => handleFilterChange('tang', value)} style={{ width: '100%' }} />
                </Col>
                <Col xs={24} sm={12} md={6} className="flex justify-end">
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                        Thêm mới Bàn
                    </Button>
                </Col>
            </Row>

            {error && <Alert message="Lỗi tải dữ liệu" description={(error as any)?.data?.message || 'Không thể tải danh sách bàn ăn.'} type="error" showIcon className="mb-4" />}

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
                scroll={{ x: 1200 }} // Cho phép cuộn ngang
            />

            {/* Modal Thêm/Sửa */}
            <TableFormModal
                open={isFormModalOpen}
                onClose={handleCloseFormModal}
                table={selectedTable}
            />

            {/* === THÊM VIDEO MODAL === */}
            <Modal
                title={`Video giới thiệu Bàn ${currentTableNumber ?? ''}`}
                open={isVideoModalOpen}
                onCancel={handleCloseVideoModal}
                footer={null} // Không cần nút OK/Cancel
                destroyOnClose // Hủy component khi đóng để dừng video
                width={800} // Kích thước modal lớn hơn
            >
                {currentVideoUrl ? (
                    <video controls autoPlay width="100%" src={currentVideoUrl}>
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                ) : (
                    <p>Không có video để hiển thị.</p>
                )}
            </Modal>
            {/* ====================== */}
        </div>
    );
};

export default TableListPage;