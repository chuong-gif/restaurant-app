// packages/admin/src/pages/promotions/PromotionListPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, Button, Input, Tag, Space, App, Tooltip, Row, Col, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';


import { useGetAdminPromotionsQuery, useDeletePromotionMutation } from '../../features/promotions/promotionApi';
import PromotionFormModal from '../../features/promotions/PromotionFormModal'; // Import modal
import { Promotion } from '../../types/promotion';
import { formatDateTime } from '../../utils/FormatDateTime';
import { formatCurrency } from '../../utils/FormatCurrency';

const { Search } = Input;

const PromotionListPage: React.FC = () => {
    const { message, modal } = App.useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

    // State cho tìm kiếm và phân trang
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    // RTK Query hooks
    const { data: promotionsData, isLoading, isFetching, error } = useGetAdminPromotionsQuery({
        page: pagination.current,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
    });
    const [deletePromotion, { isLoading: isDeleting }] = useDeletePromotionMutation();

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
        setSelectedPromotion(null);
        setIsModalOpen(true);
    }, []);

    const handleEdit = useCallback((promotion: Promotion) => {
        setSelectedPromotion(promotion);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((id: number, code: string) => {
        modal.confirm({
            title: `Xác nhận xóa mã "${code}"`,
            content: 'Bạn có chắc muốn xóa vĩnh viễn mã khuyến mãi này?',
            okText: 'Xác nhận xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deletePromotion(id).unwrap();
                    message.success(`Xóa mã "${code}" thành công.`);
                    if (promotionsData?.data.length === 1 && pagination.current > 1) {
                        setPagination(prev => ({ ...prev, current: prev.current - 1 }));
                    }
                } catch (error: any) {
                    message.error(error.data?.message || `Xóa mã "${code}" thất bại.`);
                }
            },
        });
    }, [deletePromotion, message, modal, promotionsData, pagination]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedPromotion(null);
    }, []);

    // Table columns
    const columns = useMemo(() => [
        { title: 'STT', key: 'stt', align: 'center' as const, width: 70, render: (_: any, __: any, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1 },
        { title: 'Mã KM', dataIndex: 'ma_khuyen_mai', key: 'code', width: 150 },
        {
            title: 'Giảm giá', key: 'discount', width: 150, align: 'right' as const,
            render: (_: any, record: Promotion) => record.loai_giam_gia ? formatCurrency(record.giam_gia) : `${record.giam_gia}%`
        },
        { title: 'Số lượng', dataIndex: 'so_luong', key: 'quantity', align: 'center' as const, width: 100 },
        { title: 'Ngày hiệu lực', dataIndex: 'ngay_hieu_luc', key: 'start_date', width: 160, render: (date: string) => formatDateTime(date) },
        { title: 'Ngày kết thúc', dataIndex: 'ngay_ket_thuc', key: 'end_date', width: 160, render: (date: string) => formatDateTime(date) },
        {
            title: 'Trạng thái', key: 'status', width: 120, align: 'center' as const,
            render: (_: any, record: Promotion) => {
                const now = dayjs();
                const start = dayjs(record.ngay_hieu_luc);
                const end = dayjs(record.ngay_ket_thuc);
                if (now.isBefore(start)) return <Tag color="gold">Chưa bắt đầu</Tag>;
                if (now.isAfter(end)) return <Tag color="red">Đã kết thúc</Tag>;
                if (record.so_luong <= 0) return <Tag color="orange">Hết lượt</Tag>;
                return <Tag color="green">Đang diễn ra</Tag>;
            }
        },
        {
            title: 'Thao tác', key: 'action', align: 'center' as const, fixed: 'right' as const, width: 150,
            render: (_: any, record: Promotion) => (
                <Space size="small">
                    <Tooltip title="Sửa">
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id, record.ma_khuyen_mai)} />
                    </Tooltip>
                </Space>
            ),
        },
    ], [pagination, handleEdit, handleDelete]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý Khuyến mãi</h2>

            <Row gutter={[16, 16]} className="mb-4" justify="space-between">
                <Col xs={24} sm={12} md={8}>
                    <Search
                        placeholder="Tìm kiếm mã khuyến mãi..."
                        onChange={(e) => handleSearch(e.target.value)}
                        allowClear
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                        Thêm mới Khuyến mãi
                    </Button>
                </Col>
            </Row>

            {error && <Alert message="Lỗi tải dữ liệu" description={(error as any)?.data?.message || 'Không thể tải danh sách khuyến mãi.'} type="error" showIcon className="mb-4" />}

            <Table
                columns={columns}
                dataSource={promotionsData?.data || []}
                rowKey="id"
                loading={isLoading || isFetching || isDeleting}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: promotionsData?.total || 0,
                    pageSizeOptions: ['5', '10', '20', '50'],
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mã`,
                }}
                onChange={handleTableChange}
                scroll={{ x: 1100 }}
            />

            <PromotionFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                promotion={selectedPromotion}
            />
        </div>
    );
};

export default PromotionListPage;