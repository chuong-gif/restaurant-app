import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, App, Spin, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { Promotion } from '../../types/promotion';
import { useCreatePromotionMutation, useUpdatePromotionMutation } from './promotionApi';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface PromotionFormModalProps {
    open: boolean;
    onClose: () => void;
    promotion?: Promotion | null;
}

type FormData = {
    ma_khuyen_mai: string;
    giam_gia: number;
    loai_giam_gia: boolean;
    so_luong: number;
    dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null];
};

const PromotionFormModal: React.FC<PromotionFormModalProps> = ({ open, onClose, promotion }) => {
    const isEditMode = !!promotion;
    const { message } = App.useApp();

    const [createPromotion, { isLoading: isCreating }] = useCreatePromotionMutation();
    const [updatePromotion, { isLoading: isUpdating }] = useUpdatePromotionMutation();

    const { control, handleSubmit, reset, watch, setValue, formState: { errors, isValid } } = useForm<FormData>({
        defaultValues: {
            ma_khuyen_mai: '',
            giam_gia: 1,
            loai_giam_gia: false,
            so_luong: 1,
            dateRange: [null, null],
        },
        mode: 'onChange',
    });

    const loaiGiamGia = watch('loai_giam_gia');
    const giamGiaValue = watch('giam_gia');
    const dateRangeValue = watch('dateRange');

    // Kiểm tra xem dateRange có hợp lệ không
    const isDateRangeValid = () => {
        if (!dateRangeValue || !dateRangeValue[0] || !dateRangeValue[1]) {
            return false;
        }
        if (dateRangeValue[1].isBefore(dateRangeValue[0])) {
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (open) {
            if (isEditMode && promotion) {
                const safeGiamGia = promotion.giam_gia > 0 ? promotion.giam_gia : 1;

                reset({
                    ma_khuyen_mai: promotion.ma_khuyen_mai,
                    giam_gia: safeGiamGia,
                    // SỬA LỖI TẠI ĐÂY: Thêm dấu chấm than (!) để đảo ngược lại đúng logic của Backend
                    loai_giam_gia: !promotion.loai_giam_gia,
                    so_luong: promotion.so_luong,
                    dateRange: [
                        promotion.ngay_hieu_luc ? dayjs(promotion.ngay_hieu_luc) : null,
                        promotion.ngay_ket_thuc ? dayjs(promotion.ngay_ket_thuc) : null,
                    ],
                });
            } else {
                reset({
                    ma_khuyen_mai: '',
                    giam_gia: 1,
                    // Mặc định là phần trăm (false)
                    loai_giam_gia: false,
                    so_luong: 1,
                    dateRange: [null, null],
                });
            }
        }
    }, [promotion, isEditMode, reset, open]);
    const onSubmit = async (data: FormData) => {
        console.log('Form data:', data);

        const [ngay_hieu_luc, ngay_ket_thuc] = data.dateRange;

        if (!ngay_hieu_luc || !ngay_ket_thuc) {
            message.error('Vui lòng chọn ngày hiệu lực và ngày kết thúc.');
            return;
        }

        // Kiểm tra validation thủ công
        if (data.loai_giam_gia === false && data.giam_gia > 100) {
            message.error('Phần trăm không thể lớn hơn 100%');
            return;
        }

        if (data.giam_gia <= 0) {
            message.error('Giá trị giảm phải lớn hơn 0');
            return;
        }

        if (ngay_ket_thuc.isBefore(ngay_hieu_luc)) {
            message.error('Ngày kết thúc phải sau ngày bắt đầu');
            return;
        }

        const submitData = {
            code_name: data.ma_khuyen_mai,
            discount: data.giam_gia,
            quantity: data.so_luong,
            type: data.loai_giam_gia,
            valid_from: ngay_hieu_luc.toISOString(),
            valid_to: ngay_ket_thuc.toISOString(),
        };

        console.log('Submit data:', submitData);

        try {
            if (isEditMode) {
                await updatePromotion({ id: promotion!.id, data: submitData }).unwrap();
                message.success('Cập nhật khuyến mãi thành công!');
            } else {
                await createPromotion(submitData).unwrap();
                message.success('Tạo mới khuyến mãi thành công!');
            }
            onClose();
        } catch (err: any) {
            console.error('Lỗi khi lưu khuyến mãi:', err);
            const errorMessage = err.data?.message || err.message || 'Lưu khuyến mãi thất bại.';
            message.error(errorMessage);
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
            okButtonProps={{
                disabled: !isValid,
            }}
        >
            <Spin spinning={isLoading}>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Form.Item
                        label="Mã Khuyến mãi"
                        required
                        validateStatus={errors.ma_khuyen_mai ? 'error' : ''}
                        help={errors.ma_khuyen_mai?.message}
                    >
                        <Controller
                            name="ma_khuyen_mai"
                            control={control}
                            rules={{
                                required: 'Mã khuyến mãi là bắt buộc',
                                minLength: { value: 3, message: 'Mã phải có ít nhất 3 ký tự' }
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Ví dụ: GIAM10PHANTRAM, KHAITRUONG"
                                    onChange={(e) => {
                                        field.onChange(e.target.value.toUpperCase());
                                    }}
                                />
                            )}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Loại giảm giá" required>
                                <Controller
                                    name="loai_giam_gia"
                                    control={control}

                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Chọn loại"
                                            onChange={(value) => {
                                                field.onChange(value);
                                                // Reset giá trị khi đổi loại
                                                if (value === false && giamGiaValue > 100) {
                                                    setValue('giam_gia', 100, { shouldValidate: true });
                                                }
                                            }}
                                        >
                                            <Option value={false}>Phần trăm (%)</Option>
                                            <Option value={true}>Tiền mặt (VND)</Option>
                                        </Select>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Giá trị giảm"
                                required
                                validateStatus={errors.giam_gia ? 'error' : ''}
                                help={errors.giam_gia?.message}
                            >
                                <Controller
                                    name="giam_gia"
                                    control={control}
                                    rules={{
                                        required: 'Giá trị giảm là bắt buộc',
                                        validate: (value) => {
                                            if (value === undefined || value === null) return 'Giá trị giảm là bắt buộc';
                                            if (value <= 0) return 'Giá trị phải lớn hơn 0';

                                            if (!loaiGiamGia && value > 100) {
                                                return 'Phần trăm không thể lớn hơn 100';
                                            }

                                            if (loaiGiamGia && value > 100000000) {
                                                return 'Số tiền quá lớn (tối đa 100,000,000 VND)';
                                            }

                                            return true;
                                        }
                                    }}
                                    render={({ field }) => (
                                        <InputNumber
                                            {...field}
                                            min={1}
                                            max={loaiGiamGia ? 100000000 : 100}
                                            style={{ width: '100%' }}
                                            placeholder={loaiGiamGia ? "Nhập số tiền" : "Nhập phần trăm"}
                                            addonAfter={loaiGiamGia ? 'VND' : '%'}
                                            onChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        />
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Số lượng mã"
                        required
                        validateStatus={errors.so_luong ? 'error' : ''}
                        help={errors.so_luong?.message}
                    >
                        <Controller
                            name="so_luong"
                            control={control}
                            rules={{
                                required: 'Số lượng là bắt buộc',
                                min: { value: 1, message: 'Số lượng ít nhất là 1' }
                            }}
                            render={({ field }) => (
                                <InputNumber
                                    {...field}
                                    min={1}
                                    style={{ width: '100%' }}
                                    placeholder="Số lượng mã có thể sử dụng"
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Thời gian áp dụng"
                        required
                        validateStatus={errors.dateRange ? 'error' : ''}
                        help={errors.dateRange?.message}
                    >
                        <Controller
                            name="dateRange"
                            control={control}
                            rules={{
                                required: 'Vui lòng chọn khoảng thời gian',
                                validate: (value) => {
                                    if (!value || !value[0] || !value[1]) {
                                        return 'Vui lòng chọn đủ ngày bắt đầu và kết thúc';
                                    }
                                    if (value[1].isBefore(value[0])) {
                                        return 'Ngày kết thúc phải sau ngày bắt đầu';
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <RangePicker
                                    {...field}
                                    showTime
                                    format="DD/MM/YYYY HH:mm"
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                    onChange={(dates) => {
                                        field.onChange(dates);
                                    }}
                                />
                            )}
                        />
                    </Form.Item>

                </Form>
            </Spin>
        </Modal>
    );
};

export default PromotionFormModal;