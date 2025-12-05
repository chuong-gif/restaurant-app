import React, { useState } from 'react';
import { useGetPosTableMapQuery } from '../../features/tables/tableApi';
import { Card, Spin, Modal, Form, Input, InputNumber, Button, Row, Col, Statistic, Tag, App } from 'antd'; // Bỏ Badge
import { UserOutlined, ReloadOutlined } from '@ant-design/icons'; // Bỏ ClockCircleOutlined
import dayjs from 'dayjs';
// Bỏ useNavigate vì chưa dùng
import { useCreateAdminReservationMutation } from '../../features/reservations/reservationApi';
import POSDrawer from './POSDrawer';

const TableMapPage: React.FC = () => {
    const { message } = App.useApp();
    const { data, isLoading, refetch } = useGetPosTableMapQuery();
    const [createReservation, { isLoading: isCreating }] = useCreateAdminReservationMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(null);
    const [form] = Form.useForm();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeReservationId, setActiveReservationId] = useState<number | null>(null);

    const handleTableClick = (table: any) => {
        if (table.status_code === 'FREE') {
            setSelectedTableId(table.id);
            setSelectedTableNumber(table.so_ban);
            form.resetFields();
            form.setFieldsValue({
                party_size: table.suc_chua,
                fullname: 'Khách lẻ',
                tel: ''
            });
            setIsModalOpen(true);
        } else {
            if (table.current_reservation) {
                setActiveReservationId(table.current_reservation.id);
                setIsDrawerOpen(true);
            }
        }
    };

    const handleOpenTable = async (values: any) => {
        try {
            await createReservation({
                ...values,
                reservation_date: new Date().toISOString(),
                ban_an_ids: [selectedTableId!],
                status: 3,
                note: 'Khách vãng lai tại quầy'
            }).unwrap();

            message.success('Đã mở bàn thành công!');
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            message.error('Lỗi mở bàn');
        }
    };

    if (isLoading) return <div className="flex justify-center mt-20"><Spin size="large" /></div>;

    const totalTables = data?.data.length || 0;
    // Sửa lỗi 't implicitly has any type' bằng cách định kiểu cho t (any hoặc Table)
    const occupied = data?.data.filter((t: any) => t.status_code === 'OCCUPIED').length || 0;
    const free = totalTables - occupied;

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Sơ đồ nhà hàng</h2>
                <div className="flex gap-8">
                    <Statistic title="Đang phục vụ" value={occupied} valueStyle={{ color: '#cf1322' }} />
                    <Statistic title="Bàn trống" value={free} valueStyle={{ color: '#3f8600' }} />
                    <Button icon={<ReloadOutlined />} onClick={refetch}>Làm mới</Button>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                {data?.data.map((table: any) => {
                    let bgColor = 'bg-white';
                    let statusText = 'Trống';
                    let statusColor = 'success';

                    if (table.status_code === 'OCCUPIED') {
                        bgColor = 'bg-red-50 border-red-200';
                        statusText = 'Đang ăn';
                        statusColor = 'error';
                    } else if (table.status_code === 'RESERVED') {
                        bgColor = 'bg-yellow-50 border-yellow-200';
                        statusText = 'Đặt trước';
                        statusColor = 'warning';
                    }

                    return (
                        <Col xs={12} sm={8} md={6} lg={4} key={table.id}>
                            <Card
                                hoverable
                                className={`rounded-xl border-2 transition-all ${bgColor} hover:shadow-md cursor-pointer h-full`}
                                bodyStyle={{ padding: '12px' }}
                                onClick={() => handleTableClick(table)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-lg font-bold text-gray-700">Bàn {table.so_ban}</div>
                                    <Tag color={statusColor}>{statusText}</Tag>
                                </div>

                                <div className="text-gray-500 text-sm mb-2">
                                    <UserOutlined /> {table.suc_chua} ghế
                                </div>

                                {table.current_reservation && (
                                    <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                                        <div className="font-semibold truncate">{table.current_reservation.ho_ten_khach || 'Khách lẻ'}</div>
                                        <div>{dayjs(table.current_reservation.ngay_dat_ban).format('HH:mm')}</div>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Modal
                title={`Mở Bàn ${selectedTableNumber}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleOpenTable}>
                    <Form.Item name="fullname" label="Tên khách hàng" rules={[{ required: true }]}>
                        <Input placeholder="Nhập tên khách" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            {/* SỬA ĐOẠN NÀY: Xóa rules và thêm allowClear */}
                            <Form.Item name="tel" label="Số điện thoại">
                                <Input placeholder="Bỏ trống cũng được" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="party_size" label="Số khách" rules={[{ required: true }]}>
                                <InputNumber min={1} className="w-full" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type="primary" htmlType="submit" block loading={isCreating} size="large">
                        MỞ BÀN NGAY
                    </Button>
                </Form>
            </Modal>

            {activeReservationId && (
                <POSDrawer
                    open={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setActiveReservationId(null);
                        refetch();
                    }}
                    reservationId={activeReservationId}
                />
            )}
        </div>
    );
};

export default TableMapPage;