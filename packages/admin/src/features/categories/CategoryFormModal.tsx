// packages/admin/src/features/categories/CategoryFormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { ProductCategory } from '../../types/product';
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation
} from '../products/categoryApi';

interface CategoryFormModalProps {
    open: boolean;
    onClose: () => void;
    category?: ProductCategory | null; // Dữ liệu để edit
}

type FormData = {
    ten_danh_muc: string;
    trang_thai: boolean;
};

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ open, onClose, category }) => {
    const isEditMode = !!category;

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            ten_danh_muc: '',
            trang_thai: true,
        }
    });

    // Đổ dữ liệu vào form khi ở chế độ edit
    useEffect(() => {
        if (isEditMode && category) {
            reset({
                ten_danh_muc: category.ten_danh_muc,
                trang_thai: category.trang_thai,
            });
        } else {
            reset({
                ten_danh_muc: '',
                trang_thai: true,
            });
        }
    }, [category, isEditMode, reset, open]);

    const onSubmit = async (data: FormData) => {
        try {
            if (isEditMode) {
                await updateCategory({ id: category!.id, data }).unwrap();
                message.success('Cập nhật danh mục thành công!');
            } else {
                await createCategory(data).unwrap();
                message.success('Tạo mới danh mục thành công!');
            }
            onClose(); // Đóng modal
        } catch (err: any) {
            console.error('Lỗi khi lưu danh mục:', err);
            message.error(err.data?.message || 'Lưu danh mục thất bại.');
        }
    };

    return (
        <Modal
            title={isEditMode ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}
            open={open}
            onCancel={onClose}
            onOk={handleSubmit(onSubmit)}
            confirmLoading={isCreating || isUpdating}
            okText={isEditMode ? 'Cập nhật' : 'Tạo mới'}
            cancelText="Hủy"
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                    label="Tên danh mục"
                    required
                    validateStatus={errors.ten_danh_muc ? 'error' : ''}
                    help={errors.ten_danh_muc?.message}
                >
                    <Controller
                        name="ten_danh_muc"
                        control={control}
                        rules={{ required: 'Tên danh mục là bắt buộc' }}
                        render={({ field }) => <Input {...field} placeholder="Nhập tên danh mục" />}
                    />
                </Form.Item>
                <Form.Item label="Trạng thái">
                    <Controller
                        name="trang_thai"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                {...field}
                                checked={field.value}
                                checkedChildren="Hoạt động"
                                unCheckedChildren="Ngưng"
                            />
                        )}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryFormModal;