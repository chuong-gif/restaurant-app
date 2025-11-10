// BlogListPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Space, App, Tooltip, Row, Col, Alert, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CommentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';

import { useGetAdminBlogPostsQuery, useDeleteBlogPostMutation } from '../../features/blogs/blogApi';
import { useGetPublicBlogCategoriesQuery } from '../../features/blogCategories/blogCategoryApi';
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
    const { data: categories, isLoading: isLoadingCategories } = useGetPublicBlogCategoriesQuery();
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
    const handleViewComments = useCallback((id: number) => { navigate(`/blog-comments/${id}`); }, [navigate]);

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
            title: 'Ảnh bìa',
            dataIndex: 'media_files',
            key: 'image',
            width: 80,
            align: 'center' as const,
            render: (media: BlogPost['media_files']) => (
                <Avatar
                    src={media?.file_url}
                    shape="square"
                    size={48}
                    className="rounded-xl shadow-md"
                />
            )
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'tieu_de',
            key: 'title',
            width: 300,
            render: (text: string) => (
                <span className="text-gray-700 font-medium line-clamp-2">{text}</span>
            )
        },
        {
            title: 'Tác giả',
            dataIndex: ['nguoi_dung', 'ho_ten'],
            key: 'author',
            width: 150,
            render: (text: string) => (
                <span className="text-gray-600">{text}</span>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: ['danh_muc_blog', 'ten_danh_muc'],
            key: 'category',
            width: 150,
            render: (cat?: string) => (
                <span className="text-gray-600">{cat || 'Chưa phân loại'}</span>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
            render: (date?: string) => (
                <span className="text-gray-500 text-sm">{date ? formatDateTime(date) : '-'}</span>
            ),
            sorter: (a: BlogPost, b: BlogPost) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix()
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
            fixed: 'right' as const,
            width: 180,
            render: (_: any, record: BlogPost) => (
                <Space size="small">
                    <Tooltip title="Xem bình luận">
                        <Button
                            shape="circle"
                            icon={<CommentOutlined />}
                            onClick={() => handleViewComments(record.id)}
                            className="bg-green-500 hover:bg-green-600 border-0 text-white shadow-md hover:shadow-lg transition-all"
                        />
                    </Tooltip>
                    <Tooltip title="Sửa bài viết">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.id)}
                            className="bg-blue-500 hover:bg-blue-600 border-0 shadow-md hover:shadow-lg transition-all"
                        />
                    </Tooltip>
                    <Tooltip title="Xóa bài viết">
                        <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id, record.tieu_de)}
                            className="shadow-md hover:shadow-lg transition-all"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ], [filters, handleEdit, handleDelete, handleViewComments, hasPermission]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transition-all duration-300 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Quản lý Bài viết
                </h2>

                <Row gutter={[16, 16]} className="mb-6" justify="space-between">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Tìm theo tiêu đề bài viết..."
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            allowClear
                            className="rounded-xl border-white/30"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Lọc theo danh mục"
                            className="w-full rounded-xl border-white/30"
                            value={filters.categoryId}
                            loading={isLoadingCategories}
                            onChange={value => handleFilterChange('categoryId', value)}
                            allowClear
                        >
                            {categories?.map(cat => (
                                <Option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</Option>
                            ))}
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
                        dataSource={postsData?.data || []}
                        rowKey="id"
                        loading={isLoading || isFetching || isDeleting || isLoadingCategories}
                        pagination={{
                            current: filters.page,
                            pageSize: filters.limit,
                            total: postsData?.total || 0,
                            pageSizeOptions: ['5', '10', '20'],
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                            className: 'px-4 py-2'
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 1100 }}
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
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
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

export default BlogListPage;