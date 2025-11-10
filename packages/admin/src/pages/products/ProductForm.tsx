// ProductForm.tsx
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
    Row,
    Col,
    Switch,
    Card,
    App
} from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import {
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation
} from '../../features/products/productApi';
import {
    useGetPublicProductCategoriesQuery
} from '../../features/products/categoryApi';
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
    const { message } = App.useApp();

    // Lấy dữ liệu cho form
    const {
        data: productData,
        isLoading: isLoadingProduct,
        isFetching: isFetchingProduct,
    } = useGetProductByIdQuery(Number(id), {
        skip: !isEditMode,
    });

    const {
        data: categories,
        isLoading: isLoadingCategories
    } = useGetPublicProductCategoriesQuery();

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
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transition-all duration-300 animate-fade-in">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/products')}
                    className="mb-6 rounded-xl border-white/30 bg-white/20 hover:bg-white/30 transition-all"
                >
                    Quay lại danh sách
                </Button>

                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {isEditMode ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}
                </h2>

                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Row gutter={24}>
                        {/* Cột trái: Thông tin chính */}
                        <Col xs={24} md={16}>
                            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 mb-6">
                                {isEditMode && (
                                    <Form.Item label={<span className="text-gray-700 font-medium">Mã sản phẩm</span>}>
                                        <Controller
                                            name="ma_san_pham"
                                            control={control}
                                            render={({ field }) => <Input {...field} disabled className="rounded-xl border-white/30 bg-white/50" />}
                                        />
                                    </Form.Item>
                                )}
                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">Tên sản phẩm</span>}
                                    required
                                    validateStatus={errors.ten_san_pham ? 'error' : ''}
                                    help={errors.ten_san_pham?.message}
                                >
                                    <Controller
                                        name="ten_san_pham"
                                        control={control}
                                        rules={{ required: 'Tên sản phẩm là bắt buộc' }}
                                        render={({ field }) => <Input {...field} placeholder="Nhập tên sản phẩm" className="rounded-xl border-white/30 bg-white/50" />}
                                    />
                                </Form.Item>
                                <Form.Item label={<span className="text-gray-700 font-medium">Mô tả</span>}>
                                    <Controller
                                        name="mo_ta"
                                        control={control}
                                        render={({ field }) => <TextArea {...field} rows={4} placeholder="Mô tả chi tiết sản phẩm" className="rounded-xl border-white/30 bg-white/50" />}
                                    />
                                </Form.Item>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label={<span className="text-gray-700 font-medium">Giá bán (VND)</span>}
                                            required
                                            validateStatus={errors.gia_ban ? 'error' : ''}
                                            help={errors.gia_ban?.message}
                                        >
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
                                                        className="w-full rounded-xl border-white/30 bg-white/50"
                                                        formatter={(value) =>
                                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                        }
                                                        parser={(value) => Number(value?.replace(/,/g, '') || 0)}
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label={<span className="text-gray-700 font-medium">Giá khuyến mãi (VND)</span>}
                                            validateStatus={errors.gia_khuyen_mai ? 'error' : ''}
                                            help={errors.gia_khuyen_mai?.message}
                                        >
                                            <Controller
                                                name="gia_khuyen_mai"
                                                control={control}
                                                rules={{
                                                    min: { value: 0, message: 'Giá không thể âm' },
                                                    validate: (value) =>
                                                        value ? value <= gia_ban : true || 'Giá KM phải nhỏ hơn giá gốc',
                                                }}
                                                render={({ field }) => (
                                                    <InputNumber
                                                        {...field}
                                                        min={0}
                                                        className="w-full rounded-xl border-white/30 bg-white/50"
                                                        formatter={(value) =>
                                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                        }
                                                        parser={(value) => Number(value?.replace(/,/g, '') || 0)}
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        {/* Cột phải: Thuộc tính */}
                        <Col xs={24} md={8}>
                            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 space-y-6">
                                <Form.Item label={<span className="text-gray-700 font-medium">Trạng thái</span>}>
                                    <Controller
                                        name="trang_thai"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-3">
                                                <Switch
                                                    {...field}
                                                    checked={field.value}
                                                    checkedChildren="Hoạt động"
                                                    unCheckedChildren="Ngưng"
                                                    className="bg-blue-500"
                                                />
                                                <span className="text-gray-600">{field.value ? 'Hoạt động' : 'Ngưng'}</span>
                                            </div>
                                        )}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">Danh mục sản phẩm</span>}
                                    required
                                    validateStatus={errors.danh_muc_id ? 'error' : ''}
                                    help={errors.danh_muc_id?.message}
                                >
                                    <Controller
                                        name="danh_muc_id"
                                        control={control}
                                        rules={{ required: 'Vui lòng chọn danh mục' }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Chọn danh mục"
                                                loading={isLoadingCategories}
                                                className="rounded-xl border-white/30"
                                            >
                                                {categories?.map(cat => (
                                                    <Option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</Option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">Ảnh sản phẩm</span>}
                                    required
                                    validateStatus={errors.hinh_anh_id ? 'error' : ''}
                                    help={errors.hinh_anh_id?.message}
                                >
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
                            </div>
                        </Col>
                    </Row>
                    <Form.Item className="mt-8">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isCreating || isUpdating}
                            className="h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-lg hover:shadow-xl transition-all text-lg font-medium px-8"
                        >
                            {isEditMode ? 'Cập nhật' : 'Lưu sản phẩm'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out; }
            `}</style>
        </div>
    );
};

export default ProductForm;