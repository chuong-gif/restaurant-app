// PromotionListPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, Button, Input, Tag, Space, App, Tooltip, Row, Col, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';

import { useGetAdminPromotionsQuery, useDeletePromotionMutation } from '../../features/promotions/promotionApi';
import PromotionFormModal from '../../features/promotions/PromotionFormModal';
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
        {
            title: 'STT',
            key: 'stt',
            align: 'center' as const,
            width: 70,
            render: (_: any, __: any, index: number) => (
                <div className="text-gray-600 font-medium">
                    {(pagination.current - 1) * pagination.pageSize + index + 1}
                </div>
            )
        },
        {
            title: 'Mã KM',
            dataIndex: 'ma_khuyen_mai',
            key: 'code',
            width: 150,
            render: (text: string) => (
                <span className="text-blue-600 font-semibold">{text}</span>
            )
        },
        {
            title: 'Giảm giá',
            key: 'discount',
            width: 150,
            align: 'right' as const,
            render: (_: any, record: Promotion) => (
                <span className="text-green-600 font-semibold">
                    {record.loai_giam_gia ? formatCurrency(record.giam_gia) : `${record.giam_gia}%`}
                </span>
            )
        },
        {
            title: 'Số lượng',
            dataIndex: 'so_luong',
            key: 'quantity',
            align: 'center' as const,
            width: 100,
            render: (text: number) => (
                <span className="text-gray-700">{text}</span>
            )
        },
        {
            title: 'Ngày hiệu lực',
            dataIndex: 'ngay_hieu_luc',
            key: 'start_date',
            width: 160,
            render: (date: string) => (
                <span className="text-gray-600 text-sm">{formatDateTime(date)}</span>
            )
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'ngay_ket_thuc',
            key: 'end_date',
            width: 160,
            render: (date: string) => (
                <span className="text-gray-600 text-sm">{formatDateTime(date)}</span>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 120,
            align: 'center' as const,
            render: (_: any, record: Promotion) => {
                const now = dayjs();
                const start = dayjs(record.ngay_hieu_luc);
                const end = dayjs(record.ngay_ket_thuc);

                let statusConfig;
                if (now.isBefore(start)) {
                    statusConfig = { text: 'Chưa bắt đầu', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
                } else if (now.isAfter(end)) {
                    statusConfig = { text: 'Đã kết thúc', color: 'bg-red-100 text-red-800 border-red-200' };
                } else if (record.so_luong <= 0) {
                    statusConfig = { text: 'Hết lượt', color: 'bg-orange-100 text-orange-800 border-orange-200' };
                } else {
                    statusConfig = { text: 'Đang diễn ra', color: 'bg-green-100 text-green-800 border-green-200' };
                }

                return (
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        {statusConfig.text}
                    </div>
                );
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
            fixed: 'right' as const,
            width: 150,
            render: (_: any, record: Promotion) => (
                <Space size="small">
                    <Tooltip title="Sửa">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            className="bg-blue-500 hover:bg-blue-600 border-0 shadow-md hover:shadow-lg transition-all"
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id, record.ma_khuyen_mai)}
                            className="shadow-md hover:shadow-lg transition-all"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ], [pagination, handleEdit, handleDelete]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transition-all duration-300 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Quản lý Khuyến mãi
                </h2>

                <Row gutter={[16, 16]} className="mb-6" justify="space-between">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Tìm kiếm mã khuyến mãi..."
                            onChange={(e) => handleSearch(e.target.value)}
                            allowClear
                            className="rounded-xl border-white/30"
                        />
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddNew}
                            className="h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-lg hover:shadow-xl transition-all"
                        >
                            Thêm mới Khuyến mãi
                        </Button>
                    </Col>
                </Row>

                {error && (
                    <Alert
                        message="Lỗi tải dữ liệu"
                        description={(error as any)?.data?.message || 'Không thể tải danh sách khuyến mãi.'}
                        type="error"
                        showIcon
                        className="mb-4 rounded-xl border-white/30"
                    />
                )}

                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg overflow-hidden">
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
                            className: 'px-4 py-2'
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 1100 }}
                        className="custom-table"
                    />
                </div>

                <PromotionFormModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    promotion={selectedPromotion}
                />
            </div>

            <style>{`
                .custom-table .ant-table-thead > tr > th {
                    background: rgba(255, 255, 255, 0.3) !important;
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                    color: #4B5563;
                    font-weight: 600;
                }
                .custom-table .ant-table-tbody > tr > td {
                    background: rgba(255, 255, 255, 0.2) !important;
                    backdrop-filter: blur(5px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                }
                .custom-table .ant-table-tbody > tr:hover > td {
                    background: rgba(255, 255, 255, 0.3) !important;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out; }
            `}</style>
        </div>
    );
};

export default PromotionListPage;