// CategoryListPage.tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
    Table,
    Button,
    Input,
    Select,
    Tag,
    Space,
    Row,
    Col,
    App
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
    const { message, modal } = App.useApp();

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
            modal.confirm({
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
                        message.error(error.data?.message || 'Xóa danh mục thất bại.');
                    }
                },
            });
        },
        [deleteCategory, message, modal]
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
                    return (
                        <div className="text-gray-600 font-medium">
                            {(currentPage - 1) * pageSize + index + 1}
                        </div>
                    );
                },
            },
            {
                title: 'Tên danh mục',
                dataIndex: 'ten_danh_muc',
                key: 'ten_danh_muc',
                render: (text: string) => (
                    <span className="text-gray-700 font-medium">{text}</span>
                )
            },
            {
                title: 'Trạng thái',
                dataIndex: 'trang_thai',
                key: 'trang_thai',
                align: 'center' as const,
                render: (status: boolean) => (
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${status
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        {status ? 'Hoạt động' : 'Ngưng'}
                    </div>
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
                                className="bg-blue-500 hover:bg-blue-600 border-0 shadow-md hover:shadow-lg transition-all"
                            >
                                Sửa
                            </Button>
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record.id)}
                                disabled={isDisabled}
                                className="shadow-md hover:shadow-lg transition-all"
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transition-all duration-300 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Quản lý Danh mục Sản phẩm
                </h2>

                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Tìm theo tên danh mục..."
                            onSearch={handleSearch}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            allowClear
                            className="rounded-xl border-white/30"
                        />
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            className="w-full rounded-xl border-white/30"
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
                            className="h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-lg hover:shadow-xl transition-all"
                        >
                            Thêm mới
                        </Button>
                    </Col>
                </Row>

                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg overflow-hidden">
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
                            className: 'px-4 py-2'
                        }}
                        className="custom-table"
                    />
                </div>

                <CategoryFormModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    category={selectedCategory}
                />
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

export default CategoryListPage;