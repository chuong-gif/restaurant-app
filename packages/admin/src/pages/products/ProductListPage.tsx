// packages/admin/src/pages/products/ProductListPage.tsx
import React, { useState } from 'react';
import {
    Table,
    Button,
    Input,
    Select,
    Avatar,
    Tag,
    Space,
    Row,
    Col,
    App,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    useGetProductsQuery,
    useDeleteProductMutation,
} from '../../features/products/productApi';
import { useGetPublicProductCategoriesQuery } from '../../features/products/categoryApi';
import { setProductFilters, setProductPage } from '../../features/products/productSlice';
import { RootState } from '../../app/store';
import { Product } from '../../types/product';
import { useDebounce } from 'use-debounce';

const { Search } = Input;
const { Option } = Select;

const ProductListPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message, modal } = App.useApp();

    // Lấy filter từ Redux
    const filters = useSelector((state: RootState) => state.productFilters);
    const [searchTerm, setSearchTerm] = useState(filters.searchName);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    // Lấy sản phẩm
    const { data: productsData, isLoading, isFetching } = useGetProductsQuery({
        ...filters,
        searchName: debouncedSearchTerm,
        trang_thai: true, // chỉ lấy sản phẩm đang hoạt động
    });

    // Lấy danh mục sản phẩm
    const { data: categories, isLoading: isLoadingCategories } =
        useGetPublicProductCategoriesQuery();

    // Mutation xóa
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    // Xử lý tìm kiếm
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        dispatch(setProductFilters({ searchName: value, page: 1 }));
    };

    // Lọc theo danh mục
    const handleCategoryChange = (value: number | undefined) => {
        dispatch(setProductFilters({ danh_muc_id: value, page: 1 }));
    };

    // Phân trang
    const handlePageChange = (page: number) => {
        dispatch(setProductPage(page));
    };

    // Xóa sản phẩm
    const handleDelete = (id: number) => {
        modal.confirm({
            title: 'Xác nhận tạm xóa',
            content: 'Bạn có chắc muốn tạm xóa (ngưng hoạt động) sản phẩm này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteProduct(id).unwrap();
                    message.success('Tạm xóa sản phẩm thành công.');
                } catch (error) {
                    message.error('Tạm xóa sản phẩm thất bại.');
                }
            },
        });
    };

    // Cột bảng
    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'media_files',
            key: 'image',
            render: (media_files: Product['media_files']) => (
                <Avatar
                    src={media_files?.file_url || '/placeholder.png'}
                    shape="square"
                    size={64}
                />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_san_pham',
            key: 'name',
        },
        {
            title: 'Mã SP',
            dataIndex: 'ma_san_pham',
            key: 'code',
        },
        {
            title: 'Danh mục',
            dataIndex: 'danh_muc_san_pham',
            key: 'category',
            render: (category: Product['danh_muc_san_pham']) =>
                category?.ten_danh_muc || 'N/A',
        },
        {
            title: 'Giá bán',
            dataIndex: 'gia_ban',
            key: 'price',
            render: (price: number) => `${price.toLocaleString('vi-VN')} đ`,
        },
        {
            title: 'Giá KM',
            dataIndex: 'gia_khuyen_mai',
            key: 'sale_price',
            render: (price: number) =>
                price > 0 ? `${price.toLocaleString('vi-VN')} đ` : '-',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'status',
            render: (status: boolean) => (
                <Tag color={status ? 'green' : 'red'}>
                    {status ? 'Đang hoạt động' : 'Ngưng'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Product) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/products/edit/${record.id}`)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2>

            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} md={8}>
                    <Search
                        placeholder="Tìm theo tên sản phẩm..."
                        onSearch={handleSearch}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        allowClear
                    />
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Select
                        placeholder="Lọc theo danh mục"
                        style={{ width: '100%' }}
                        onChange={handleCategoryChange}
                        value={filters.danh_muc_id}
                        allowClear
                        loading={isLoadingCategories}
                    >
                        {categories?.map((cat) => (
                            <Option key={cat.id} value={cat.id}>
                                {cat.ten_danh_muc}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    md={8}
                    className="flex justify-end gap-2"
                >
                    <Button
                        type="default"
                        icon={<DeleteOutlined />}
                        onClick={() => navigate('/products/trash')}
                    >
                        Thùng rác
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/products/new')}
                    >
                        Thêm mới
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={productsData?.data}
                rowKey="id"
                loading={isLoading || isFetching || isDeleting}
                pagination={{
                    current: productsData?.currentPage,
                    pageSize: filters.pageSize,
                    total: productsData?.total,
                    onChange: handlePageChange,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} sản phẩm`,
                }}
            />
        </div>
    );
};

export default ProductListPage;
