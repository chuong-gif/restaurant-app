// packages/admin/src/features/roles/RoleFormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, App } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { Role } from '../../types/user'; // Import Role type
import { useCreateRoleMutation, useUpdateRoleMutation } from './roleApi'; // Import Role API hooks

interface RoleFormModalProps {
    open: boolean;
    onClose: () => void;
    role?: Role | null; // Dữ liệu để edit
}

type FormData = {
    ten_vai_tro: string;
    mo_ta?: string;
};

const RoleFormModal: React.FC<RoleFormModalProps> = ({ open, onClose, role }) => {
    const isEditMode = !!role;
    const { message } = App.useApp();

    const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
    const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            ten_vai_tro: '',
            mo_ta: '',
        }
    });

    // Đổ dữ liệu vào form khi edit hoặc reset khi add
    useEffect(() => {
        if (open) {
            if (isEditMode && role) {
                reset({
                    ten_vai_tro: role.ten_vai_tro,
                    mo_ta: role.mo_ta || '',
                });
            } else {
                reset({
                    ten_vai_tro: '',
                    mo_ta: '',
                });
            }
        }
    }, [role, isEditMode, reset, open]);

    const onSubmit = async (data: FormData) => {
        try {
            if (isEditMode) {
                await updateRole({ id: role!.id, data: { ten_vai_tro: data.ten_vai_tro, mo_ta: data.mo_ta } }).unwrap();
                message.success('Cập nhật vai trò thành công!');
            } else {
                await createRole({ ten_vai_tro: data.ten_vai_tro, mo_ta: data.mo_ta }).unwrap();
                message.success('Tạo mới vai trò thành công!');
            }

            onClose(); // Đóng modal
        } catch (err: any) {
            console.error('Lỗi khi lưu vai trò:', err);
            message.error(err.data?.message || 'Lưu vai trò thất bại.');
        }
    };

    return (
        <Modal
            title={isEditMode ? 'Cập nhật Vai trò' : 'Thêm mới Vai trò'}
            open={open}
            onCancel={onClose}
            onOk={handleSubmit(onSubmit)}
            confirmLoading={isCreating || isUpdating}
            okText={isEditMode ? 'Cập nhật' : 'Tạo mới'}
            cancelText="Hủy"
            maskClosable={false} // Không đóng khi click bên ngoài
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                    label="Tên Vai trò"
                    required
                    validateStatus={errors.ten_vai_tro ? 'error' : ''}
                    help={errors.ten_vai_tro?.message}
                >
                    <Controller
                        name="ten_vai_tro"
                        control={control}
                        rules={{ required: 'Tên vai trò là bắt buộc' }}
                        render={({ field }) => <Input {...field} placeholder="Nhập tên vai trò (vd: Nhân viên kho)" />}
                    />
                </Form.Item>
                <Form.Item label="Mô tả">
                    <Controller
                        name="mo_ta"
                        control={control}
                        render={({ field }) => <Input.TextArea {...field} rows={3} placeholder="Mô tả chức năng của vai trò này" />}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoleFormModal;