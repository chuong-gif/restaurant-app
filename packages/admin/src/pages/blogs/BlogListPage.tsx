// packages/admin/src/pages/blogs/BlogListPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Space, App, Tooltip, Row, Col, Alert, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CommentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';


import { useGetAdminBlogPostsQuery, useDeleteBlogPostMutation } from '../../features/blogs/blogApi';
import { useGetPublicBlogCategoriesQuery } from '../../features/blogCategories/blogCategoryApi'; // Lấy danh mục active
import { BlogPost, BlogCategory } from '../../types/blog';
import { formatDateTime } from '../../utils/FormatDateTime';
import { useAuth } from '../../hooks/useAuth';

const { Search } = Input;
const { Option } = Select;

const BlogListPage: React.FC = () => {
    const navigate = useNavigate();
    const { message, modal } = App.useApp();
    const { user } = useAuth();

    // State cho filter, pagination
    const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', categoryId: undefined as number | undefined });
    const [debouncedSearch] = useDebounce(filters.search, 500);

    // RTK Query
    const { data: postsData, isLoading, isFetching, error } = useGetAdminBlogPostsQuery({
        ...filters,
        search: debouncedSearch,
    });
    const { data: categories, isLoading: isLoadingCategories } = useGetPublicBlogCategoriesQuery(); // Lấy danh mục cho filter
    const [deletePost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();

    // Reset page khi filter
    useEffect(() => { setFilters(prev => ({ ...prev, page: 1 })); }, [debouncedSearch, filters.categoryId]);
    const hasPermission = useCallback((permission: string): boolean => {
        return user?.permissions?.includes(permission) ?? false;
    }, [user]);
    // Handlers
    const handleFilterChange = useCallback((name: keyof typeof filters, value: any) => { setFilters(prev => ({ ...prev, [name]: value })); }, []);
    const handleTableChange = useCallback((newPagination: any) => { setFilters(prev => ({ ...prev, page: newPagination.current, limit: newPagination.pageSize })); }, []);
    const handleAddNew = useCallback(() => { navigate('/blogs/new'); }, [navigate]);
    const handleEdit = useCallback((id: number) => { navigate(`/blogs/edit/${id}`); }, [navigate]);
    const handleViewComments = useCallback((id: number) => { navigate(`/blog-comments/${id}`); }, [navigate]); // Chuyển đến trang quản lý comment (sẽ tạo sau)

    const handleDelete = useCallback((id: number, title: string) => {
        modal.confirm({
            title: `Xác nhận xóa bài viết "${title}"`,
            content: 'Bạn có chắc muốn xóa vĩnh viễn bài viết này?',
            okText: 'Xóa', okType: 'danger', cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deletePost(id).unwrap();
                    message.success(`Xóa bài viết "${title}" thành công.`);
                    if (postsData?.data.length === 1 && filters.page > 1) {
                        setFilters(prev => ({ ...prev, page: prev.page - 1 }));
                    }
                } catch (error: any) {
                    message.error(error.data?.message || `Xóa bài viết "${title}" thất bại.`);
                }
            },
        });
    }, [deletePost, message, modal, postsData, filters]);

    // Columns
    const columns = useMemo(() => [
        { title: 'STT', key: 'stt', align: 'center' as const, width: 70, render: (_: any, __: any, index: number) => (filters.page - 1) * filters.limit + index + 1 },
        { title: 'Ảnh bìa', dataIndex: 'media_files', key: 'image', width: 80, align: 'center' as const, render: (media: BlogPost['media_files']) => <Avatar src={media?.file_url} shape="square" size={48} /> },
        { title: 'Tiêu đề', dataIndex: 'tieu_de', key: 'title', width: 300 },
        { title: 'Tác giả', dataIndex: ['nguoi_dung', 'ho_ten'], key: 'author', width: 150 },
        { title: 'Danh mục', dataIndex: ['danh_muc_blog', 'ten_danh_muc'], key: 'category', width: 150, render: (cat?: string) => cat || 'Chưa phân loại' },
        { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', width: 160, render: (date?: string) => date ? formatDateTime(date) : '-', sorter: (a: BlogPost, b: BlogPost) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix() },
        {
            title: 'Thao tác', key: 'action', align: 'center' as const, fixed: 'right' as const, width: 180,
            render: (_: any, record: BlogPost) => (
                <Space size="small">
                    <Tooltip title="Xem bình luận">
                        <Button shape="circle" icon={<CommentOutlined />} onClick={() => handleViewComments(record.id)} />
                    </Tooltip>
                    <Tooltip title="Sửa bài viết">
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
                    </Tooltip>
                    <Tooltip title="Xóa bài viết">
                        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id, record.tieu_de)} />
                    </Tooltip>
                </Space>
            ),
        },
    ], [filters, handleEdit, handleDelete, handleViewComments, hasPermission]);


    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý Bài viết</h2>
            <Row gutter={[16, 16]} className="mb-4" justify="space-between">
                <Col xs={24} sm={12} md={8}>
                    <Search placeholder="Tìm theo tiêu đề bài viết..." onChange={(e) => handleFilterChange('search', e.target.value)} allowClear style={{ width: '100%' }} />
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Select placeholder="Lọc theo danh mục" style={{ width: '100%' }} value={filters.categoryId}
                        loading={isLoadingCategories} onChange={value => handleFilterChange('categoryId', value)} allowClear>
                        {categories?.map(cat => (<Option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</Option>))}
                    </Select>
                </Col>
                <Col> <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Thêm mới</Button> </Col>
            </Row>
            {error && <Alert message="Lỗi tải dữ liệu" description={(error as any)?.data?.message || 'Không thể tải danh sách.'} type="error" showIcon className="mb-4" />}
            <Table columns={columns} dataSource={postsData?.data || []} rowKey="id"
                loading={isLoading || isFetching || isDeleting || isLoadingCategories}
                pagination={{ current: filters.page, pageSize: filters.limit, total: postsData?.total || 0, pageSizeOptions: ['5', '10', '20'], showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}` }}
                onChange={handleTableChange} scroll={{ x: 1100 }} />
        </div>
    );
};
export default BlogListPage;