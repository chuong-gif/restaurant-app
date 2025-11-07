// packages/admin/src/pages/blogs/BlogFormPage.tsx
import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Select, Spin, Row, Col, Card, App, Typography } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// === IMPORT FIREBASE ===
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../configs/firebase'; // Import storage
// =======================

import { useGetBlogPostByIdQuery, useCreateBlogPostMutation, useUpdateBlogPostMutation } from '../../features/blogs/blogApi';
import { useGetPublicBlogCategoriesQuery } from '../../features/blogCategories/blogCategoryApi';
import ImageUpload from '../../components/common/ImageUpload';
import { BlogPost, BlogCategory } from '../../types/blog';
import { useAuth } from '../../hooks/useAuth'; // Lấy thông tin user đăng nhập

const { Option } = Select;
// const { Text } = Typography;

// Kiểu dữ liệu cho form
type FormData = {
    tieu_de: string;
    noi_dung: string;
    danh_muc_blog_id?: number | null;
    anh_bia_id?: number | null;
};


const BlogFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const { message } = App.useApp();
    const { user: loggedInUser } = useAuth();

    const quillRef = useRef<ReactQuill>(null);

    // --- RTK Query (giữ nguyên) ---
    const { data: postData, isLoading: isLoadingPost, isFetching: isFetchingPost } = useGetBlogPostByIdQuery(Number(id), { skip: !isEditMode });
    const { data: categories, isLoading: isLoadingCategories } = useGetPublicBlogCategoriesQuery();
    const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ // Bỏ setValue
        defaultValues: { tieu_de: '', noi_dung: '', danh_muc_blog_id: null, anh_bia_id: null }
    });

    // Đổ dữ liệu vào form khi edit (giữ nguyên)
    useEffect(() => {
        if (isEditMode && postData) {
            reset({
                tieu_de: postData.tieu_de,
                noi_dung: postData.noi_dung,
                danh_muc_blog_id: postData.danh_muc_blog_id,
                anh_bia_id: postData.anh_bia_id,
            });
        } else {
            reset({ tieu_de: '', noi_dung: '', danh_muc_blog_id: null, anh_bia_id: null });
        }
    }, [postData, isEditMode, reset]);

    // --- Hàm xử lý upload ảnh của Quill ---
    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files) {
                const file = input.files[0];
                if (!file) return;
                const quill = quillRef.current;
                if (!quill) return;
                const range = quill.getEditorSelection();
                if (!range) return;

                quill.getEditor().insertEmbed(range.index, 'image', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2Fajax-loader.gif?alt=media');

                try {
                    const storageRef = ref(storage, `blogs/images/${Date.now()}_${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    uploadTask.on(
                        'state_changed', null,
                        (error) => {
                            console.error('Upload failed:', error);
                            quill.getEditor().deleteText(range.index, 1);
                            message.error('Upload ảnh thất bại.');
                        },
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            quill.getEditor().deleteText(range.index, 1);
                            quill.getEditor().insertEmbed(range.index, 'image', downloadURL);
                            quill.getEditor().setSelection(range.index + 1, 0);
                        }
                    );
                } catch (error) {
                    console.error('Error uploading image to Firebase:', error);
                    quill.getEditor().deleteText(range.index, 1);
                    message.error('Upload ảnh thất bại.');
                }
            }
        };
    }, [message]);

    // --- Hàm xử lý upload video của Quill ---
    const videoHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'video/*'); // Chỉ chấp nhận video
        input.click();

        input.onchange = async () => {
            if (input.files) {
                const file = input.files[0];
                if (!file) return;
                const quill = quillRef.current;
                if (!quill) return;
                const range = quill.getEditorSelection();
                if (!range) return;

                message.info('Đang tải video lên, vui lòng chờ...');

                try {
                    const storageRef = ref(storage, `blogs/videos/${Date.now()}_${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    uploadTask.on(
                        'state_changed', null,
                        (error) => {
                            console.error('Upload video failed:', error);
                            message.error('Upload video thất bại.');
                        },
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            quill.getEditor().insertEmbed(range.index, 'video', downloadURL);
                            quill.getEditor().setSelection(range.index + 1, 0);
                            message.success('Upload video thành công!');
                        }
                    );
                } catch (error) {
                    console.error('Error uploading video to Firebase:', error);
                    message.error('Upload video thất bại.');
                }
            }
        };
    }, [message]);

    // === 2. ĐẢM BẢO SỬ DỤNG useMemo VÀ `handlers` ===
    // Cấu hình ReactQuill modules
    const quillModules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image', 'video'], // 'image' và 'video' sẽ được xử lý
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['clean']
            ],
            handlers: {
                'image': imageHandler, // <-- Gắn handler cho nút image
                'video': videoHandler, // <-- Gắn handler cho nút video
            },
        },
    }), [imageHandler, videoHandler]); // <-- Thêm dependencies
    // ============================================

    // --- Handlers (onSubmit) ---
    const onSubmit = async (data: FormData) => {
        // ... (code onSubmit giữ nguyên)
        if (!data.noi_dung || data.noi_dung === '<p><br></p>') {
            message.error('Nội dung là bắt buộc');
            return;
        }
        const submitData = data;
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
            {/* ... (Button quay lại, Tiêu đề) ... */}
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
                                <Controller
                                    name="noi_dung"
                                    control={control}
                                    rules={{
                                        required: 'Nội dung là bắt buộc',
                                        validate: (value) => (value && value !== '<p><br></p>') || 'Nội dung là bắt buộc'
                                    }}
                                    render={({ field }) => (
                                        <ReactQuill
                                            ref={quillRef}
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            modules={quillModules} // <-- Truyền modules CÓ handlers
                                            style={{ height: '300px', marginBottom: '40px' }}
                                        />
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        {/* Cột phải (giữ nguyên) */}
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
                    <Form.Item className="mt-8">
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