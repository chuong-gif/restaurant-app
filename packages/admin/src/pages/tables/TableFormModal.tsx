// packages/admin/src/pages/tables/TableFormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, App, Spin, Row, Col, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { Table } from '../../types/product';
import { useCreateTableMutation, useUpdateTableMutation } from '../../features/tables/tableApi';
import ImageUpload from '../../components/common/ImageUpload';

const { Option } = Select;
const { Link } = Typography;

interface TableFormModalProps {
    open: boolean;
    onClose: () => void;
    table?: Table | null;
}

type FormData = {
    so_ban: number;
    suc_chua: number;
    tang?: number | null;
    trang_thai: boolean;
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
        defaultValues: {
            so_ban: undefined,
            suc_chua: undefined,
            tang: null,
            trang_thai: true,
            mo_ta_vi_tri: null,
            anh_ban_id: null,
            video_ban_id: null,
        }
    });

    useEffect(() => {
        if (open) {
            if (isEditMode && table) {
                reset({
                    so_ban: table.so_ban,
                    suc_chua: table.suc_chua,
                    tang: table.tang,
                    trang_thai: table.trang_thai,
                    mo_ta_vi_tri: table.mo_ta_vi_tri,
                    anh_ban_id: table.anh_ban_id,
                    video_ban_id: table.video_ban_id,
                });
            } else {
                reset({
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
        const submitData = {
            ...formData,
            tang: formData.tang || null,
            mo_ta_vi_tri: formData.mo_ta_vi_tri || null,
        };

        try {
            if (isEditMode) {
                await updateTable({ id: table!.id, data: submitData }).unwrap();
                message.success('Cập nhật bàn ăn thành công!');
            } else {
                if (submitData.so_ban === undefined || submitData.suc_chua === undefined) {
                    message.error('Số bàn và sức chứa là bắt buộc.');
                    return;
                }
                await createTable(submitData as any).unwrap();
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
            title={
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {isEditMode ? `Sửa thông tin Bàn ${table?.so_ban}` : 'Thêm mới Bàn ăn'}
                </div>
            }
            open={open}
            onCancel={onClose}
            onOk={handleSubmit(onSubmit)}
            confirmLoading={isLoading}
            okText={isEditMode ? 'Cập nhật' : 'Tạo mới'}
            cancelText="Hủy"
            maskClosable={false}
            width={800}
            className="glass-modal"
            styles={{
                body: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)'
                }
            }}
        >
            <Spin spinning={isLoading}>
                <div className="glass-card rounded-2xl p-6">
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="space-y-4">
                                    <Form.Item label="Số bàn" required validateStatus={errors.so_ban ? 'error' : ''} help={errors.so_ban?.message}>
                                        <Controller name="so_ban" control={control} rules={{ required: 'Số bàn là bắt buộc' }}
                                            render={({ field }) => (
                                                <InputNumber
                                                    {...field}
                                                    min={1}
                                                    style={{ width: '100%' }}
                                                    placeholder="Nhập số hiệu bàn"
                                                    className="glass-input rounded-xl"
                                                />
                                            )}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Sức chứa (người)" required validateStatus={errors.suc_chua ? 'error' : ''} help={errors.suc_chua?.message}>
                                        <Controller name="suc_chua" control={control} rules={{ required: 'Sức chứa là bắt buộc' }}
                                            render={({ field }) => (
                                                <InputNumber
                                                    {...field}
                                                    min={1}
                                                    style={{ width: '100%' }}
                                                    placeholder="Nhập số người tối đa"
                                                    className="glass-input rounded-xl"
                                                />
                                            )}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Tầng">
                                        <Controller name="tang" control={control}
                                            render={({ field }) => (
                                                <InputNumber
                                                    {...field}
                                                    min={1}
                                                    style={{ width: '100%' }}
                                                    placeholder="Nhập số tầng (vd: 1, 2)"
                                                    className="glass-input rounded-xl"
                                                />
                                            )}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Trạng thái" required>
                                        <Controller name="trang_thai" control={control} rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    placeholder="Chọn trạng thái bàn"
                                                    className="glass-select rounded-xl"
                                                >
                                                    <Option value={true}>Trống</Option>
                                                    <Option value={false}>Đang có khách</Option>
                                                </Select>
                                            )}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Mô tả vị trí">
                                        <Controller name="mo_ta_vi_tri" control={control}
                                            render={({ field }) => (
                                                <Input.TextArea
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    rows={3}
                                                    placeholder="Ví dụ: Gần cửa sổ, View đẹp..."
                                                    className="glass-textarea rounded-xl"
                                                />
                                            )}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="space-y-6">
                                    <Form.Item label="Ảnh đại diện bàn">
                                        <Controller name="anh_ban_id" control={control}
                                            render={({ field }) => (
                                                <div className="glass-upload rounded-2xl p-4">
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        initialImageUrl={table?.media_files_ban_an_anh_ban_idTomedia_files?.file_url}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Video giới thiệu bàn">
                                        <Controller name="video_ban_id" control={control}
                                            render={({ field }) => (
                                                <div className="glass-upload rounded-2xl p-4">
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        initialImageUrl={table?.media_files_ban_an_video_ban_idTomedia_files?.file_url}
                                                    />
                                                </div>
                                            )}
                                        />
                                        {table?.media_files_ban_an_video_ban_idTomedia_files?.file_url && (
                                            <Link href={table.media_files_ban_an_video_ban_idTomedia_files.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors">
                                                Xem video hiện tại
                                            </Link>
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Spin>

            <style >{`
                .glass-modal :global(.ant-modal-content) {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 20px;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                }

                .glass-input :global(.ant-input-number),
                .glass-select :global(.ant-select-selector),
                .glass-textarea :global(.ant-input) {
                    background: rgba(255, 255, 255, 0.4) !important;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    border-radius: 12px !important;
                }

                .glass-upload {
                    background: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                }

                .glass-input :global(.ant-input-number:hover),
                .glass-select :global(.ant-select-selector:hover),
                .glass-textarea :global(.ant-input:hover) {
                    border-color: rgba(102, 126, 234, 0.5) !important;
                    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
                }

                .glass-input :global(.ant-input-number:focus),
                .glass-select :global(.ant-select-focused .ant-select-selector),
                .glass-textarea :global(.ant-input:focus) {
                    border-color: #667eea !important;
                    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
                }
            `}</style>
        </Modal>
    );
};

export default TableFormModal;