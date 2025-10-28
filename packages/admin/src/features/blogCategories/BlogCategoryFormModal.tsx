// packages/admin/src/features/blogCategories/BlogCategoryFormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, App } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { BlogCategory } from '../../types/blog';
import { useCreateBlogCategoryMutation, useUpdateBlogCategoryMutation } from './blogCategoryApi';

interface BlogCategoryFormModalProps {
    open: boolean;
    onClose: () => void;
    category?: BlogCategory | null;
}

type FormData = {
    ten_danh_muc: string;
    trang_thai: boolean;
};

const BlogCategoryFormModal: React.FC<BlogCategoryFormModalProps> = ({ open, onClose, category }) => {
    const isEditMode = !!category;
    const { message } = App.useApp();

    const [createCategory, { isLoading: isCreating }] = useCreateBlogCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateBlogCategoryMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: { ten_danh_muc: '', trang_thai: true }
    });

    useEffect(() => {
        if (open) {
            if (isEditMode && category) {
                reset({ ten_danh_muc: category.ten_danh_muc, trang_thai: category.trang_thai });
            } else {
                reset({ ten_danh_muc: '', trang_thai: true });
            }
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
            onClose();
        } catch (err: any) {
            console.error('Lỗi khi lưu danh mục:', err);
            message.error(err.data?.message || 'Lưu danh mục thất bại.');
        }
    };

    return (
        <Modal
            title={isEditMode ? 'Cập nhật Danh mục Bài viết' : 'Thêm mới Danh mục Bài viết'}
            open={open}
            onCancel={onClose}
            onOk={handleSubmit(onSubmit)}
            confirmLoading={isCreating || isUpdating}
            okText={isEditMode ? 'Cập nhật' : 'Tạo mới'}
            cancelText="Hủy"
            maskClosable={false}
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item label="Tên Danh mục" required validateStatus={errors.ten_danh_muc ? 'error' : ''} help={errors.ten_danh_muc?.message}>
                    <Controller name="ten_danh_muc" control={control} rules={{ required: 'Tên danh mục là bắt buộc' }}
                        render={({ field }) => <Input {...field} placeholder="Nhập tên danh mục" />} />
                </Form.Item>
                <Form.Item label="Trạng thái">
                    <Controller name="trang_thai" control={control}
                        render={({ field }) => <Switch {...field} checked={field.value} checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BlogCategoryFormModal;