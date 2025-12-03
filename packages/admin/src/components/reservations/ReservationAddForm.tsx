// packages/admin/src/components/reservations/ReservationAddForm.tsx
import React, { useState } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, TimePicker, Button, Spin, Row, Col, Divider, App, Table, Empty, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import vi from 'dayjs/locale/vi';

import { useGetProductsQuery } from '../../features/products/productApi';
import { useGetAvailableTablesByDateQuery } from '../../features/tables/tableApi';
import { useCreateAdminReservationMutation } from '../../features/reservations/reservationApi';
import { useGetAdminPromotionsQuery } from '../../features/promotions/promotionApi';

import { Table as RestaurantTable } from '../../types/product';
import { formatCurrency } from '../../utils/FormatCurrency';
import { useDebounce } from 'use-debounce';
import { Promotion } from '../../types/promotion';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(vi);

const { Option } = Select;
const { Title, Text } = Typography;

interface ReservationAddFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

type FormData = {
    fullname: string;
    tel: string;
    email?: string;
    reservation_date: dayjs.Dayjs | null;
    reservation_time: dayjs.Dayjs | null;
    party_size: number;
    note?: string;
    ban_an_ids: number[];
};

interface DishItem {
    productId: number;
    name: string;
    quantity: number;
    price: number;
}

