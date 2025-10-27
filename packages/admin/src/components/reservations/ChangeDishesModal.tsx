// packages/admin/src/components/reservations/ChangeDishesModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, InputNumber, Button, Select, Input, Spin, App, Row, Col, Divider, Empty, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import { Reservation, ReservationDetailItem } from '../../types/reservation'; // <-- Import từ file mới
import { Product } from '../../types/product'; // <-- Giữ lại Product từ product

import { useGetProductsQuery } from '../../features/products/productApi'; // API lấy SP
import { useChangeReservationDishesMutation } from '../../features/reservations/reservationApi'; // API đổi món
import { formatCurrency } from '../../utils/FormatCurrency';

const { Option } = Select;
const { Text } = Typography;

interface ChangeDishesModalProps {
    open: boolean;
    onClose: () => void;
    reservation: Reservation | null; // Đơn đặt bàn cần sửa
}

// Kiểu dữ liệu cho từng món trong modal
interface DishItem extends ReservationDetailItem {
    productName?: string;
    productPrice?: number;
}

const ChangeDishesModal: React.FC<ChangeDishesModalProps> = ({ open, onClose, reservation }) => {
    const { message } = App.useApp();
    const [currentDishes, setCurrentDishes] = useState<DishItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [selectedProduct, setSelectedProduct] = useState<number | undefined>(undefined);
    const [quantityToAdd, setQuantityToAdd] = useState<number>(1);

    // Lấy danh sách sản phẩm đang hoạt động để thêm vào đơn
    const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({
        page: 1,
        pageSize: 100, // Lấy nhiều SP để tìm kiếm
        searchName: debouncedSearchTerm,
        trang_thai: true, // Chỉ lấy SP đang hoạt động
    });

    const [changeDishes, { isLoading: isChanging }] = useChangeReservationDishesMutation();

    // Load món ăn hiện tại của đơn vào state khi modal mở
    useEffect(() => {
        if (open && reservation?.chi_tiet_dat_ban) {
            const initialDishes = reservation.chi_tiet_dat_ban.map(item => ({
                ...item,
                productName: item.san_pham?.ten_san_pham || 'N/A',
                productPrice: item.gia_tai_thoi_diem, // Giữ giá tại thời điểm đặt
            }));
            setCurrentDishes(initialDishes);
        } else if (!open) {
            setCurrentDishes([]); // Reset khi đóng modal
            setSearchTerm('');
            setSelectedProduct(undefined);
            setQuantityToAdd(1);
        }
    }, [open, reservation]);

    // Hàm cập nhật số lượng món ăn hiện có
    const handleQuantityChange = (productId: number, newQuantity: number | null) => {
        if (newQuantity === null || newQuantity < 0) return; // Bỏ qua nếu giá trị không hợp lệ

        setCurrentDishes(prevDishes =>
            prevDishes.map(dish =>
                dish.san_pham_id === productId ? { ...dish, so_luong: newQuantity } : dish
            )
        );
    };

    // Hàm xóa món ăn khỏi danh sách hiện tại
    const handleRemoveDish = (productId: number) => {
        setCurrentDishes(prevDishes =>
            prevDishes.filter(dish => dish.san_pham_id !== productId)
        );
    };

    // Hàm thêm món ăn mới vào danh sách
    const handleAddDish = () => {
        if (!selectedProduct || quantityToAdd <= 0) {
            message.warning('Vui lòng chọn món ăn và số lượng hợp lệ.');
            return;
        }

        const productToAdd = productsData?.data.find(p => p.id === selectedProduct);
        if (!productToAdd) {
            message.error('Không tìm thấy thông tin món ăn.');
            return;
        }

        // Kiểm tra món đã có trong danh sách chưa
        const existingDishIndex = currentDishes.findIndex(dish => dish.san_pham_id === selectedProduct);

        if (existingDishIndex !== -1) {
            // Nếu đã có, cộng dồn số lượng
            setCurrentDishes(prevDishes =>
                prevDishes.map((dish, index) =>
                    index === existingDishIndex ? { ...dish, so_luong: dish.so_luong + quantityToAdd } : dish
                )
            );
        } else {
            // Nếu chưa có, thêm mới vào danh sách
            const newDish: DishItem = {
                // Các trường id, dat_ban_id không cần thiết ở đây
                id: Date.now(), // ID tạm thời
                dat_ban_id: reservation?.id || 0,
                san_pham_id: productToAdd.id,
                so_luong: quantityToAdd,
                gia_tai_thoi_diem: productToAdd.gia_khuyen_mai > 0 ? productToAdd.gia_khuyen_mai : productToAdd.gia_ban, // Lấy giá hiện tại
                productName: productToAdd.ten_san_pham,
                productPrice: productToAdd.gia_khuyen_mai > 0 ? productToAdd.gia_khuyen_mai : productToAdd.gia_ban,
            };
            setCurrentDishes(prevDishes => [...prevDishes, newDish]);
        }

        // Reset ô chọn món và số lượng
        setSelectedProduct(undefined);
        setQuantityToAdd(1);
        setSearchTerm(''); // Xóa tìm kiếm để hiển thị lại SP khác
    };

    // Hàm xử lý khi nhấn Lưu thay đổi
    const handleSaveChanges = async () => {
        if (!reservation) return;

        // Chuẩn bị dữ liệu gửi lên API
        const dishesToSubmit = currentDishes.map(dish => ({
            product_id: dish.san_pham_id,
            quantity: dish.so_luong,
            // Không cần gửi price, backend sẽ tự lấy giá mới nhất hoặc giữ giá cũ tùy logic
        }));

        if (dishesToSubmit.length === 0) {
            message.warning('Danh sách món ăn không được để trống.');
            return;
        }

        try {
            await changeDishes({ id: reservation.id, dishes: dishesToSubmit }).unwrap();
            message.success('Thay đổi món ăn thành công!');
            onClose(); // Đóng modal
        } catch (error: any) {
            message.error(error.data?.message || 'Thay đổi món ăn thất bại.');
        }
    };

    // Cột cho bảng món ăn hiện tại
    const currentDishesColumns = [
        { title: 'Tên món', dataIndex: 'productName', key: 'name' },
        {
            title: 'Số lượng', dataIndex: 'so_luong', key: 'quantity', width: 120,
            render: (quantity: number, record: DishItem) => (
                <InputNumber
                    min={1} // Số lượng tối thiểu là 1 khi đã nằm trong danh sách
                    value={quantity}
                    onChange={(value) => handleQuantityChange(record.san_pham_id, value)}
                    style={{ width: '80px' }}
                />
            )
        },
        {
            title: 'Đơn giá', dataIndex: 'productPrice', key: 'price', align: 'right' as const,
            render: (price: number) => formatCurrency(price || 0)
        },
        {
            title: 'Thành tiền', key: 'total', align: 'right' as const,
            render: (record: DishItem) => formatCurrency((record.productPrice || 0) * record.so_luong)
        },
        {
            title: 'Xóa', key: 'action', align: 'center' as const, width: 60,
            render: (record: DishItem) => (
                <Button type="link" danger onClick={() => handleRemoveDish(record.san_pham_id)}>Xóa</Button>
            )
        },
    ];

    // Tính tổng tiền tạm thời
    const tempTotal = currentDishes.reduce((sum, dish) => sum + (dish.productPrice || 0) * dish.so_luong, 0);

    return (
        <Modal
            title={`Thay đổi món ăn cho ĐB: ${reservation?.ma_dat_ban || 'N/A'}`}
            open={open}
            onCancel={onClose}
            onOk={handleSaveChanges} // Gọi hàm lưu khi nhấn OK
            confirmLoading={isChanging}
            okText="Lưu thay đổi"
            cancelText="Hủy"
            width={900} // Tăng chiều rộng modal
            maskClosable={false}
        >
            <Spin spinning={isChanging}>
                <Row gutter={16}>
                    {/* Phần thêm món ăn mới */}
                    <Col span={10}>
                        <h4 className='mb-2'>Thêm món ăn</h4>
                        <Select<number>
                            showSearch
                            placeholder="Tìm và chọn món ăn..."
                            value={selectedProduct}
                            onChange={value => setSelectedProduct(value)}
                            onSearch={value => setSearchTerm(value)}
                            filterOption={false} // Tắt filter mặc định vì dùng tìm kiếm server-side
                            notFoundContent={isLoadingProducts ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy" />}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            {productsData?.data?.map(product => (
                                <Option key={product.id} value={product.id}>
                                    {product.ten_san_pham} ({formatCurrency(product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban)})
                                </Option>
                            ))}
                        </Select>
                        <InputNumber<number>
                            min={1}
                            value={quantityToAdd}
                            onChange={value => setQuantityToAdd(value ?? 1)}
                            placeholder="Số lượng"
                            style={{ width: '100px', margin: '8px 8px 8px 0' }}
                        />
                        <Button type="primary" onClick={handleAddDish} disabled={!selectedProduct}>
                            Thêm vào đơn
                        </Button>
                    </Col>

                    {/* Phần danh sách món ăn hiện tại */}
                    <Col span={14}>
                        <h4 className='mb-2'>Món ăn hiện tại</h4>
                        <Table
                            columns={currentDishesColumns}
                            dataSource={currentDishes}
                            rowKey="san_pham_id" // Dùng product id làm key
                            pagination={false}
                            size="small"
                            bordered
                            summary={() => (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={3} align="right"><Text strong>Tổng cộng:</Text></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align="right"><Text strong>{formatCurrency(tempTotal)}</Text></Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}></Table.Summary.Cell>{/* Cột trống cho nút xóa */}
                                </Table.Summary.Row>
                            )}
                        />
                    </Col>
                </Row>
            </Spin>
        </Modal>
    );
};

export default ChangeDishesModal;