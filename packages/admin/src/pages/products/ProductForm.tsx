import { useEffect } from 'react'; // Bỏ 'React' nếu không dùng JSX namespace, hoặc giữ lại import React from 'react' nếu config yêu cầu
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
// Bỏ Table, Space vì không dùng
import { Form, Input, Button, Select, InputNumber, Spin, Row, Col, Switch, App } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetProductByIdQuery, useCreateProductMutation, useUpdateProductMutation } from '../../features/products/productApi';
import { useGetPublicProductCategoriesQuery } from '../../features/products/categoryApi';
import { useGetMaterialsQuery } from '../../features/inventory/inventoryApi';
import ImageUpload from '../../components/common/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

type RecipeItem = {
    nguyen_lieu_id: number | null;
    so_luong_can: number;
    don_vi_tinh: string;
};

type FormData = {
    ten_san_pham: string;
    gia_ban: number;
    gia_khuyen_mai: number;
    mo_ta: string;
    danh_muc_id: number;
    trang_thai: boolean;
    hinh_anh_id: number | null;
    ma_san_pham?: string;
    cong_thuc: RecipeItem[];
};

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const { message } = App.useApp();

    const { data: productData, isLoading: isLoadingProduct } = useGetProductByIdQuery(Number(id), { skip: !isEditMode });
    const { data: categories, isLoading: isLoadingCategories } = useGetPublicProductCategoriesQuery();

    // Lấy danh sách nguyên liệu
    const { data: materialsData } = useGetMaterialsQuery({ page: 1, limit: 1000, status: 'true' });

    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            ten_san_pham: '',
            gia_ban: 0,
            gia_khuyen_mai: 0,
            mo_ta: '',
            trang_thai: true,
            hinh_anh_id: null,
            cong_thuc: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'cong_thuc'
    });

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
                cong_thuc: productData.cong_thuc?.map((ct: any) => ({
                    nguyen_lieu_id: ct.nguyen_lieu_id,
                    so_luong_can: ct.so_luong_can,
                    don_vi_tinh: ct.don_vi_tinh
                })) || []
            });
        }
    }, [productData, isEditMode, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            // === SỬA LỖI TYPE Ở ĐÂY ===
            // 1. Lọc bỏ các dòng chưa chọn nguyên liệu
            // 2. Map lại để ép kiểu nguyen_lieu_id từ (number | null) thành (number)
            const cleanRecipes = data.cong_thuc
                .filter(ct => ct.nguyen_lieu_id !== null && ct.nguyen_lieu_id !== undefined)
                .map(ct => ({
                    nguyen_lieu_id: ct.nguyen_lieu_id as number, // Ép kiểu tường minh
                    so_luong_can: ct.so_luong_can,
                    don_vi_tinh: ct.don_vi_tinh
                }));

            const cleanData = {
                ...data,
                cong_thuc: cleanRecipes
            };
            // ===========================

            if (isEditMode) {
                await updateProduct({ id: Number(id), data: cleanData }).unwrap();
                message.success('Cập nhật thành công!');
            } else {
                await createProduct(cleanData).unwrap();
                message.success('Thêm mới thành công!');
            }
            navigate('/products');
        } catch (err) {
            message.error('Lưu thất bại.');
        }
    };

    // Đã xóa dòng const gia_ban = watch('gia_ban'); vì không dùng

    if (isLoadingProduct && isEditMode) return <Spin className="flex justify-center mt-20" />;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')} className="mb-4">
                    Quay lại
                </Button>
                <h2 className="text-2xl font-bold mb-6 text-blue-600">
                    {isEditMode ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}
                </h2>

                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Row gutter={24}>
                        <Col xs={24} lg={16}>
                            <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                                <h3 className="font-semibold mb-4 text-gray-700">Thông tin chung</h3>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Tên món" required validateStatus={errors.ten_san_pham ? 'error' : ''}>
                                            <Controller name="ten_san_pham" control={control} rules={{ required: true }} render={({ field }) => <Input {...field} />} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Danh mục" required>
                                            <Controller name="danh_muc_id" control={control} rules={{ required: true }} render={({ field }) => (
                                                <Select {...field} placeholder="Chọn danh mục" loading={isLoadingCategories}>
                                                    {categories?.map(cat => <Option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</Option>)}
                                                </Select>
                                            )} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Giá bán" required>
                                            <Controller name="gia_ban" control={control} render={({ field }) => <InputNumber {...field} className="w-full" formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Giá khuyến mãi">
                                            <Controller name="gia_khuyen_mai" control={control} render={({ field }) => <InputNumber {...field} className="w-full" formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item label="Mô tả">
                                    <Controller name="mo_ta" control={control} render={({ field }) => <TextArea {...field} rows={3} />} />
                                </Form.Item>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-blue-800">Định lượng Nguyên liệu (Công thức)</h3>
                                    <Button type="dashed" icon={<PlusOutlined />} onClick={() => append({ nguyen_lieu_id: null, so_luong_can: 1, don_vi_tinh: '' })}>
                                        Thêm nguyên liệu
                                    </Button>
                                </div>

                                {fields.map((field, index) => (
                                    <Row key={field.id} gutter={12} align="middle" className="mb-2">
                                        <Col span={10}>
                                            <Controller
                                                name={`cong_thuc.${index}.nguyen_lieu_id`}
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        showSearch
                                                        placeholder="Chọn nguyên liệu"
                                                        optionFilterProp="children"
                                                        className="w-full"
                                                        // Đã xóa tham số 'option' không dùng
                                                        onChange={(val) => {
                                                            field.onChange(val);
                                                        }}
                                                    >
                                                        {materialsData?.data.map(m => (
                                                            <Option key={m.id} value={m.id}>{m.ten_nguyen_lieu} (Tồn: {m.so_luong_ton} {m.don_vi_tinh})</Option>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <Controller
                                                name={`cong_thuc.${index}.so_luong_can`}
                                                control={control}
                                                render={({ field }) => <InputNumber {...field} placeholder="Số lượng" min={0} step={0.01} className="w-full" />}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <Controller
                                                name={`cong_thuc.${index}.don_vi_tinh`}
                                                control={control}
                                                render={({ field }) => <Input {...field} placeholder="Đơn vị (VD: kg)" />}
                                            />
                                        </Col>
                                        <Col span={2}>
                                            <Button danger icon={<DeleteOutlined />} onClick={() => remove(index)} />
                                        </Col>
                                    </Row>
                                ))}
                                {fields.length === 0 && <p className="text-gray-400 text-center italic">Chưa có công thức. Món này sẽ không trừ kho khi bán.</p>}
                            </div>
                        </Col>

                        <Col xs={24} lg={8}>
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <Form.Item label="Trạng thái">
                                    <Controller name="trang_thai" control={control} render={({ field }) => <Switch {...field} checked={field.value} checkedChildren="Hoạt động" unCheckedChildren="Ngừng" />} />
                                </Form.Item>
                                <Form.Item label="Ảnh đại diện" required validateStatus={errors.hinh_anh_id ? 'error' : ''}>
                                    <Controller name="hinh_anh_id" control={control} rules={{ required: true }} render={({ field }) => (
                                        <ImageUpload value={field.value} onChange={field.onChange} initialImageUrl={productData?.media_files?.file_url} />
                                    )} />
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>

                    <div className="mt-6 flex justify-end">
                        <Button type="primary" htmlType="submit" size="large" loading={isCreating || isUpdating} className="px-8">
                            {isEditMode ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ProductForm;