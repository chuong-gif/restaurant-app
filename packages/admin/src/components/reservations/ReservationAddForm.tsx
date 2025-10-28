// packages/admin/src/components/reservations/ReservationAddForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, TimePicker, Button, Spin, Row, Col, Divider, message, App, Table, Empty, Typography, } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs'; // Cần cài: npm install dayjs
import utc from 'dayjs/plugin/utc'; // Cần plugin utc
import timezone from 'dayjs/plugin/timezone'; // Cần plugin timezone
import vi from 'dayjs/locale/vi'; // Import locale tiếng Việt

import { useGetProductsQuery } from '../../features/products/productApi';
import * as tableApi from '../../features/tables/tableApi'; // Import module to safely pick available hook name
import { useCreateAdminReservationMutation } from '../../features/reservations/reservationApi';
import { Product, Table as RestaurantTable } from '../../types/product'; // Import từ reservation types
import { formatCurrency } from '../../utils/FormatCurrency';
import { useDebounce } from 'use-debounce';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(vi); // Set locale tiếng Việt

const { Option } = Select;
const { Title, Text } = Typography;

interface ReservationAddFormProps {
    onSuccess?: () => void; // Callback khi tạo thành công
    onCancel?: () => void; // Callback khi hủy
}

// Kiểu dữ liệu cho form
type FormData = {
    fullname: string;
    tel: string;
    email?: string;
    reservation_date: dayjs.Dayjs | null; // Dùng dayjs object
    reservation_time: dayjs.Dayjs | null;
    party_size: number;
    note?: string;
    ban_an_id?: number; // Bàn được chọn
};

// Kiểu dữ liệu món ăn trong form
interface DishItem {
    productId: number;
    name: string;
    quantity: number;
    price: number;
}


