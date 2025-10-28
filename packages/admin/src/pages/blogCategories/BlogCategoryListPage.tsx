// packages/admin/src/pages/blogCategories/BlogCategoryListPage.tsx
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
        { title: 'STT', key: 'stt', align: 'center' as const, width: 70, render: (_: any, __: any, index: number) => (filters.page - 1) * filters.limit + index + 1 },
        { title: 'Tên Danh mục', dataIndex: 'ten_danh_muc', key: 'name' },
        {
            title: 'Trạng thái', dataIndex: 'trang_thai', key: 'status', align: 'center' as const, width: 120,
            render: (status: boolean) => <Tag color={status ? 'green' : 'red'}>{status ? 'Hoạt động' : 'Ẩn'}</Tag>
        },
        {
            title: 'Thao tác', key: 'action', align: 'center' as const, width: 150,
            render: (_: any, record: BlogCategory) => {
                const isDisabled = record.ten_danh_muc === 'Chưa phân loại';
                return (
                    <Tooltip title={isDisabled ? 'Không thể sửa/xóa danh mục mặc định' : ''}>
                        <Space size="small">
                            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} disabled={isDisabled} />
                            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id, record.ten_danh_muc)} disabled={isDisabled} />
                        </Space>
                    </Tooltip>
                );
            },
        },
    ], [filters, handleEdit, handleDelete]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý Danh mục Bài viết</h2>
            <Row gutter={[16, 16]} className="mb-4" justify="space-between">
                <Col xs={24} sm={12} md={8}>
                    <Search placeholder="Tìm theo tên danh mục..." onChange={(e) => handleFilterChange('search', e.target.value)} allowClear style={{ width: '100%' }} />
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Select placeholder="Lọc theo trạng thái" style={{ width: '100%' }} value={filters.status}
                        onChange={value => handleFilterChange('status', value)} allowClear>
                        <Option value={true}>Hoạt động</Option>
                        <Option value={false}>Ẩn</Option>
                    </Select>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Thêm mới</Button>
                </Col>
            </Row>
            {error && <Alert message="Lỗi tải dữ liệu" description={(error as any)?.data?.message || 'Không thể tải danh sách.'} type="error" showIcon className="mb-4" />}
            <Table columns={columns} dataSource={categoriesData?.data || []} rowKey="id"
                loading={isLoading || isFetching || isDeleting}
                pagination={{ current: filters.page, pageSize: filters.limit, total: categoriesData?.total || 0, pageSizeOptions: ['5', '10', '20'], showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}` }}
                onChange={handleTableChange} scroll={{ x: 'max-content' }} />
            <BlogCategoryFormModal open={isModalOpen} onClose={handleCloseModal} category={selectedCategory} />
        </div>
    );
};
export default BlogCategoryListPage;