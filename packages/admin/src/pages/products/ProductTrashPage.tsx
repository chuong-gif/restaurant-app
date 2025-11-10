// ProductTrashPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
    Table,
    Button,
    Input,
    Select,
    Tag,
    Space,
    Row,
    Col,
    Avatar,
    App
} from 'antd';
import {
    UndoOutlined,
    ArrowLeftOutlined,
    WarningOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import {
    useNavigate
} from 'react-router-dom';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    useGetProductsQuery,
    useUpdateProductMutation,
    usePermanentlyDeleteProductMutation
} from '../../features/products/productApi';
import {
    useGetPublicProductCategoriesQuery
} from '../../features/products/categoryApi';
import {
    setProductFilters,
    setProductPage
} from '../../features/products/productSlice';
import {
    RootState
} from '../../app/store';
import {
    Product
} from '../../types/product';
import {
    useDebounce
} from 'use-debounce';

const {
    Search
} = Input;
const {
    Option
} = Select;

const ProductTrashPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message, modal } = App.useApp();

    const filters = useSelector((state: RootState) => state.productFilters);
    const [searchTerm, setSearchTerm] = useState(filters.searchName);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const {
        data: productsData,
        isLoading,
        isFetching,
    } = useGetProductsQuery({
        ...filters,
        searchName: debouncedSearchTerm,
        trang_thai: false,
    });

    const {
        data: categories,
        isLoading: isLoadingCategories
    } = useGetPublicProductCategoriesQuery();

    const [updateProduct, {
        isLoading: isRestoring
    }] = useUpdateProductMutation();

    const [permanentlyDelete, {
        isLoading: isHardDeleting
    }] = usePermanentlyDeleteProductMutation();

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        dispatch(setProductFilters({ searchName: value, page: 1 }));
    }, [dispatch]);

    const handleCategoryChange = useCallback((value: number | undefined) => {
        dispatch(setProductFilters({ danh_muc_id: value, page: 1 }));
    }, [dispatch]);

    const handlePageChange = useCallback((page: number) => {
        dispatch(setProductPage(page));
    }, [dispatch]);

    const handleRestore = useCallback((id: number) => {
        modal.confirm({
            title: 'Xác nhận khôi phục',
            content: 'Bạn có chắc muốn khôi phục sản phẩm này?',
            okText: 'Khôi phục',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await updateProduct({ id, data: { trang_thai: true } }).unwrap();
                    message.success('Khôi phục sản phẩm thành công.');
                } catch (error) {
                    message.error('Khôi phục sản phẩm thất bại.');
                }
            },
        });
    }, [updateProduct, message, modal]);

    const handlePermanentDelete = useCallback((id: number) => {
        modal.confirm({
            title: 'XÁC NHẬN XÓA VĨNH VIỄN',
            icon: <WarningOutlined style={{ color: 'red' }} />,
            content: 'Hành động này không thể hoàn tác! Bạn có chắc muốn XÓA VĨNH VIỄN sản phẩm này?',
            okText: 'Xóa vĩnh viễn',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await permanentlyDelete(id).unwrap();
                    message.success('Xóa vĩnh viễn sản phẩm thành công.');
                } catch (error: any) {
                    message.error(error.data?.message || 'Xóa vĩnh viễn thất bại.');
                }
            },
        });
    }, [permanentlyDelete, message, modal]);

    const columns = useMemo(() => [
        {
            title: 'Ảnh',
            dataIndex: 'media_files',
            key: 'image',
            render: (media_files: Product['media_files']) => (
                <Avatar
                    src={media_files?.file_url}
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
            title: 'Danh mục',
            dataIndex: 'danh_muc_san_pham',
            key: 'category',
            render: (category: Product['danh_muc_san_pham']) => (
                <span className="text-gray-600">{category?.ten_danh_muc || 'N/A'}</span>
            )
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
                        icon={<UndoOutlined />}
                        onClick={() => handleRestore(record.id)}
                        className="bg-green-500 hover:bg-green-600 border-0 shadow-md hover:shadow-lg transition-all"
                    >
                        Khôi phục
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handlePermanentDelete(record.id)}
                        className="shadow-md hover:shadow-lg transition-all"
                    >
                        Xóa vĩnh viễn
                    </Button>
                </Space>
            ),
        },
    ], [handleRestore, handlePermanentDelete]);

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
                    Sản phẩm đã xóa (Thùng rác)
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
                                <Option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={productsData?.data || []}
                        rowKey="id"
                        loading={isLoading || isFetching || isRestoring || isHardDeleting}
                        pagination={{
                            current: productsData?.currentPage || 1,
                            pageSize: filters.pageSize || 10,
                            total: productsData?.total || 0,
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

export default ProductTrashPage;