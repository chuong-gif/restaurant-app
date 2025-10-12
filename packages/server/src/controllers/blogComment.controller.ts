import { Request, Response } from 'express';
import * as blogCommentService from '../services/blogComment.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const handleGetComments = async (req: Request, res: Response) => {
    try {
        const blogId = parseInt(req.params.blog_id);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;

        const result = await blogCommentService.getCommentsByBlogId(blogId, page, pageSize);
        res.status(200).json({ message: 'Lấy danh sách bình luận thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleCreateComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Lấy user_id từ token đã được giải mã bởi middleware
        // Sử dụng optional chaining (?.) để truy cập an toàn
        const userId = (req.user as { id?: number })?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Yêu cầu không hợp lệ hoặc bạn cần đăng nhập để bình luận.' });
        }

        const { blog_id, content } = req.body;
        const newComment = await blogCommentService.createComment({
            blog_id,
            user_id: userId, // Dùng userId đã được xác thực
            content
        });
        res.status(201).json({ message: 'Bình luận thành công', data: newComment });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleDeleteComment = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await blogCommentService.deleteComment(id);
        res.status(200).json({ message: 'Xóa bình luận thành công' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
