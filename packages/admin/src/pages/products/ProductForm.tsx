// packages/admin/src/pages/products/ProductForm.tsx
import React, { useEffect } from 'react';
import {
    useNavigate,
    useParams
} from 'react-router-dom';
import {
    useForm,
    Controller
} from 'react-hook-form';
import {
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    Spin,
    message, // Sửa: Dùng message từ App.useApp()
    Row,
    Col,
    Switch,
    Card,
    App // <-- THÊM DÒNG NÀY
} from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import {
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation
} from '../../features/products/productApi';
// === SỬA DÒNG DƯỚI ===
import {
    useGetPublicProductCategoriesQuery // <-- Sửa tên hook
} from '../../features/products/categoryApi';
// ====================
import ImageUpload from '../../components/common/ImageUpload';
import {
    Product
} from '../../types/product';

const {
    Option
} = Select;
const {
    TextArea
} = Input;

type FormData = {
    ten_san_pham: string;
    gia_ban: number;
    gia_khuyen_mai: number;
    mo_ta: string;
    danh_muc_id: number;
    trang_thai: boolean;
    hinh_anh_id: number | null;
    ma_san_pham?: string;
};

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const { message } = App.useApp(); // <-- THÊM DÒNG NÀY: Lấy context

    // Lấy dữ liệu cho form
    const {
        data: productData,
        isLoading: isLoadingProduct,
        isFetching: isFetchingProduct,
    } = useGetProductByIdQuery(Number(id), {
        skip: !isEditMode,
    });

    // === SỬA DÒNG DƯỚI ===
    const {
        data: categories, // Hook này giờ trả về mảng, code sẽ chạy đúng
        isLoading: isLoadingCategories
    } = useGetPublicProductCategoriesQuery(); // <-- Sửa tên hook
    // ====================

    // Mutations
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            ten_san_pham: '',
            gia_ban: 0,
            gia_khuyen_mai: 0,
            mo_ta: '',
            trang_thai: true,
            hinh_anh_id: null,
        }
    });

    // Đổ dữ liệu vào form khi ở chế độ edit
    useEffect(() => {
        if (isEditMode && productData) {
            reset({
                ten_san_pham: productData.ten_san_pham,
                ma_san_pham: productData.ma_san_pham,
                gia_ban: productData.gia_ban,
                gia_khuyen_mai: productData.gia_khuyen_mai,
                mo_ta: productData.mo_ta || '',
                danh_muc_id: productData.danh_muc_id,
                trang_thai: productData.trang_thai,
                hinh_anh_id: productData.hinh_anh_id,
            });
        }
    }, [productData, isEditMode, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            if (isEditMode) {
                await updateProduct({ id: Number(id), data }).unwrap();
                message.success('Cập nhật sản phẩm thành công!');
            } else {
                await createProduct(data).unwrap();
                message.success('Thêm sản phẩm thành công!');
            }
            navigate('/products');
        } catch (err) {
            console.error('Lỗi khi lưu sản phẩm:', err);
            message.error('Lưu sản phẩm thất bại.');
        }
    };

    const gia_ban = watch('gia_ban');

    if (isLoadingProduct || isFetchingProduct) {
        return <Spin size="large" className="flex justify-center items-center h-full" />;
    }

    return (
        <Card>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/products')}
                className="mb-4"
            >
                Quay lại danh sách
            </Button>
            <h2 className="text-2xl font-bold mb-4">
                {isEditMode ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}
            </h2>
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={24}>
                    {/* Cột trái: Thông tin chính */}
                    <Col xs={24} md={16}>
                        {isEditMode && (
                            <Form.Item label="Mã sản phẩm">
                                <Controller
                                    name="ma_san_pham"
                                    control={control}
                                    render={({ field }) => <Input {...field} disabled />}
                                />
                            </Form.Item>
                        )}
                        <Form.Item label="Tên sản phẩm" required validateStatus={errors.ten_san_pham ? 'error' : ''} help={errors.ten_san_pham?.message}>
                            <Controller
                                name="ten_san_pham"
                                control={control}
                                rules={{ required: 'Tên sản phẩm là bắt buộc' }}
                                render={({ field }) => <Input {...field} placeholder="Nhập tên sản phẩm" />}
                            />
                        </Form.Item>
                        <Form.Item label="Mô tả">
                            <Controller
                                name="mo_ta"
                                control={control}
                                render={({ field }) => <TextArea {...field} rows={4} placeholder="Mô tả chi tiết sản phẩm" />}
                            />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Giá bán (VND)" required validateStatus={errors.gia_ban ? 'error' : ''} help={errors.gia_ban?.message}>
                                    <Controller
                                        name="gia_ban"
                                        control={control}
                                        rules={{
                                            required: 'Giá bán là bắt buộc',
                                            min: { value: 0, message: 'Giá không thể âm' },
                                        }}
                                        render={({ field }) => (
                                            <InputNumber
                                                {...field}
                                                min={0}
                                                style={{ width: '100%' }}
                                                formatter={(value) =>
                                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                }
                                                parser={(value) => Number(value?.replace(/,/g, '') || 0)} // ✅ Sửa dòng này
                                            />
                                        )}
                                    />

                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Giá khuyến mãi (VND)" validateStatus={errors.gia_khuyen_mai ? 'error' : ''} help={errors.gia_khuyen_mai?.message}>
                                    <Controller
                                        name="gia_khuyen_mai"
                                        control={control}
                                        rules={{
                                            min: { value: 0, message: 'Giá không thể âm' },
                                            validate: (value) =>
                                                value ? value <= gia_ban : true || 'Giá KM phải nhỏ hơn giá gốc', // ✅ sửa dấu so sánh
                                        }}
                                        render={({ field }) => (
                                            <InputNumber
                                                {...field}
                                                min={0}
                                                style={{ width: '100%' }}
                                                formatter={(value) =>
                                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                }
                                                parser={(value) => Number(value?.replace(/,/g, '') || 0)} // ✅ Sửa dòng này
                                            />
                                        )}
                                    />

                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                    {/* Cột phải: Thuộc tính */}
                    <Col xs={24} md={8}>
                        <Form.Item label="Trạng thái">
                            <Controller
                                name="trang_thai"
                                control={control}
                                render={({ field }) => <Switch {...field} checked={field.value} checkedChildren="Hoạt động" unCheckedChildren="Ngưng" />}
                            />
                        </Form.Item>
                        <Form.Item label="Danh mục sản phẩm" required validateStatus={errors.danh_muc_id ? 'error' : ''} help={errors.danh_muc_id?.message}>
                            <Controller
                                name="danh_muc_id"
                                control={control}
                                rules={{ required: 'Vui lòng chọn danh mục' }}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Chọn danh mục" loading={isLoadingCategories}>
                                        {/* Code này giờ sẽ chạy đúng */}
                                        {categories?.map(cat => (
                                            <Option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Ảnh sản phẩm" required validateStatus={errors.hinh_anh_id ? 'error' : ''} help={errors.hinh_anh_id?.message}>
                            <Controller
                                name="hinh_anh_id"
                                control={control}
                                rules={{ required: 'Ảnh sản phẩm là bắt buộc' }}
                                render={({ field }) => (
                                    <ImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        initialImageUrl={productData?.media_files?.file_url}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                        {isEditMode ? 'Cập nhật' : 'Lưu sản phẩm'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ProductForm;