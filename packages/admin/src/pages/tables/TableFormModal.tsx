// packages/admin/src/pages/tables/TableFormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, App, Spin, Row, Col, Typography } from 'antd'; // Thêm Typography
import { useForm, Controller } from 'react-hook-form';
import { Table } from '../../types/product';
import { useCreateTableMutation, useUpdateTableMutation } from '../../features/tables/tableApi';
import ImageUpload from '../../components/common/ImageUpload'; // Tái sử dụng component upload

const { Option } = Select;
const { Link } = Typography; // Thêm Link

interface TableFormModalProps {
    open: boolean;
    onClose: () => void;
    table?: Table | null; // Dữ liệu để edit
}

type FormData = {
    so_ban: number;
    suc_chua: number;
    tang?: number | null;
    trang_thai: boolean; // 0=bận, 1=trống
    mo_ta_vi_tri?: string | null;
    anh_ban_id?: number | null;
    video_ban_id?: number | null; // Tạm thời dùng upload ảnh cho video
};

const TableFormModal: React.FC<TableFormModalProps> = ({ open, onClose, table }) => {
    const isEditMode = !!table;
    const { message } = App.useApp();

    const [createTable, { isLoading: isCreating }] = useCreateTableMutation();
    const [updateTable, { isLoading: isUpdating }] = useUpdateTableMutation();

    const { control, handleSubmit, reset, formState: { errors }, watch } = useForm<FormData>({ // Thêm watch
        defaultValues: {
            so_ban: undefined,
            suc_chua: undefined,
            tang: null,
            trang_thai: true, // Mặc định là trống
            mo_ta_vi_tri: null,
            anh_ban_id: null,
            video_ban_id: null,
        }
    });

    // Lấy URL video hiện tại để hiển thị link xem trước
    const currentVideoUrl = watch('video_ban_id') // Theo dõi giá trị video_ban_id trong form
        ? table?.media_files_ban_an_video_ban_idTomedia_files?.file_url // Ưu tiên URL từ data ban đầu (nếu là edit)
        : null; // Hoặc là null nếu chưa có


    // Đổ dữ liệu vào form khi edit hoặc reset khi add
    useEffect(() => {
        if (open) {
            if (isEditMode && table) {
                reset({
                    so_ban: table.so_ban,
                    suc_chua: table.suc_chua,
                    tang: table.tang,
                    trang_thai: table.trang_thai === 1,
                    mo_ta_vi_tri: table.mo_ta_vi_tri,
                    anh_ban_id: table.anh_ban_id,
                    video_ban_id: table.video_ban_id,
                });
            } else {
                reset({ // Reset về giá trị mặc định khi thêm mới
                    so_ban: undefined,
                    suc_chua: undefined,
                    tang: null,
                    trang_thai: true,
                    mo_ta_vi_tri: null,
                    anh_ban_id: null,
                    video_ban_id: null,
                });
            }
        }
    }, [table, isEditMode, reset, open]);

    const onSubmit = async (data: FormData) => {
        // Chuyển đổi giá trị rỗng thành null nếu cần và chuyển trạng thái boolean -> number cho API
        const submitData = {
            ...data,
            tang: data.tang || null,
            mo_ta_vi_tri: data.mo_ta_vi_tri || null,
            trang_thai: data.trang_thai ? 1 : 0,
        };

        try {
            if (isEditMode) {
                await updateTable({ id: table!.id, data: submitData }).unwrap();
                message.success('Cập nhật bàn ăn thành công!');
            } else {
                await createTable(submitData).unwrap();
                message.success('Thêm mới bàn ăn thành công!');
            }
            onClose(); // Đóng modal
        } catch (err: any) {
            console.error('Lỗi khi lưu bàn ăn:', err);
            message.error(err.data?.message || 'Lưu bàn ăn thất bại.');
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <Modal
            title={isEditMode ? `Sửa thông tin Bàn ${table?.so_ban}` : 'Thêm mới Bàn ăn'}
            open={open}
            onCancel={onClose}
            onOk={handleSubmit(onSubmit)}
            confirmLoading={isLoading}
            okText={isEditMode ? 'Cập nhật' : 'Tạo mới'}
            cancelText="Hủy"
            maskClosable={false}
            width={800} // Tăng chiều rộng để chứa 2 cột
        >
            <Spin spinning={isLoading}>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Row gutter={16}>
                        <Col span={12}>
                            {/* ... (Các trường Số bàn, Sức chứa, Tầng, Trạng thái, Mô tả giữ nguyên) ... */}
                            <Form.Item label="Số bàn" required validateStatus={errors.so_ban ? 'error' : ''} help={errors.so_ban?.message}>
                                <Controller name="so_ban" control={control} rules={{ required: 'Số bàn là bắt buộc' }}
                                    render={({ field }) => <InputNumber {...field} min={1} style={{ width: '100%' }} placeholder="Nhập số hiệu bàn" />} />
                            </Form.Item>
                            <Form.Item label="Sức chứa (người)" required validateStatus={errors.suc_chua ? 'error' : ''} help={errors.suc_chua?.message}>
                                <Controller name="suc_chua" control={control} rules={{ required: 'Sức chứa là bắt buộc' }}
                                    render={({ field }) => <InputNumber {...field} min={1} style={{ width: '100%' }} placeholder="Nhập số người tối đa" />} />
                            </Form.Item>
                            <Form.Item label="Tầng">
                                <Controller name="tang" control={control}
                                    render={({ field }) => <InputNumber {...field} min={1} style={{ width: '100%' }} placeholder="Nhập số tầng (vd: 1, 2)" />} />
                            </Form.Item>
                            <Form.Item label="Trạng thái" required>
                                <Controller name="trang_thai" control={control} rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select {...field} placeholder="Chọn trạng thái bàn">
                                            <Option value={true}>Trống</Option>
                                            <Option value={false}>Đang có khách</Option>
                                        </Select>
                                    )} />
                            </Form.Item>
                            <Form.Item label="Mô tả vị trí">
                                <Controller name="mo_ta_vi_tri" control={control}
                                    render={({ field }) => (
                                        <Input.TextArea
                                            rows={3}
                                            placeholder="Ví dụ: Gần cửa sổ, View đẹp..."
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                        />
                                    )} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Ảnh đại diện bàn">
                                <Controller name="anh_ban_id" control={control}
                                    render={({ field }) => (
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            initialImageUrl={table?.media_files_ban_an_anh_ban_idTomedia_files?.file_url}
                                        />
                                    )} />
                            </Form.Item>
                            {/* === SỬA PHẦN VIDEO === */}
                            <Form.Item label="Video giới thiệu bàn">
                                <Controller name="video_ban_id" control={control}
                                    render={({ field }) => (
                                        <ImageUpload // Tạm dùng ImageUpload, chấp nhận file video (nếu cấu hình firebase cho phép)
                                            value={field.value}
                                            onChange={field.onChange}
                                            initialImageUrl={null} // Không hiển thị preview video trong ô upload ảnh
                                        />
                                    )} />
                                {/* Hiển thị link xem video hiện tại */}
                                {table?.media_files_ban_an_video_ban_idTomedia_files?.file_url && (
                                    <Link href={table.media_files_ban_an_video_ban_idTomedia_files.file_url} target="_blank" rel="noopener noreferrer">
                                        Xem video hiện tại
                                    </Link>
                                )}
                            </Form.Item>
                            {/* ===================== */}
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    );
};

export default TableFormModal;