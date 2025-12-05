import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Button, List, Avatar, Divider, App, Tabs, Card, Col, Row } from 'antd'; // Bỏ InputNumber, Spin
import { PrinterOutlined, DollarOutlined, SaveOutlined } from '@ant-design/icons'; // Bỏ ShoppingCartOutlined
import {
    useGetAdminReservationByIdQuery,
    useChangeReservationDishesMutation,
    useUpdateReservationStatusMutation
} from '../../features/reservations/reservationApi';

// SỬA: Import đúng hook từ productApi (có thể bạn đang dùng tên này)
// Nếu lỗi vẫn còn, hãy mở productApi.ts ra xem tên export là gì
import { useGetProductsQuery } from '../../features/products/productApi';

import { useReactToPrint } from 'react-to-print';
import InvoiceComponent from './InvoiceComponent';

interface POSDrawerProps {
    open: boolean;
    onClose: () => void;
    reservationId: number;
}

const POSDrawer: React.FC<POSDrawerProps> = ({ open, onClose, reservationId }) => {
    const { message, modal } = App.useApp();

    // 1. Fetch dữ liệu đơn hàng (bỏ isLoadingRes vì chưa dùng)
    const { data: reservation, refetch } = useGetAdminReservationByIdQuery(reservationId, { skip: !reservationId });

    // 2. Fetch Menu: Dùng useGetProductsQuery thay vì useGetProductsAdminQuery
    const { data: productsData } = useGetProductsQuery({ page: 1, pageSize: 100 });

    // 3. Mutation
    const [updateDishes, { isLoading: isSaving }] = useChangeReservationDishesMutation();
    const [updateStatus] = useUpdateReservationStatusMutation();

    // 4. Local State giỏ hàng (Cart)
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        if (reservation?.chi_tiet_dat_ban) {
            const existingItems = reservation.chi_tiet_dat_ban.map(item => ({
                product_id: item.san_pham_id,
                quantity: item.so_luong,
                price: item.gia_tai_thoi_diem,
                name: item.san_pham?.ten_san_pham,
                image: item.san_pham?.media_files?.file_url
            }));
            setCart(existingItems);
        }
    }, [reservation]);

    const addToCart = (product: any) => {
        setCart(prev => {
            const exists = prev.find(item => item.product_id === product.id);
            if (exists) {
                return prev.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, {
                product_id: product.id,
                quantity: 1,
                price: product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban,
                name: product.ten_san_pham,
                image: product.media_files?.file_url // Sửa lại structure ảnh cho khớp
            }];
        });
    };

    const handleSaveOrder = async () => {
        try {
            await updateDishes({
                id: reservationId,
                dishes: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity }))
            }).unwrap();
            message.success('Đã lưu món ăn!');
            refetch();
        } catch (error) {
            message.error('Lỗi lưu đơn');
        }
    };

    const handleCheckout = () => {
        modal.confirm({
            title: 'Xác nhận thanh toán',
            content: `Tổng tiền: ${reservation?.tong_tien?.toLocaleString()} đ. Bạn có chắc chắn?`,
            onOk: async () => {
                try {
                    await updateStatus({ id: reservationId, status: 5 }).unwrap();
                    message.success('Thanh toán thành công! Bàn đã trống.');
                    onClose();
                } catch (e) {
                    message.error('Lỗi thanh toán');
                }
            }
        });
    };

    const invoiceRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
    });

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <Drawer
            title={`Đơn hàng: ${reservation?.ma_dat_ban} - Bàn ${reservation?.ban_an?.[0]?.so_ban}`}
            width={900}
            open={open}
            onClose={onClose}
            extra={<Button onClick={handlePrint} icon={<PrinterOutlined />}>In Bill</Button>}
        >
            <div className="h-full flex gap-4">
                <div className="flex-1 overflow-y-auto pr-2">
                    <Tabs defaultActiveKey="1" items={[
                        {
                            key: '1', label: 'Tất cả món', children: (
                                <Row gutter={[12, 12]}>
                                    {productsData?.data.map((p: any) => (
                                        <Col span={8} key={p.id}>
                                            <Card hoverable size="small" onClick={() => addToCart(p)}
                                                cover={<img alt={p.ten_san_pham} src={p.media_files?.file_url} className="h-24 object-cover" />}
                                            >
                                                <Card.Meta title={p.ten_san_pham} description={`${p.gia_ban.toLocaleString()}đ`} />
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )
                        }
                    ]} />
                </div>

                <div className="w-1/3 bg-gray-50 p-4 rounded-lg flex flex-col h-full border">
                    <div className="flex-1 overflow-y-auto">
                        <List
                            itemLayout="horizontal"
                            dataSource={cart}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.image} shape="square" />}
                                        title={item.name}
                                        description={`${item.price.toLocaleString()}đ x ${item.quantity}`}
                                    />
                                    <div className="font-bold">{(item.price * item.quantity).toLocaleString()}</div>
                                </List.Item>
                            )}
                        />
                    </div>

                    <Divider />
                    <div className="flex justify-between text-lg font-bold mb-4">
                        <span>Tổng tiền:</span>
                        <span className="text-blue-600">{totalAmount.toLocaleString()} đ</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveOrder} loading={isSaving} className="bg-orange-500">
                            Lưu/Báo Bếp
                        </Button>
                        <Button type="primary" icon={<DollarOutlined />} onClick={handleCheckout} className="h-12 text-lg">
                            THANH TOÁN & TRẢ BÀN
                        </Button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'none' }}>
                <InvoiceComponent ref={invoiceRef} reservation={reservation} cart={cart} />
            </div>
        </Drawer>
    );
};

export default POSDrawer;