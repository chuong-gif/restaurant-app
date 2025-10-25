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
    App // <-- THÊM DÒNG NÀY
} from 'antd';
import {
    UndoOutlined,
    ArrowLeftOutlined
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
    useUpdateProductMutation
} from '../../features/products/productApi';
// === SỬA DÒNG DƯỚI ===
import {
    useGetPublicProductCategoriesQuery // <-- Sửa tên hook
} from '../../features/products/categoryApi';
// ====================
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
    const { message, modal } = App.useApp(); // <-- THÊM DÒNG NÀY: Lấy context

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
        trang_thai: false, // Chỉ lấy sản phẩm đã xóa (ngưng hoạt động)
    });

    // === SỬA DÒNG DƯỚI ===
    const {
        data: categories, // Hook này giờ trả về mảng, code sẽ chạy đúng
        isLoading: isLoadingCategories
    } = useGetPublicProductCategoriesQuery(); // <-- Sửa tên hook
    // ====================

    const [updateProduct, {
        isLoading: isRestoring
    }] = useUpdateProductMutation();

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
        // === SỬA LẠI HÀM NÀY ĐỂ DÙNG `modal` ===
        modal.confirm({ // <-- Sửa từ Modal.confirm
            title: 'Xác nhận khôi phục',
            content: 'Bạn có chắc muốn khôi phục sản phẩm này?',
            okText: 'Khôi phục',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    // Gọi updateProduct với trang_thai = true
                    await updateProduct({ id, data: { trang_thai: true } }).unwrap();
                    message.success('Khôi phục sản phẩm thành công.');
                } catch (error) {
                    message.error('Khôi phục sản phẩm thất bại.');
                }
            },
        });
        // ===================================
    }, [updateProduct, message, modal]); // Thêm message, modal

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
                </Space>
            ),
        },
    ], [handleRestore]);

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
                        {/* Code này giờ sẽ chạy đúng */}
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
                loading={isLoading || isFetching || isRestoring}
                pagination={{
                    current: productsData?.currentPage || 1,
                    pageSize: filters.pageSize || 10,
                    total: productsData?.total || 0,
                    onChange: handlePageChange,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
                }}
            />
        </div>
    );
};

export default ProductTrashPage;