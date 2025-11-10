// ProductListPage.tsx
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
        trang_thai: true,
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
                    className="rounded-xl shadow-md"
                />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_san_pham',
            key: 'name',
            render: (text: string) => (
                <span className="text-gray-700 font-medium">{text}</span>
            )
        },
        {
            title: 'Mã SP',
            dataIndex: 'ma_san_pham',
            key: 'code',
            render: (text: string) => (
                <span className="text-gray-600 font-mono">{text}</span>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'danh_muc_san_pham',
            key: 'category',
            render: (category: Product['danh_muc_san_pham']) => (
                <span className="text-gray-600">{category?.ten_danh_muc || 'N/A'}</span>
            )
        },
        {
            title: 'Giá bán',
            dataIndex: 'gia_ban',
            key: 'price',
            render: (price: number) => (
                <span className="text-green-600 font-semibold">{price.toLocaleString('vi-VN')} đ</span>
            ),
        },
        {
            title: 'Giá KM',
            dataIndex: 'gia_khuyen_mai',
            key: 'sale_price',
            render: (price: number) =>
                price > 0 ? (
                    <span className="text-red-500 font-semibold">{price.toLocaleString('vi-VN')} đ</span>
                ) : (
                    <span className="text-gray-400">-</span>
                ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'status',
            render: (status: boolean) => (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${status
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {status ? 'Đang hoạt động' : 'Ngưng'}
                </div>
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
                        className="bg-blue-500 hover:bg-blue-600 border-0 shadow-md hover:shadow-lg transition-all"
                    >
                        Sửa
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        className="shadow-md hover:shadow-lg transition-all"
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transition-all duration-300 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Quản lý sản phẩm
                </h2>

                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Tìm theo tên sản phẩm..."
                            onSearch={handleSearch}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            allowClear
                            className="rounded-xl border-white/30"
                        />
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Lọc theo danh mục"
                            className="w-full rounded-xl border-white/30"
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
                            className="rounded-xl border-white/30 bg-white/20 hover:bg-white/30 transition-all"
                        >
                            Thùng rác
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/products/new')}
                            className="h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-lg hover:shadow-xl transition-all"
                        >
                            Thêm mới
                        </Button>
                    </Col>
                </Row>

                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg overflow-hidden">
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
                            className: 'px-4 py-2'
                        }}
                        className="custom-table"
                    />
                </div>
            </div>

            <style>{`
                .custom-table .ant-table-thead > tr > th {
                    background: rgba(255, 255, 255, 0.3) !important;
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                    color: #4B5563;
                    font-weight: 600;
                }
                .custom-table .ant-table-tbody > tr > td {
                    background: rgba(255, 255, 255, 0.2) !important;
                    backdrop-filter: blur(5px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                }
                .custom-table .ant-table-tbody > tr:hover > td {
                    background: rgba(255, 255, 255, 0.3) !important;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out; }
            `}</style>
        </div>
    );
};

export default ProductListPage;