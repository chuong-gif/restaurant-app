// packages/admin/src/pages/categories/CategoryListPage.tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
    Table,
    Button,
    Input,
    Select,
    Tag,
    // Sửa: Dùng Modal và message từ App.useApp()
    Space,
    Row,
    Col,
    App // <-- THÊM DÒNG NÀY
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';

import {
    useGetAdminProductCategoriesQuery,
    useDeleteCategoryMutation,
} from '../../features/products/categoryApi';
import {
    setCategoryFilters,
    setCategoryPage,
} from '../../features/categories/categorySlice';
import { RootState } from '../../app/store';
import { ProductCategory } from '../../types/product';
import CategoryFormModal from '../../features/categories/CategoryFormModal';

const { Search } = Input;
const { Option } = Select;

const CategoryListPage: React.FC = () => {
    const dispatch = useDispatch();
    const { message, modal } = App.useApp(); // <-- THÊM DÒNG NÀY: Lấy context

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<ProductCategory | null>(null);

    // Redux filters
    const filters = useSelector((state: RootState) => state.categoryFilters);

    // Search input debounce
    const [searchTerm, setSearchTerm] = useState(filters.searchName);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    // RTK Query
    const {
        data: categoriesData,
        isLoading,
        isFetching,
    } = useGetAdminProductCategoriesQuery({
        ...filters,
        searchName: debouncedSearchTerm,
        trang_thai: filters.trang_thai,
    });

    const [deleteCategory, { isLoading: isDeleting }] =
        useDeleteCategoryMutation();

    // --- Handlers ---
    const handleSearch = useCallback(
        (value: string) => {
            setSearchTerm(value);
            dispatch(
                setCategoryFilters({
                    searchName: value,
                    page: 1,
                })
            );
        },
        [dispatch]
    );

    const handleStatusChange = useCallback(
        (value: boolean | undefined) => {
            dispatch(
                setCategoryFilters({
                    trang_thai: value,
                    page: 1,
                })
            );
        },
        [dispatch]
    );

    const handlePageChange = useCallback(
        (page: number) => {
            dispatch(setCategoryPage(page));
        },
        [dispatch]
    );

    const handleAddNew = useCallback(() => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    }, []);

    const handleEdit = useCallback((category: ProductCategory) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback(
        (id: number) => {
            // === SỬA LẠI HÀM NÀY ĐỂ DÙNG `modal` ===
            modal.confirm({ // <-- Sửa từ Modal.confirm
                title: 'Xác nhận xóa',
                content:
                    'Bạn có chắc muốn xóa danh mục này? Nếu danh mục đang có sản phẩm, bạn sẽ không thể xóa.',
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                onOk: async () => {
                    try {
                        await deleteCategory(id).unwrap();
                        message.success('Xóa danh mục thành công.');
                    } catch (error: any) {
                        // Thông báo lỗi giờ sẽ hiện ra
                        message.error(error.data?.message || 'Xóa danh mục thất bại.');
                    }
                },
            });
            // ===================================
        },
        [deleteCategory, message, modal] // Thêm message, modal vào dependency
    );

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedCategory(null);
    }, []);

    // --- Table columns ---
    const columns = useMemo(
        () => [
            {
                title: 'STT',
                key: 'stt',
                align: 'center' as const,
                width: 80,
                render: (_: any, __: ProductCategory, index: number) => {
                    const currentPage = categoriesData?.currentPage ?? 1;
                    const pageSize = filters.pageSize ?? 10;
                    return (currentPage - 1) * pageSize + index + 1;
                },
            },
            {
                title: 'Tên danh mục',
                dataIndex: 'ten_danh_muc',
                key: 'ten_danh_muc',
            },
            {
                title: 'Trạng thái',
                dataIndex: 'trang_thai',
                key: 'trang_thai',
                align: 'center' as const,
                render: (status: boolean) => (
                    <Tag color={status ? 'green' : 'red'}>
                        {status ? 'Hoạt động' : 'Ngưng'}
                    </Tag>
                ),
            },
            {
                title: 'Thao tác',
                key: 'action',
                align: 'center' as const,
                render: (_: any, record: ProductCategory) => {
                    const isDisabled = record.ten_danh_muc === 'Chưa phân loại';
                    return (
                        <Space size="middle">
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                                disabled={isDisabled}
                            >
                                Sửa
                            </Button>
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record.id)}
                                disabled={isDisabled}
                            >
                                Xóa
                            </Button>
                        </Space>
                    );
                },
            },
        ],
        [categoriesData, filters.pageSize, handleEdit, handleDelete]
    );

    // --- Render ---
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                Quản lý Danh mục Sản phẩm
            </h2>

            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} md={8}>
                    <Search
                        placeholder="Tìm theo tên danh mục..."
                        onSearch={handleSearch}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        allowClear
                    />
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Select
                        placeholder="Lọc theo trạng thái"
                        style={{ width: '100%' }}
                        onChange={handleStatusChange}
                        value={filters.trang_thai}
                        allowClear
                    >
                        <Option value={true}>Hoạt động</Option>
                        <Option value={false}>Ngưng</Option>
                    </Select>
                </Col>

                <Col xs={24} sm={24} md={8} className="flex justify-end">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddNew}
                    >
                        Thêm mới
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={categoriesData?.data || []}
                rowKey="id"
                loading={isLoading || isFetching || isDeleting}
                pagination={{
                    current: categoriesData?.currentPage || 1,
                    pageSize: filters.pageSize || 10,
                    total: categoriesData?.total || 0,
                    onChange: handlePageChange,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} danh mục`,
                }}
            />

            {/* Modal Thêm/Sửa */}
            <CategoryFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                category={selectedCategory}
            />
        </div>
    );
};

export default CategoryListPage;