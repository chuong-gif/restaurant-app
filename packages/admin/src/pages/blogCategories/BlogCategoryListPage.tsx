// BlogCategoryListPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Space, App, Tooltip, Row, Col, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';

import { useGetAdminBlogCategoriesQuery, useDeleteBlogCategoryMutation } from '../../features/blogCategories/blogCategoryApi';
import BlogCategoryFormModal from '../../features/blogCategories/BlogCategoryFormModal';
import { BlogCategory } from '../../types/blog';

const { Search } = Input;
const { Option } = Select;

const BlogCategoryListPage: React.FC = () => {
    const { message, modal } = App.useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);

    // State cho filter, pagination
    const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: undefined as boolean | undefined });
    const [debouncedSearch] = useDebounce(filters.search, 500);

    // RTK Query
    const { data: categoriesData, isLoading, isFetching, error } = useGetAdminBlogCategoriesQuery({
        ...filters,
        search: debouncedSearch,
    });
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteBlogCategoryMutation();

    // Reset page khi filter
    useEffect(() => {
        setFilters(prev => ({ ...prev, page: 1 }));
    }, [debouncedSearch, filters.status]);

    // Handlers
    const handleFilterChange = useCallback((name: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleTableChange = useCallback((newPagination: any) => {
        setFilters(prev => ({
            ...prev,
            page: newPagination.current,
            limit: newPagination.pageSize,
        }));
    }, []);

    const handleAddNew = useCallback(() => { setSelectedCategory(null); setIsModalOpen(true); }, []);
    const handleEdit = useCallback((category: BlogCategory) => { setSelectedCategory(category); setIsModalOpen(true); }, []);
    const handleCloseModal = useCallback(() => { setIsModalOpen(false); setSelectedCategory(null); }, []);

    const handleDelete = useCallback((id: number, name: string) => {
        modal.confirm({
            title: `Xác nhận xóa danh mục "${name}"`,
            content: 'Các bài viết thuộc danh mục này sẽ được chuyển về "Chưa phân loại". Bạn có chắc muốn xóa?',
            okText: 'Xác nhận xóa', okType: 'danger', cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteCategory(id).unwrap();
                    message.success(`Xóa danh mục "${name}" thành công.`);
                    if (categoriesData?.data.length === 1 && filters.page > 1) {
                        setFilters(prev => ({ ...prev, page: prev.page - 1 }));
                    }
                } catch (error: any) {
                    message.error(error.data?.message || `Xóa danh mục "${name}" thất bại.`);
                }
            },
        });
    }, [deleteCategory, message, modal, categoriesData, filters]);

    // Columns
    const columns = useMemo(() => [
        {
            title: 'STT',
            key: 'stt',
            align: 'center' as const,
            width: 70,
            render: (_: any, __: any, index: number) => (
                <div className="text-gray-600 font-medium">
                    {(filters.page - 1) * filters.limit + index + 1}
                </div>
            )
        },
        {
            title: 'Tên Danh mục',
            dataIndex: 'ten_danh_muc',
            key: 'name',
            render: (text: string) => (
                <span className="text-gray-700 font-medium">{text}</span>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'status',
            align: 'center' as const,
            width: 120,
            render: (status: boolean) => (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${status
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {status ? 'Hoạt động' : 'Ẩn'}
                </div>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
            width: 150,
            render: (_: any, record: BlogCategory) => {
                const isDisabled = record.ten_danh_muc === 'Chưa phân loại';
                return (
                    <Tooltip title={isDisabled ? 'Không thể sửa/xóa danh mục mặc định' : ''}>
                        <Space size="small">
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                                disabled={isDisabled}
                                className="bg-blue-500 hover:bg-blue-600 border-0 shadow-md hover:shadow-lg transition-all"
                            />
                            <Button
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record.id, record.ten_danh_muc)}
                                disabled={isDisabled}
                                className="shadow-md hover:shadow-lg transition-all"
                            />
                        </Space>
                    </Tooltip>
                );
            },
        },
    ], [filters, handleEdit, handleDelete]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transition-all duration-300 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Quản lý Danh mục Bài viết
                </h2>

                <Row gutter={[16, 16]} className="mb-6" justify="space-between">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Tìm theo tên danh mục..."
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            allowClear
                            className="rounded-xl border-white/30"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            className="w-full rounded-xl border-white/30"
                            value={filters.status}
                            onChange={value => handleFilterChange('status', value)}
                            allowClear
                        >
                            <Option value={true}>Hoạt động</Option>
                            <Option value={false}>Ẩn</Option>
                        </Select>
                    </Col>
                    <Col>
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

                {error && (
                    <Alert
                        message="Lỗi tải dữ liệu"
                        description={(error as any)?.data?.message || 'Không thể tải danh sách.'}
                        type="error"
                        showIcon
                        className="mb-4 rounded-xl border-white/30"
                    />
                )}

                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={categoriesData?.data || []}
                        rowKey="id"
                        loading={isLoading || isFetching || isDeleting}
                        pagination={{
                            current: filters.page,
                            pageSize: filters.limit,
                            total: categoriesData?.total || 0,
                            pageSizeOptions: ['5', '10', '20'],
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                            className: 'px-4 py-2'
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 'max-content' }}
                        className="custom-table"
                    />
                </div>

                <BlogCategoryFormModal open={isModalOpen} onClose={handleCloseModal} category={selectedCategory} />
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

export default BlogCategoryListPage;