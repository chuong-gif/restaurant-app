// packages/admin/src/pages/blogs/BlogFormPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Select, Spin, message, Row, Col, Card, App, Typography } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


import { useGetBlogPostByIdQuery, useCreateBlogPostMutation, useUpdateBlogPostMutation } from '../../features/blogs/blogApi';
import { useGetPublicBlogCategoriesQuery } from '../../features/blogCategories/blogCategoryApi';
import ImageUpload from '../../components/common/ImageUpload';
import { BlogPost, BlogCategory } from '../../types/blog';
import { useAuth } from '../../hooks/useAuth'; // Lấy thông tin user đăng nhập

const { Option } = Select;
const { Text } = Typography;

// Kiểu dữ liệu cho form
type FormData = {
    tieu_de: string;
    noi_dung: string;
    danh_muc_blog_id?: number | null;
    anh_bia_id?: number | null;
};

// Cấu hình ReactQuill toolbar
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'], // Cho phép chèn ảnh/video vào nội dung
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
    ],
};

const BlogFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const { message } = App.useApp();
    const { user: loggedInUser } = useAuth(); // Lấy user đang đăng nhập

    // --- RTK Query ---
    const { data: postData, isLoading: isLoadingPost, isFetching: isFetchingPost } = useGetBlogPostByIdQuery(Number(id), {
        skip: !isEditMode,
    });
    const { data: categories, isLoading: isLoadingCategories } = useGetPublicBlogCategoriesQuery();

    const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();

    // --- React Hook Form ---
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: { tieu_de: '', noi_dung: '', danh_muc_blog_id: null, anh_bia_id: null }
    });

    // --- State cho ReactQuill ---
    const [quillContent, setQuillContent] = useState('');

    // Đổ dữ liệu vào form khi edit
    useEffect(() => {
        if (isEditMode && postData) {
            reset({
                tieu_de: postData.tieu_de,
                noi_dung: postData.noi_dung, // Dữ liệu text ban đầu
                danh_muc_blog_id: postData.danh_muc_blog_id,
                anh_bia_id: postData.anh_bia_id,
            });
            setQuillContent(postData.noi_dung); // Cập nhật state cho Quill
        } else {
            reset({ tieu_de: '', noi_dung: '', danh_muc_blog_id: null, anh_bia_id: null });
            setQuillContent(''); // Reset Quill
        }
    }, [postData, isEditMode, reset]);

    // --- Handlers ---
    const onSubmit = async (data: FormData) => {
        // Lấy nội dung từ state của ReactQuill
        const submitData = { ...data, noi_dung: quillContent };

        try {
            if (isEditMode) {
                await updatePost({ id: Number(id), data: submitData }).unwrap();
                message.success('Cập nhật bài viết thành công!');
            } else {
                await createPost(submitData).unwrap();
                message.success('Tạo mới bài viết thành công!');
            }
            navigate('/blogs');
        } catch (err: any) {
            console.error('Lỗi khi lưu bài viết:', err);
            message.error(err.data?.message || 'Lưu bài viết thất bại.');
        }
    };

    const isLoading = isCreating || isUpdating || isLoadingPost || isFetchingPost || isLoadingCategories;

    return (
        <Card>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/blogs')} className="mb-4">
                Quay lại danh sách
            </Button>
            <h2 className="text-2xl font-bold mb-4">
                {isEditMode ? 'Chỉnh sửa Bài viết' : 'Tạo mới Bài viết'}
            </h2>
            <Spin spinning={isLoading}>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Row gutter={24}>
                        {/* Cột trái */}
                        <Col xs={24} md={16}>
                            <Form.Item label="Tiêu đề" required validateStatus={errors.tieu_de ? 'error' : ''} help={errors.tieu_de?.message}>
                                <Controller name="tieu_de" control={control} rules={{ required: 'Tiêu đề là bắt buộc' }}
                                    render={({ field }) => <Input {...field} placeholder="Nhập tiêu đề bài viết" />} />
                            </Form.Item>

                            <Form.Item label="Nội dung" required validateStatus={errors.noi_dung ? 'error' : ''} help={errors.noi_dung?.message}>
                                {/* Controller cho ReactQuill */}
                                <Controller
                                    name="noi_dung" // Tên này chỉ để react-hook-form biết là có trường này
                                    control={control}
                                    rules={{ required: 'Nội dung là bắt buộc' }}
                                    render={({ field }) => (
                                        <ReactQuill
                                            theme="snow"
                                            value={quillContent}
                                            onChange={setQuillContent} // Cập nhật state riêng
                                            modules={quillModules}
                                            style={{ height: '300px', marginBottom: '40px' }} // Tăng chiều cao
                                        />
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        {/* Cột phải */}
                        <Col xs={24} md={8}>
                            <Form.Item label="Tác giả">
                                <Input prefix={<UserOutlined />} value={postData?.nguoi_dung?.ho_ten || loggedInUser?.ho_ten || 'N/A'} disabled />
                            </Form.Item>

                            <Form.Item label="Danh mục">
                                <Controller name="danh_muc_blog_id" control={control}
                                    render={({ field }) => (
                                        <Select {...field} placeholder="Chọn danh mục" loading={isLoadingCategories} allowClear>
                                            {categories?.map(cat => (
                                                <Option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</Option>
                                            ))}
                                        </Select>
                                    )} />
                            </Form.Item>

                            <Form.Item label="Ảnh bìa">
                                <Controller name="anh_bia_id" control={control}
                                    render={({ field }) => (
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            initialImageUrl={postData?.media_files?.file_url}
                                        />
                                    )} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className="mt-8"> {/* Thêm margin top */}
                        <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                            {isEditMode ? 'Cập nhật' : 'Đăng bài viết'}
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Card>
    );
};

export default BlogFormPage;