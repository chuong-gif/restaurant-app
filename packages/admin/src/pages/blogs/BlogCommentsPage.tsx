// BlogCommentsPage.tsx
import React, { useState, useCallback } from 'react';
import { Table, Button, Space, App, Tooltip, Typography, Alert } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import {
    useGetBlogCommentsQuery,
    useDeleteBlogCommentMutation
} from '../../features/blogs/blogApi';
import { useGetBlogPostByIdQuery } from '../../features/blogs/blogApi';
import { BlogComment } from '../../types/blog';
import { formatDateTime } from '../../utils/FormatDateTime';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const BlogCommentsPage: React.FC = () => {
    const navigate = useNavigate();
    const { blogId } = useParams<{ blogId: string }>();
    const { message, modal } = App.useApp();
    const { user } = useAuth();

    const [pagination, setPagination] = useState({ page: 1, limit: 10 });

    const blogIdNum = parseInt(blogId || '0');

    // Lấy thông tin bài viết để hiển thị tiêu đề
    const { data: blogPost, isLoading: isLoadingBlog } = useGetBlogPostByIdQuery(blogIdNum, {
        skip: !blogIdNum,
    });

    // Lấy danh sách bình luận
    const { data: commentsData, isLoading, isFetching, error } = useGetBlogCommentsQuery({
        blogId: blogIdNum,
        ...pagination,
    }, {
        skip: !blogIdNum,
    });

    // Mutation xóa
    const [deleteComment, { isLoading: isDeleting }] = useDeleteBlogCommentMutation();

    // Hàm kiểm tra quyền
    const hasPermission = useCallback((permission: string): boolean => {
        return user?.permissions?.includes(permission) ?? false;
    }, [user]);

    // Xử lý xóa
    const handleDelete = useCallback((comment: BlogComment) => {
        modal.confirm({
            title: 'Xác nhận xóa bình luận',
            content: `Bạn có chắc muốn xóa bình luận của ${comment.nguoi_dung.ho_ten}?`,
            okText: 'Xóa', okType: 'danger', cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteComment(comment.id).unwrap();
                    message.success('Xóa bình luận thành công.');
                } catch (error: any) {
                    message.error(error.data?.message || 'Xóa thất bại.');
                }
            },
        });
    }, [deleteComment, message, modal]);

    // Xử lý thay đổi trang
    const handleTableChange = useCallback((newPagination: any) => {
        setPagination({ page: newPagination.current, limit: newPagination.pageSize });
    }, []);

    // Cột của bảng
    const columns: TableProps<BlogComment>['columns'] = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center' as const,
            width: 70,
            render: (_: any, __: any, index: number) => (
                <div className="text-gray-600 font-medium">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                </div>
            )
        },
        {
            title: 'Người bình luận',
            dataIndex: ['nguoi_dung', 'ho_ten'],
            key: 'author',
            width: 200,
            render: (text: string) => (
                <span className="text-gray-700 font-medium">{text}</span>
            )
        },
        {
            title: 'Nội dung',
            dataIndex: 'noi_dung',
            key: 'content',
            render: (text: string) => (
                <span className="text-gray-600">{text}</span>
            )
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
            render: (date: string) => (
                <span className="text-gray-500 text-sm">{formatDateTime(date)}</span>
            ),
            sorter: (a: BlogComment, b: BlogComment) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix()
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
            width: 100,
            render: (_: any, record: BlogComment) => (
                <Space size="small">
                    {hasPermission('delete_blog_comment') && (
                        <Tooltip title="Xóa bình luận">
                            <Button
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record)}
                                className="shadow-md hover:shadow-lg transition-all"
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    if (!blogIdNum) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                <Alert
                    message="Lỗi"
                    description="Không tìm thấy ID bài viết."
                    type="error"
                    showIcon
                    className="rounded-xl border-white/30"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transition-all duration-300 animate-fade-in">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/blogs')}
                    className="mb-6 rounded-xl border-white/30 bg-white/20 hover:bg-white/30 transition-all"
                >
                    Quay lại danh sách bài viết
                </Button>

                <div className="mb-6">
                    <Title level={3} className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Quản lý Bình luận
                    </Title>
                    <Text type="secondary" className="text-lg text-gray-600">
                        Bài viết: {isLoadingBlog ? 'Đang tải...' : (blogPost?.tieu_de || 'Không rõ')}
                    </Text>
                </div>

                {error && (
                    <Alert
                        message="Lỗi tải dữ liệu"
                        description={(error as any)?.data?.message || 'Không thể tải danh sách bình luận.'}
                        type="error"
                        showIcon
                        className="my-4 rounded-xl border-white/30"
                    />
                )}

                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={commentsData?.data || []}
                        rowKey="id"
                        loading={isLoading || isFetching || isDeleting || isLoadingBlog}
                        pagination={{
                            current: pagination.page,
                            pageSize: pagination.limit,
                            total: commentsData?.total || 0,
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

export default BlogCommentsPage;