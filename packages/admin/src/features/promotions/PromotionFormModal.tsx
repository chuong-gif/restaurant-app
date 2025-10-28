// packages/admin/src/features/promotions/PromotionFormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, App, Spin, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs'; // Cần dayjs
import { Promotion } from '../../types/promotion';
import { useCreatePromotionMutation, useUpdatePromotionMutation } from './promotionApi';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface PromotionFormModalProps {
    open: boolean;
    onClose: () => void;
    promotion?: Promotion | null; // Dữ liệu để edit
}

// Kiểu dữ liệu cho form
type FormData = {
    ma_khuyen_mai: string;
    giam_gia: number;
    loai_giam_gia: boolean; // false = %, true = Tiền mặt
    so_luong: number;
    dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null]; // Dùng RangePicker
};

const PromotionFormModal: React.FC<PromotionFormModalProps> = ({ open, onClose, promotion }) => {
    const isEditMode = !!promotion;
    const { message } = App.useApp();

    const [createPromotion, { isLoading: isCreating }] = useCreatePromotionMutation();
    const [updatePromotion, { isLoading: isUpdating }] = useUpdatePromotionMutation();

    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            ma_khuyen_mai: '',
            giam_gia: 0,
            loai_giam_gia: false, // Mặc định là %
            so_luong: 1,
            dateRange: [null, null],
        }
    });

    // Theo dõi loại giảm giá để validation giá trị
    const loaiGiamGia = watch('loai_giam_gia');

    // Đổ dữ liệu vào form khi edit hoặc reset khi add
    useEffect(() => {
        if (open) {
            if (isEditMode && promotion) {
                reset({
                    ma_khuyen_mai: promotion.ma_khuyen_mai,
                    giam_gia: promotion.giam_gia,
                    loai_giam_gia: promotion.loai_giam_gia,
                    so_luong: promotion.so_luong,
                    dateRange: [
                        promotion.ngay_hieu_luc ? dayjs(promotion.ngay_hieu_luc) : null,
                        promotion.ngay_ket_thuc ? dayjs(promotion.ngay_ket_thuc) : null,
                    ],
                });
            } else {
                reset({ // Reset về giá trị mặc định khi thêm mới
                    ma_khuyen_mai: '',
                    giam_gia: 0,
                    loai_giam_gia: false,
                    so_luong: 1,
                    dateRange: [null, null],
                });
            }
        }
    }, [promotion, isEditMode, reset, open]);

    const onSubmit = async (data: FormData) => {
        const [ngay_hieu_luc, ngay_ket_thuc] = data.dateRange;

        if (!ngay_hieu_luc || !ngay_ket_thuc) {
            message.error('Vui lòng chọn ngày hiệu lực và ngày kết thúc.');
            return;
        }

        const submitData = {
            ma_khuyen_mai: data.ma_khuyen_mai,
            giam_gia: data.giam_gia,
            loai_giam_gia: data.loai_giam_gia,
            so_luong: data.so_luong,
            ngay_hieu_luc: ngay_hieu_luc.toISOString(), // Chuyển sang ISO string
            ngay_ket_thuc: ngay_ket_thuc.toISOString(),
        };

        try {
            if (isEditMode) {
                await updatePromotion({ id: promotion!.id, data: submitData }).unwrap();
                message.success('Cập nhật khuyến mãi thành công!');
            } else {
                await createPromotion(submitData).unwrap();
                message.success('Tạo mới khuyến mãi thành công!');
            }
            onClose(); // Đóng modal
        } catch (err: any) {
            console.error('Lỗi khi lưu khuyến mãi:', err);
            message.error(err.data?.message || 'Lưu khuyến mãi thất bại.');
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <Modal
            title={isEditMode ? `Sửa Khuyến mãi: ${promotion?.ma_khuyen_mai}` : 'Thêm mới Khuyến mãi'}
            open={open}
            onCancel={onClose}
            onOk={handleSubmit(onSubmit)}
            confirmLoading={isLoading}
            okText={isEditMode ? 'Cập nhật' : 'Tạo mới'}
            cancelText="Hủy"
            maskClosable={false}
            width={600}
        >
            <Spin spinning={isLoading}>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Form.Item label="Mã Khuyến mãi" required validateStatus={errors.ma_khuyen_mai ? 'error' : ''} help={errors.ma_khuyen_mai?.message}>
                        <Controller name="ma_khuyen_mai" control={control} rules={{ required: 'Mã khuyến mãi là bắt buộc' }}
                            render={({ field }) => <Input {...field} placeholder="Ví dụ: GIAM10PHANTRAM, KHAITRUONG" />} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Loại giảm giá" required>
                                <Controller name="loai_giam_gia" control={control} rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select {...field} placeholder="Chọn loại">
                                            <Option value={false}>Phần trăm (%)</Option>
                                            <Option value={true}>Tiền mặt (VND)</Option>
                                        </Select>
                                    )} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Giá trị giảm" required validateStatus={errors.giam_gia ? 'error' : ''} help={errors.giam_gia?.message}>
                                <Controller name="giam_gia" control={control} rules={{
                                    required: 'Giá trị giảm là bắt buộc',
                                    min: { value: 0, message: 'Giá trị không thể âm' },
                                    // Validate % không quá 100
                                    validate: value => (!loaiGiamGia && value > 100) ? 'Phần trăm không thể lớn hơn 100' : true
                                }}
                                    render={({ field }) => <InputNumber {...field} min={0} style={{ width: '100%' }} placeholder="Nhập số tiền hoặc %" addonAfter={loaiGiamGia ? 'VND' : '%'} />} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Số lượng mã" required validateStatus={errors.so_luong ? 'error' : ''} help={errors.so_luong?.message}>
                        <Controller name="so_luong" control={control} rules={{ required: 'Số lượng là bắt buộc', min: { value: 1, message: 'Số lượng ít nhất là 1' } }}
                            render={({ field }) => <InputNumber {...field} min={1} style={{ width: '100%' }} placeholder="Số lượng mã có thể sử dụng" />} />
                    </Form.Item>

                    <Form.Item label="Thời gian áp dụng" required validateStatus={errors.dateRange ? 'error' : ''} help={errors.dateRange?.message}>
                        <Controller name="dateRange" control={control} rules=
                            {{
                                required: 'Vui lòng chọn khoảng thời gian',
                                validate: (value) => value && value[0] && value[1] ? true : 'Vui lòng chọn đủ ngày bắt đầu và kết thúc'
                            }}
                            render={({ field }) => (
                                <RangePicker
                                    {...field}
                                    showTime // Cho phép chọn cả giờ
                                    format="DD/MM/YYYY HH:mm" // Định dạng hiển thị
                                    style={{ width: '100%' }}
                                    // Không cho chọn ngày quá khứ cho ngày bắt đầu
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            )} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default PromotionFormModal;