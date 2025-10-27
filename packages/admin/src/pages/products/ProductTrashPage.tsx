// packages/admin/src/pages/products/ProductTrashPage.tsx
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
    DeleteOutlined, // <-- Import icon mới
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
    usePermanentlyDeleteProductMutation // <-- Import hook mới
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

    // === THÊM HOOK XÓA VĨNH VIỄN (SỬA LỖI 2) ===
    const [permanentlyDelete, {
        isLoading: isHardDeleting
    }] = usePermanentlyDeleteProductMutation();
    // =======================================

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
                    // Hàm này giờ đã hoạt động (Sửa lỗi 1)
                    await updateProduct({ id, data: { trang_thai: true } }).unwrap();
                    message.success('Khôi phục sản phẩm thành công.');
                } catch (error) {
                    message.error('Khôi phục sản phẩm thất bại.');
                }
            },
        });
    }, [updateProduct, message, modal]);

    // === THÊM HÀM XÓA VĨNH VIỄN (SỬA LỖI 2) ===
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
    // =========================================

    const columns = useMemo(() => [
        {
            title: 'Ảnh',
            dataIndex: 'media_files',
            key: 'image',
            render: (media_files: Product['media_files']) => (
                <Avatar src={media_files?.file_url} shape="square" size={64} />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_san_pham',
            key: 'name',
        },
        {
            title: 'Danh mục',
            dataIndex: 'danh_muc_san_pham',
            key: 'category',
            render: (category: Product['danh_muc_san_pham']) => category?.ten_danh_muc || 'N/A',
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
                        icon={<UndoOutlined />}
                        onClick={() => handleRestore(record.id)}
                    >
                        Khôi phục
                    </Button>
                    {/* === THÊM NÚT XÓA VĨNH VIỄN (SỬA LỖI 2) === */}
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handlePermanentDelete(record.id)}
                    >
                        Xóa vĩnh viễn
                    </Button>
                    {/* ========================================= */}
                </Space>
            ),
        },
    ], [handleRestore, handlePermanentDelete]); // Thêm dependency

    return (
        <div>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/products')}
                className="mb-4"
            >
                Quay lại danh sách
            </Button>
            <h2 className="text-2xl font-bold mb-4">Sản phẩm đã xóa (Thùng rác)</h2>

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
                            <Option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={productsData?.data || []}
                rowKey="id"
                loading={isLoading || isFetching || isRestoring || isHardDeleting} // Thêm isHardDeleting
                pagination={{
                    current: productsData?.currentPage || 1,
                    pageSize: filters.pageSize || 10,
                    total: productsData?.total || 0,
                    onChange: handlePageChange,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} sản phẩm`,
                }}

            />
        </div>
    );
};

export default ProductTrashPage;