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
import { useGetBlogPostByIdQuery } from '../../features/blogs/blogApi'; // Lấy tên bài viết
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
            title: 'STT', key: 'stt', align: 'center' as const, width: 70,
            render: (_: any, __: any, index: number) => (pagination.page - 1) * pagination.limit + index + 1
        },
        {
            title: 'Người bình luận', dataIndex: ['nguoi_dung', 'ho_ten'], key: 'author', width: 200
        },
        {
            title: 'Nội dung', dataIndex: 'noi_dung', key: 'content'
        },
        {
            title: 'Ngày gửi', dataIndex: 'created_at', key: 'created_at', width: 160,
            render: (date: string) => formatDateTime(date),
            // Giờ sorter này sẽ hợp lệ
            sorter: (a: BlogComment, b: BlogComment) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix()
        },
        {
            title: 'Thao tác', key: 'action', align: 'center' as const, width: 100,
            render: (_: any, record: BlogComment) => (
                <Space size="small">
                    {hasPermission('delete_blog_comment') && (
                        <Tooltip title="Xóa bình luận">
                            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    if (!blogIdNum) {
        return <Alert message="Lỗi" description="Không tìm thấy ID bài viết." type="error" showIcon />;
    }

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/blogs')} className="mb-4">
                Quay lại danh sách bài viết
            </Button>

            <Title level={3} className="mb-0">Quản lý Bình luận</Title>
            <Text type="secondary" style={{ fontSize: '1.1rem' }}>
                Bài viết: {isLoadingBlog ? 'Đang tải...' : (blogPost?.tieu_de || 'Không rõ')}
            </Text>

            {error && <Alert message="Lỗi tải dữ liệu" description={(error as any)?.data?.message || 'Không thể tải danh sách bình luận.'} type="error" showIcon className="my-4" />}

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
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
                className="mt-4"
            />
        </div>
    );
};

export default BlogCommentsPage;