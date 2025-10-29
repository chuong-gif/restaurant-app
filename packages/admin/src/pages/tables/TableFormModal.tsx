// packages/admin/src/pages/tables/TableFormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, App, Spin, Row, Col, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { Table } from '../../types/product';
import { useCreateTableMutation, useUpdateTableMutation } from '../../features/tables/tableApi';
import ImageUpload from '../../components/common/ImageUpload';

const { Option } = Select;
const { Link } = Typography; // Giữ lại Link để hiển thị URL video

interface TableFormModalProps {
    open: boolean;
    onClose: () => void;
    table?: Table | null;
}

// Sửa FormData: trang_thai là boolean, so_ban/suc_chua không cho undefined ở đây
type FormData = {
    so_ban: number; // Yêu cầu là number
    suc_chua: number; // Yêu cầu là number
    tang?: number | null;
    trang_thai: boolean; // Yêu cầu là boolean
    mo_ta_vi_tri?: string | null;
    anh_ban_id?: number | null;
    video_ban_id?: number | null;
};

const TableFormModal: React.FC<TableFormModalProps> = ({ open, onClose, table }) => {
    const isEditMode = !!table;
    const { message } = App.useApp();

    const [createTable, { isLoading: isCreating }] = useCreateTableMutation();
    const [updateTable, { isLoading: isUpdating }] = useUpdateTableMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        // Sửa defaultValues: trang_thai là boolean, so_ban/suc_chua là undefined ban đầu
        defaultValues: {
            so_ban: undefined,
            suc_chua: undefined,
            tang: null,
            trang_thai: true, // boolean
            mo_ta_vi_tri: null,
            anh_ban_id: null,
            video_ban_id: null,
        }
    });

    // Bỏ watch và currentVideoUrl không dùng đến

    // Đổ dữ liệu vào form khi edit
    useEffect(() => {
        if (open) {
            if (isEditMode && table) {
                reset({
                    so_ban: table.so_ban,
                    suc_chua: table.suc_chua,
                    tang: table.tang,
                    trang_thai: table.trang_thai, // API trả về boolean
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

    const onSubmit = async (formData: FormData) => {
        // Dữ liệu formData đã đúng kiểu sau khi validate
        const submitData = {
            ...formData, // formData đã có kiểu đúng
            tang: formData.tang || null,
            mo_ta_vi_tri: formData.mo_ta_vi_tri || null,
        };

        try {
            if (isEditMode) {
                await updateTable({ id: table!.id, data: submitData }).unwrap();
                message.success('Cập nhật bàn ăn thành công!');
            } else {
                // Đảm bảo so_ban và suc_chua không phải undefined trước khi gửi đi (dù validation đã check)
                if (submitData.so_ban === undefined || submitData.suc_chua === undefined) {
                    message.error('Số bàn và sức chứa là bắt buộc.');
                    return;
                }
                await createTable(submitData as any).unwrap(); // Cast sang any để tránh lỗi type nếu TableFormInput chưa khớp hoàn toàn (cần kiểm tra lại TableFormInput)
                message.success('Thêm mới bàn ăn thành công!');
            }
            onClose();
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
            width={800}
        >
            <Spin spinning={isLoading}>
                <Form layout="vertical"> {/* Bỏ onFinish ở đây */}
                    <Row gutter={16}>
                        <Col span={12}>
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
                                    // === SỬA: Truyền '' thay vì null/undefined ===
                                    render={({ field }) => <Input.TextArea {...field} value={field.value ?? ''} rows={3} placeholder="Ví dụ: Gần cửa sổ, View đẹp..." />} />

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
                            <Form.Item label="Video giới thiệu bàn">
                                <Controller name="video_ban_id" control={control}
                                    render={({ field }) => (
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            initialImageUrl={table?.media_files_ban_an_video_ban_idTomedia_files?.file_url}
                                        // isVideo={true} // Có thể thêm prop này để ImageUpload biết là video
                                        />
                                    )} />
                                {table?.media_files_ban_an_video_ban_idTomedia_files?.file_url && (
                                    <Link href={table.media_files_ban_an_video_ban_idTomedia_files.file_url} target="_blank" rel="noopener noreferrer">
                                        Xem video hiện tại
                                    </Link>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    );
};

export default TableFormModal;