const ReservationAddForm: React.FC<ReservationAddFormProps> = ({ onSuccess }) => {
    const { message } = App.useApp();
    const [selectedDishes, setSelectedDishes] = useState<DishItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [selectedProductToAdd, setSelectedProductToAdd] = useState<number | undefined>(undefined);
    const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
    const [selectedPromoId, setSelectedPromoId] = useState<number | undefined>(undefined);

    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            fullname: '',
            tel: '',
            email: '',
            reservation_date: null,
            reservation_time: null,
            party_size: 1,
            note: '',
            ban_an_ids: [],
        }
    });

    const watchDate = watch('reservation_date');
    const watchTime = watch('reservation_time');
    const combinedDateTime = watchDate && watchTime ? watchDate.hour(watchTime.hour()).minute(watchTime.minute()).second(0).toISOString() : undefined;

    const { data: availableTablesResult, isLoading: isLoadingTables, isFetching: isFetchingTables } = useGetAvailableTablesByDateQuery({
        date: combinedDateTime!,
    }, {
        skip: !combinedDateTime,
    });
    const availableTables = availableTablesResult?.data || [];

    const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({
        page: 1, pageSize: 50, searchName: debouncedSearchTerm, trang_thai: true,
    });

    const [createAdminReservation, { isLoading: isCreating }] = useCreateAdminReservationMutation();

    const { data: promotionsData } = useGetAdminPromotionsQuery({
        page: 1,
        limit: 100,
        search: '',
    });

    const validPromotions = promotionsData?.data?.filter((promo: Promotion) => {
        const now = dayjs();
        const start = dayjs(promo.ngay_hieu_luc);
        const end = dayjs(promo.ngay_ket_thuc);
        return now.isAfter(start) && now.isBefore(end) && promo.so_luong > 0;
    }) || [];

    const handleAddDish = () => {
        if (!selectedProductToAdd || quantityToAdd <= 0) return;
        const product = productsData?.data.find(p => p.id === selectedProductToAdd);
        if (!product) return;

        const price = product.gia_khuyen_mai > 0 ? product.gia_khuyen_mai : product.gia_ban;

        setSelectedDishes(prev => {
            const existingIndex = prev.findIndex(d => d.productId === selectedProductToAdd);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantityToAdd;
                return updated;
            } else {
                return [...prev, { productId: product.id, name: product.ten_san_pham, quantity: quantityToAdd, price }];
            }
        });
        setSelectedProductToAdd(undefined);
        setQuantityToAdd(1);
        setSearchTerm('');
    };

    const handleDishQuantityChange = (productId: number, newQuantity: number | null) => {
        if (newQuantity === null || newQuantity <= 0) {
            setSelectedDishes(prev => prev.filter(d => d.productId !== productId));
        } else {
            setSelectedDishes(prev => prev.map(d => d.productId === productId ? { ...d, quantity: newQuantity } : d));
        }
    };

    const calculateTotal = () => {
        const subtotal = selectedDishes.reduce((sum, dish) => sum + dish.price * dish.quantity, 0);

        if (selectedPromoId) {
            const promo = validPromotions.find((p: Promotion) => p.id === selectedPromoId);
            if (promo) {
                let discount = 0;
                // Theo database: true = phần trăm, false = số tiền
                if (promo.loai_giam_gia === true) { // true = phần trăm
                    discount = (subtotal * promo.giam_gia) / 100;
                } else { // false = giảm theo số tiền
                    discount = promo.giam_gia;
                }
                return Math.max(0, subtotal - discount);
            }
        }
        return subtotal;
    };

    const totalBill = calculateTotal();
    const discountAmount = selectedDishes.reduce((sum, dish) => sum + dish.price * dish.quantity, 0) - totalBill;

    const onSubmit = async (data: FormData) => {
        if (!data.reservation_date || !data.reservation_time) {
            message.error('Vui lòng chọn ngày và giờ đặt bàn.');
            return;
        }

        if (selectedDishes.length === 0) {
            message.error('Vui lòng chọn ít nhất một món ăn.');
            return;
        }

        if (!data.ban_an_ids || data.ban_an_ids.length === 0) {
            message.error('Vui lòng chọn ít nhất một bàn ăn.');
            return;
        }

        const submitDateTime = data.reservation_date
            .hour(data.reservation_time.hour())
            .minute(data.reservation_time.minute())
            .second(0)
            .utc()
            .toISOString();

        const submitData = {
            fullname: data.fullname,
            tel: data.tel,
            email: data.email || undefined,
            reservation_date: submitDateTime,
            party_size: data.party_size,
            note: data.note || undefined,
            ban_an_ids: data.ban_an_ids,
            products: selectedDishes.map(d => ({ product_id: d.productId, quantity: d.quantity })),
            khuyen_mai_id: selectedPromoId || undefined,
        };

        try {
            await createAdminReservation(submitData).unwrap();
            message.success('Tạo đặt bàn thành công!');
            reset();
            setSelectedDishes([]);
            setSelectedPromoId(undefined);
            onSuccess?.();
        } catch (err: any) {
            console.error('Lỗi tạo đặt bàn:', err);
            message.error(err.data?.message || 'Tạo đặt bàn thất bại.');
        }
    };

    const disabledDate = (current: dayjs.Dayjs) => {
        const today = dayjs().startOf('day');
        const maxDate = today.add(7, 'day');
        return current && (current < today || current > maxDate);
    };

    const disabledTime = () => {
        const disabledHours = () => {
            const hours = [];
            for (let i = 0; i < 9; i++) hours.push(i);
            for (let i = 21; i < 24; i++) hours.push(i);
            return hours;
        };
        return { disabledHours };
    };

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

    return (
        <Spin spinning={isCreating || isLoadingTables || isLoadingProducts}>
            <Form id="reservation-add-form" layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={24}>
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

                        <Form.Item label="Mã khuyến mãi">
                            <Select
                                value={selectedPromoId}
                                onChange={(value) => setSelectedPromoId(value)}
                                placeholder="Chọn mã khuyến mãi (nếu có)"
                                allowClear
                                loading={!promotionsData}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.children?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {validPromotions.map((promo: Promotion) => (
                                    <Option key={promo.id} value={promo.id}>
                                        {promo.ma_khuyen_mai} - Giảm: {
                                            promo.loai_giam_gia === false ?
                                                formatCurrency(promo.giam_gia) :
                                                `${promo.giam_gia}%`
                                        } (Còn: {promo.so_luong} lượt)
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Chọn bàn (Có thể chọn nhiều)" required validateStatus={errors.ban_an_ids ? 'error' : ''} help={errors.ban_an_ids?.message}>
                            <Controller name="ban_an_ids" control={control} rules={{ required: 'Vui lòng chọn bàn' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        mode="multiple"
                                        placeholder="Chọn các bàn trống"
                                        loading={isFetchingTables}
                                        allowClear
                                        disabled={!watchDate || !watchTime}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {(availableTables && availableTables.length > 0) ? availableTables.map((table: RestaurantTable) => (
                                            <Option key={table.id} value={table.id} label={`Bàn ${table.so_ban}`}>
                                                Bàn {table.so_ban} (Tầng {table.tang || '?'}, {table.suc_chua} người)
                                            </Option>
                                        )) : <Option value={undefined} disabled>Không có bàn trống</Option>}
                                    </Select>
                                )} />
                        </Form.Item>
                        <Form.Item label="Ghi chú">
                            <Controller name="note" control={control}
                                render={({ field }) => <Input.TextArea {...field} rows={3} placeholder="Yêu cầu đặc biệt..." />} />
                        </Form.Item>
                    </Col>

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
                                <>
                                    {selectedPromoId && discountAmount > 0 && (
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3} align="right">
                                                Giảm giá:
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1} align="right">
                                                <Text type="danger">-{formatCurrency(discountAmount)}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    )}

                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3} align="right">
                                            <Text strong>Tổng tiền:</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="right">
                                            <Text strong>{formatCurrency(totalBill)}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )}
                        />
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default ReservationAddForm;