const ReservationAddForm: React.FC<ReservationAddFormProps> = ({ onSuccess, onCancel }) => {
    const { message } = App.useApp();
    const [selectedDishes, setSelectedDishes] = useState<DishItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [selectedProductToAdd, setSelectedProductToAdd] = useState<number | undefined>(undefined);
    const [quantityToAdd, setQuantityToAdd] = useState<number>(1);

    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            fullname: '',
            tel: '',
            email: '',
            reservation_date: null,
            reservation_time: null,
            party_size: 1,
            note: '',
            ban_an_id: undefined,
        }
    });

    // Lấy giá trị ngày/giờ và số khách để tìm bàn
    const watchDate = watch('reservation_date');
    const watchTime = watch('reservation_time');
    const watchPartySize = watch('party_size');
    const combinedDateTime = watchDate && watchTime ? watchDate.hour(watchTime.hour()).minute(watchTime.minute()).second(0).toISOString() : undefined;

    // --- RTK Query ---
    // Tìm bàn trống
    // tableApi may export different hook names depending on version; pick the first available one.
    const _useGetAvailableTablesHook = (tableApi as any).useGetAvailableTablesByDateQuery || (tableApi as any).useGetAvailableTablesQuery || (tableApi as any).useGetTablesQuery;
    const { data: availableTables, isLoading: isLoadingTables, isFetching: isFetchingTables } = _useGetAvailableTablesHook ? _useGetAvailableTablesHook({
        date: combinedDateTime!, // Chỉ gọi khi có đủ ngày giờ
        partySize: watchPartySize || 1,
    }, {
        skip: !combinedDateTime || !watchPartySize || watchPartySize <= 0, // Bỏ qua nếu thiếu thông tin
    }) : { data: undefined, isLoading: false, isFetching: false };

    // Tìm sản phẩm để thêm
    const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({
        page: 1, pageSize: 50, searchName: debouncedSearchTerm, trang_thai: true,
    });

    const [createAdminReservation, { isLoading: isCreating }] = useCreateAdminReservationMutation();


    // --- Handlers ---
    const handleAddDish = () => {
        if (!selectedProductToAdd || quantityToAdd <= 0) return;
        const product = productsData?.data.find(p => p.id === selectedProductToAdd);
        if (!product) return;

        const price = product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban;

        setSelectedDishes(prev => {
            const existingIndex = prev.findIndex(d => d.productId === selectedProductToAdd);
            if (existingIndex > -1) {
                // Cập nhật số lượng
                const updated = [...prev];
                updated[existingIndex].quantity += quantityToAdd;
                return updated;
            } else {
                // Thêm mới
                return [...prev, { productId: product.id, name: product.ten_san_pham, quantity: quantityToAdd, price }];
            }
        });
        setSelectedProductToAdd(undefined);
        setQuantityToAdd(1);
        setSearchTerm('');
    };

    const handleDishQuantityChange = (productId: number, newQuantity: number | null) => {
        if (newQuantity === null || newQuantity <= 0) { // Xóa nếu số lượng <= 0
            setSelectedDishes(prev => prev.filter(d => d.productId !== productId));
        } else {
            setSelectedDishes(prev => prev.map(d => d.productId === productId ? { ...d, quantity: newQuantity } : d));
        }
    };

    const onSubmit = async (data: FormData) => {
        if (!data.reservation_date || !data.reservation_time) {
            message.error('Vui lòng chọn ngày và giờ đặt bàn.');
            return;
        }
        if (selectedDishes.length === 0) {
            message.error('Vui lòng chọn ít nhất một món ăn.');
            return;
        }

        const submitDateTime = data.reservation_date
            .hour(data.reservation_time.hour())
            .minute(data.reservation_time.minute())
            .second(0)
            .utc() // Chuyển sang UTC trước khi gửi ISO string
            .toISOString();


        const submitData = {
            fullname: data.fullname,
            tel: data.tel,
            email: data.email || undefined,
            reservation_date: submitDateTime,
            party_size: data.party_size,
            note: data.note || undefined,
            ban_an_id: data.ban_an_id, // Gửi ID bàn đã chọn (hoặc undefined)
            products: selectedDishes.map(d => ({ product_id: d.productId, quantity: d.quantity })),
            // status: Mặc định backend sẽ xử lý
        };

        try {
            await createAdminReservation(submitData).unwrap();
            message.success('Tạo đặt bàn thành công!');
            reset(); // Reset form
            setSelectedDishes([]); // Xóa món đã chọn
            onSuccess?.(); // Gọi callback thành công (để đóng modal chẳng hạn)
        } catch (err: any) {
            console.error('Lỗi tạo đặt bàn:', err);
            message.error(err.data?.message || 'Tạo đặt bàn thất bại.');
        }
    };

    // --- Disabled Date/Time ---
    const disabledDate = (current: dayjs.Dayjs) => {
        // Không cho chọn quá khứ và quá 7 ngày tới
        const today = dayjs().startOf('day');
        const maxDate = today.add(7, 'day');
        return current && (current < today || current > maxDate);
    };

    const disabledTime = (now: dayjs.Dayjs | null) => {
        // Chỉ cho chọn từ 9h đến 20h
        const disabledHours = () => {
            const hours = [];
            for (let i = 0; i < 9; i++) hours.push(i); // Trước 9h
            for (let i = 21; i < 24; i++) hours.push(i); // Sau 20h (giờ bắt đầu là 20)
            return hours;
        };
        return {
            disabledHours,
            // Có thể thêm disabledMinutes nếu cần chặn phút cụ thể
        };
    };

    // --- Columns ---
    const dishColumns = [
        { title: 'Tên món', dataIndex: 'name', key: 'name' },
        {
            title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: 120,
            render: (qty: number, record: DishItem) => (
                <InputNumber min={0} value={qty} onChange={(value) => handleDishQuantityChange(record.productId, value)} style={{ width: 80 }} />
            )
        },
        { title: 'Đơn giá', dataIndex: 'price', key: 'price', render: (price: number) => formatCurrency(price) },
        { title: 'Thành tiền', key: 'total', render: (record: DishItem) => formatCurrency(record.price * record.quantity) },
    ];

    const totalBill = selectedDishes.reduce((sum, dish) => sum + dish.price * dish.quantity, 0);

    return (
        <Spin spinning={isCreating || isLoadingTables || isLoadingProducts}>
            <Form id="reservation-add-form" layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={24}>
                    {/* Thông tin khách & đặt bàn */}
                    <Col xs={24} md={12}>
                        <Title level={5}>Thông tin Khách hàng & Đặt bàn</Title>
                        <Form.Item label="Họ tên KH" required validateStatus={errors.fullname ? 'error' : ''} help={errors.fullname?.message}>
                            <Controller name="fullname" control={control} rules={{ required: 'Họ tên là bắt buộc' }}
                                render={({ field }) => <Input {...field} placeholder="Nhập họ tên" />} />
                        </Form.Item>
                        <Form.Item label="Số điện thoại KH" required validateStatus={errors.tel ? 'error' : ''} help={errors.tel?.message}>
                            <Controller name="tel" control={control} rules={{ required: 'Số điện thoại là bắt buộc', pattern: { value: /^[0-9]{10}$/, message: 'Số điện thoại gồm 10 chữ số' } }}
                                render={({ field }) => <Input {...field} placeholder="Nhập SĐT (10 số)" />} />
                        </Form.Item>
                        <Form.Item label="Email KH (Không bắt buộc)" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
                            <Controller name="email" control={control} rules={{ pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' } }}
                                render={({ field }) => <Input {...field} type="email" placeholder="Nhập email" />} />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Ngày đặt" required validateStatus={errors.reservation_date ? 'error' : ''} help={errors.reservation_date?.message}>
                                    <Controller name="reservation_date" control={control} rules={{ required: 'Chọn ngày đặt' }}
                                        render={({ field }) => <DatePicker {...field} format="DD/MM/YYYY" disabledDate={disabledDate} style={{ width: '100%' }} />} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Giờ đặt" required validateStatus={errors.reservation_time ? 'error' : ''} help={errors.reservation_time?.message}>
                                    <Controller name="reservation_time" control={control} rules={{ required: 'Chọn giờ đặt' }}
                                        render={({ field }) => <TimePicker {...field} format="HH:mm" minuteStep={15} disabledTime={disabledTime} style={{ width: '100%' }} />} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="Số lượng khách" required validateStatus={errors.party_size ? 'error' : ''} help={errors.party_size?.message}>
                            <Controller name="party_size" control={control} rules={{ required: 'Nhập số khách', min: { value: 1, message: 'Ít nhất 1 khách' } }}
                                render={({ field }) => <InputNumber {...field} min={1} style={{ width: '100%' }} placeholder="Số người" />} />
                        </Form.Item>
                        <Form.Item label="Chọn bàn (Để trống nếu muốn tự động)">
                            <Controller name="ban_an_id" control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Chọn bàn trống phù hợp" loading={isFetchingTables} allowClear disabled={!watchDate || !watchTime || !watchPartySize}>
                                        {(availableTables && availableTables.length > 0) ? availableTables.map((table: RestaurantTable) => (
                                            <Option key={table.id} value={table.id}>Bàn {table.so_ban} (Tầng {table.tang || '?'}, {table.suc_chua} người)</Option>
                                        )) : <Option value={undefined} disabled>Không có bàn trống phù hợp</Option>}
                                    </Select>
                                )} />
                        </Form.Item>
                        <Form.Item label="Ghi chú">
                            <Controller name="note" control={control}
                                render={({ field }) => <Input.TextArea {...field} rows={3} placeholder="Yêu cầu đặc biệt..." />} />
                        </Form.Item>
                    </Col>

                    {/* Chọn món ăn */}
                    <Col xs={24} md={12}>
                        <Title level={5}>Chọn món ăn</Title>
                        <Row gutter={8} align="bottom">
                            <Col flex="auto">
                                <Form.Item label="Tìm & Chọn món">
                                    <Select<number>
                                        showSearch placeholder="Tìm món..." value={selectedProductToAdd}
                                        onChange={value => setSelectedProductToAdd(value)}
                                        onSearch={value => setSearchTerm(value)}
                                        filterOption={false}
                                        notFoundContent={isLoadingProducts ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                        style={{ width: '100%' }} allowClear
                                    >
                                        {productsData?.data?.map(p => (
                                            <Option key={p.id} value={p.id}>{p.ten_san_pham} ({formatCurrency(p.gia_khuyen_mai > 0 ? p.gia_khuyen_mai : p.gia_ban)})</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col style={{ width: 110 }}>
                                <Form.Item label="Số lượng">
                                    <InputNumber<number> min={1} value={quantityToAdd} onChange={value => setQuantityToAdd(value ?? 1)} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label=" ">
                                    <Button type="primary" onClick={handleAddDish} disabled={!selectedProductToAdd}>Thêm</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider />
                        <Title level={5}>Món đã chọn</Title>
                        <Table
                            columns={dishColumns}
                            dataSource={selectedDishes}
                            rowKey="productId"
                            pagination={false}
                            size="small"
                            bordered
                            summary={() => (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={3} align="right">Tổng tiền món:</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align="right"><Text strong>{formatCurrency(totalBill)}</Text></Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </Col>
                </Row>

                {/* Nút submit được đặt bên ngoài hoặc trong modal footer */}
                {/* <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isCreating}>Tạo Đặt Bàn</Button>
                    <Button htmlType="button" onClick={onCancel} style={{ marginLeft: 8 }}>Hủy</Button>
                 </Form.Item> */}
            </Form>
        </Spin>
    );
}

export default ReservationAddForm;