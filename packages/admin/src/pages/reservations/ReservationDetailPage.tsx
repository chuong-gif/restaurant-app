// ReservationDetailPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Table, Tag, Button, Spin, Row, Col, Avatar, Space, Divider } from 'antd';
import { ArrowLeftOutlined, EditOutlined, PrinterOutlined } from '@ant-design/icons';
import { useGetAdminReservationByIdQuery } from '../../features/reservations/reservationApi';
import { ReservationDetailItem } from '../../types/reservation';
import { formatDateTime } from '../../utils/FormatDateTime';
import { formatCurrency } from '../../utils/FormatCurrency';
import { statusMap } from '../../components/reservations/ChangeStatusSelect';
import ChangeDishesModal from '../../components/reservations/ChangeDishesModal';

const ReservationDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const reservationId = Number(id);

    const [isChangeDishesModalOpen, setIsChangeDishesModalOpen] = useState(false);

    const { data: reservation, isLoading, isFetching, error } = useGetAdminReservationByIdQuery(reservationId, {
        skip: !reservationId,
    });

    const handlePrint = () => {
        window.print();
    };

    if (isLoading || isFetching) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center">
                <Spin size="large" />
            </div>
        );
    }

    if (error || !reservation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center">
                <div className="text-red-500 bg-white/10 backdrop-blur-xl p-6 rounded-2xl">Lỗi khi tải chi tiết đặt bàn hoặc không tìm thấy đơn.</div>
            </div>
        );
    }

    const subTotal = reservation.chi_tiet_dat_ban?.reduce((sum, item) => sum + item.gia_tai_thoi_diem * item.so_luong, 0) || 0;
    const discountAmount = 0;
    const taxAmount = subTotal * 0.1;
    const totalAmount = subTotal - discountAmount + taxAmount;
    const remainingAmount = totalAmount - (reservation.tien_dat_coc || 0);

    const detailColumns = [
        {
            title: 'STT',
            key: 'stt',
            render: (_text: any, _record: any, index: number) => (
                <div className="text-gray-600">{index + 1}</div>
            )
        },
        {
            title: 'Món ăn',
            dataIndex: ['san_pham', 'ten_san_pham'],
            key: 'name',
            render: (name: string, record: ReservationDetailItem) => (
                <Space>
                    <Avatar src={record.san_pham?.media_files?.file_url} shape="square" size="small" className="rounded-lg" />
                    <span className="text-gray-700">{name || 'N/A'}</span>
                </Space>
            )
        },
        {
            title: 'Số lượng',
            dataIndex: 'so_luong',
            key: 'quantity',
            align: 'center' as const,
            render: (text: number) => (
                <span className="text-gray-700">{text}</span>
            )
        },
        {
            title: 'Đơn giá',
            dataIndex: 'gia_tai_thoi_diem',
            key: 'price',
            align: 'right' as const,
            render: (price: number) => (
                <span className="text-green-600 font-semibold">{formatCurrency(price)}</span>
            )
        },
        {
            title: 'Thành tiền',
            key: 'total',
            align: 'right' as const,
            render: (record: ReservationDetailItem) => (
                <span className="text-blue-600 font-semibold">{formatCurrency(record.gia_tai_thoi_diem * record.so_luong)}</span>
            )
        },
    ];

    const customerInfo = reservation.nguoi_dung || {
        ho_ten: reservation.ho_ten_khach,
        dien_thoai: reservation.dien_thoai,
        email: reservation.email,
    };

    const currentStatus = statusMap[reservation.trang_thai] || { text: 'Không xác định', color: 'default' };
    const canChangeDishes = ![0, 5].includes(reservation.trang_thai);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <style>
                {`@media print {
                    .no-print { display: none !important; }
                    .ant-card-body { padding: 0 !important; }
                    .bg-gradient-to-br { background: white !important; }
                 }`}
            </style>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transition-all duration-300 animate-fade-in">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/reservations')}
                    className="mb-6 no-print rounded-xl border-white/30 bg-white/20 hover:bg-white/30 transition-all"
                >
                    Quay lại danh sách
                </Button>

                <Card
                    title={
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">
                            Chi tiết Đặt bàn - Mã: {reservation.ma_dat_ban || 'N/A'}
                        </span>
                    }
                    extra={
                        <Space className="no-print">
                            {canChangeDishes && (
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => setIsChangeDishesModalOpen(true)}
                                    className="rounded-xl border-white/30 bg-white/20 hover:bg-white/30 transition-all"
                                >
                                    Đổi món
                                </Button>
                            )}
                            <Button
                                icon={<PrinterOutlined />}
                                onClick={handlePrint}
                                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-lg hover:shadow-xl transition-all"
                            >
                                In hóa đơn
                            </Button>
                        </Space>
                    }
                    className="bg-white/20 backdrop-blur-lg border border-white/30"
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
                                <Descriptions title="Thông tin Khách hàng" bordered column={1} size="small">
                                    <Descriptions.Item label="Họ tên" className="text-gray-700">{customerInfo.ho_ten}</Descriptions.Item>
                                    <Descriptions.Item label="Điện thoại" className="text-gray-700">{customerInfo.dien_thoai}</Descriptions.Item>
                                    <Descriptions.Item label="Email" className="text-gray-700">{customerInfo.email || '-'}</Descriptions.Item>
                                </Descriptions>
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
                                <Descriptions title="Thông tin Đặt bàn" bordered column={1} size="small">
                                    <Descriptions.Item label="Ngày đặt" className="text-gray-700">{formatDateTime(reservation.ngay_dat_ban)}</Descriptions.Item>
                                    <Descriptions.Item label="Số khách" className="text-gray-700">{reservation.so_luong_khach}</Descriptions.Item>
                                    <Descriptions.Item label="Bàn số" className="text-gray-700">
                                        {(reservation.ban_an && reservation.ban_an.length > 0)
                                            ? reservation.ban_an.map(table => `Bàn ${table.so_ban} (Tầng ${table.tang})`).join('; ')
                                            : '-'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${currentStatus.color === 'green' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                currentStatus.color === 'red' ? 'bg-red-100 text-red-800 border border-red-200' :
                                                    currentStatus.color === 'orange' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                                        'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                            {currentStatus.text}
                                        </div>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ghi chú" className="text-gray-700">{reservation.ghi_chu || '-'}</Descriptions.Item>
                                </Descriptions>
                            </div>
                        </Col>
                    </Row>

                    <Divider />

                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Chi tiết Món ăn</h3>
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
                        <Table
                            columns={detailColumns}
                            dataSource={reservation.chi_tiet_dat_ban || []}
                            rowKey="id"
                            pagination={false}
                            bordered
                            size="small"
                            className="custom-table"
                        />
                    </div>

                    <Divider />

                    <Row gutter={[16, 16]} justify="end" className="mt-4">
                        <Col xs={24} sm={12} md={8}>
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
                                <Descriptions bordered column={1} size="small" title="Tổng kết">
                                    <Descriptions.Item label="Tổng tiền món" className="text-gray-700">{formatCurrency(subTotal)}</Descriptions.Item>
                                    <Descriptions.Item label="Giảm giá" className="text-gray-700">{formatCurrency(discountAmount)}</Descriptions.Item>
                                    <Descriptions.Item label="VAT (10%)" className="text-gray-700">{formatCurrency(taxAmount)}</Descriptions.Item>
                                    <Descriptions.Item label="Đã cọc" className="text-gray-700">{formatCurrency(reservation.tien_dat_coc || 0)}</Descriptions.Item>
                                    <Descriptions.Item label="Tổng thanh toán" className="font-bold text-green-600">{formatCurrency(totalAmount)}</Descriptions.Item>
                                    {![0, 5].includes(reservation.trang_thai) && (
                                        <Descriptions.Item label="Còn lại" className="font-bold text-red-600">{formatCurrency(remainingAmount)}</Descriptions.Item>
                                    )}
                                </Descriptions>
                            </div>
                        </Col>
                    </Row>
                </Card>

                <ChangeDishesModal
                    open={isChangeDishesModalOpen}
                    onClose={() => setIsChangeDishesModalOpen(false)}
                    reservation={reservation}
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
}

export default ReservationDetailPage;