// packages/admin/src/pages/reservations/ReservationDetailPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Table, Tag, Button, Spin, Row, Col, Avatar, Space, Divider } from 'antd';
import { ArrowLeftOutlined, EditOutlined, PrinterOutlined } from '@ant-design/icons';
import { useGetAdminReservationByIdQuery } from '../../features/reservations/reservationApi';
import { ReservationDetailItem } from '../../types/reservation';
// import { Table as RestaurantTable } from '../../types/product';
// import { User } from '../../types/user';
import { formatDateTime } from '../../utils/FormatDateTime';
import { formatCurrency } from '../../utils/FormatCurrency';
import { statusMap } from '../../components/reservations/ChangeStatusSelect';
import ChangeDishesModal from '../../components/reservations/ChangeDishesModal'; // Sẽ tạo component này

const ReservationDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const reservationId = Number(id);

    const [isChangeDishesModalOpen, setIsChangeDishesModalOpen] = useState(false);

    const { data: reservation, isLoading, isFetching, error } = useGetAdminReservationByIdQuery(reservationId, {
        skip: !reservationId,
    });

    const handlePrint = () => {
        window.print(); // Sử dụng chức năng in của trình duyệt
    };

    if (isLoading || isFetching) {
        return <Spin size="large" className="flex justify-center items-center h-full" />;
    }

    if (error || !reservation) {
        return <div className='text-red-500'>Lỗi khi tải chi tiết đặt bàn hoặc không tìm thấy đơn.</div>;
    }

    // Tính toán lại tổng tiền, VAT, còn lại (lấy logic từ service backend để đảm bảo nhất quán)
    const subTotal = reservation.chi_tiet_dat_ban?.reduce((sum, item) => sum + item.gia_tai_thoi_diem * item.so_luong, 0) || 0;
    // Khuyến mãi: Logic tính toán phức tạp hơn nếu có KM % hoặc tiền mặt
    const discountAmount = 0; // Tạm thời = 0, cần lấy thông tin KM nếu có
    const taxAmount = subTotal * 0.1; // Giả sử VAT 10%
    const totalAmount = subTotal - discountAmount + taxAmount;
    const remainingAmount = totalAmount - (reservation.tien_dat_coc || 0);

    const detailColumns = [
        { title: 'STT', key: 'stt', render: (_text: any, _record: any, index: number) => index + 1 },
        {
            title: 'Món ăn', dataIndex: ['san_pham', 'ten_san_pham'], key: 'name',
            render: (name: string, record: ReservationDetailItem) => (
                <Space>
                    <Avatar src={record.san_pham?.media_files?.file_url} shape="square" size="small" />
                    <span>{name || 'N/A'}</span>
                </Space>
            )
        },
        { title: 'Số lượng', dataIndex: 'so_luong', key: 'quantity', align: 'center' as const },
        { title: 'Đơn giá', dataIndex: 'gia_tai_thoi_diem', key: 'price', align: 'right' as const, render: (price: number) => formatCurrency(price) },
        { title: 'Thành tiền', key: 'total', align: 'right' as const, render: (record: ReservationDetailItem) => formatCurrency(record.gia_tai_thoi_diem * record.so_luong) },
    ];

    const customerInfo = reservation.nguoi_dung || {
        ho_ten: reservation.ho_ten_khach,
        dien_thoai: reservation.dien_thoai,
        email: reservation.email,
    };

    const currentStatus = statusMap[reservation.trang_thai] || { text: 'Không xác định', color: 'default' };

    // Cho phép đổi món nếu đơn chưa hoàn thành hoặc chưa hủy
    const canChangeDishes = ![0, 5].includes(reservation.trang_thai);


    return (
        <div>
            <style>
                {`@media print {
                    .no-print { display: none !important; }
                    .ant-card-body { padding: 0 !important; }
                 }`}
            </style>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/reservations')} className="mb-4 no-print">
                Quay lại danh sách
            </Button>
            <Card
                title={`Chi tiết Đặt bàn - Mã: ${reservation.ma_dat_ban || 'N/A'}`}
                extra={
                    <Space className="no-print">
                        {canChangeDishes && (
                            <Button icon={<EditOutlined />} onClick={() => setIsChangeDishesModalOpen(true)}>
                                Đổi món
                            </Button>
                        )}
                        <Button icon={<PrinterOutlined />} onClick={handlePrint}>In hóa đơn</Button>
                    </Space>
                }
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Descriptions title="Thông tin Khách hàng" bordered column={1} size="small">
                            <Descriptions.Item label="Họ tên">{customerInfo.ho_ten}</Descriptions.Item>
                            <Descriptions.Item label="Điện thoại">{customerInfo.dien_thoai}</Descriptions.Item>
                            <Descriptions.Item label="Email">{customerInfo.email || '-'}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col xs={24} md={12}>
                        <Descriptions title="Thông tin Đặt bàn" bordered column={1} size="small">
                            <Descriptions.Item label="Ngày đặt">{formatDateTime(reservation.ngay_dat_ban)}</Descriptions.Item>
                            <Descriptions.Item label="Số khách">{reservation.so_luong_khach}</Descriptions.Item>
                            <Descriptions.Item label="Bàn số">
                                {(reservation.ban_an && reservation.ban_an.length > 0)
                                    ? reservation.ban_an.map(table => `Bàn ${table.so_ban} (Tầng ${table.tang})`).join('; ')
                                    : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái"><Tag color={currentStatus.color}>{currentStatus.text}</Tag></Descriptions.Item>
                            <Descriptions.Item label="Ghi chú">{reservation.ghi_chu || '-'}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>

                <Divider />

                <h3 className="text-lg font-semibold mb-2">Chi tiết Món ăn</h3>
                <Table
                    columns={detailColumns}
                    dataSource={reservation.chi_tiet_dat_ban || []}
                    rowKey="id"
                    pagination={false}
                    bordered
                    size="small"
                />

                <Divider />

                <Row gutter={[16, 16]} justify="end" className="mt-4">
                    <Col xs={24} sm={12} md={8}>
                        <Descriptions bordered column={1} size="small" title="Tổng kết">
                            <Descriptions.Item label="Tổng tiền món">{formatCurrency(subTotal)}</Descriptions.Item>
                            <Descriptions.Item label="Giảm giá">{formatCurrency(discountAmount)}</Descriptions.Item>
                            <Descriptions.Item label="VAT (10%)">{formatCurrency(taxAmount)}</Descriptions.Item>
                            <Descriptions.Item label="Đã cọc">{formatCurrency(reservation.tien_dat_coc || 0)}</Descriptions.Item>
                            <Descriptions.Item label="Tổng thanh toán" className="font-bold">{formatCurrency(totalAmount)}</Descriptions.Item>
                            {![0, 5].includes(reservation.trang_thai) && ( // Chỉ hiển thị nếu chưa hủy/hoàn thành
                                <Descriptions.Item label="Còn lại" className="font-bold text-red-600">{formatCurrency(remainingAmount)}</Descriptions.Item>
                            )}
                        </Descriptions>
                    </Col>
                </Row>

            </Card>

            {/* Modal thay đổi món ăn */}
            <ChangeDishesModal
                open={isChangeDishesModalOpen}
                onClose={() => setIsChangeDishesModalOpen(false)}
                reservation={reservation} // Truyền reservation hiện tại vào modal
            />

        </div>
    );
}

export default ReservationDetailPage;