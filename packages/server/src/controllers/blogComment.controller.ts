import { Request, Response } from 'express';
// Import các hàm xử lý logic bình luận từ tầng service
import * as blogCommentService from '../services/blogComment.service';
// Import kiểu request có chứa thông tin người dùng sau khi xác thực token
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// Controller: Lấy danh sách bình luận theo ID của bài viết
export const handleGetComments = async (req: Request, res: Response) => {
    try {
        // Lấy blog_id từ URL (ví dụ: /blogs/:blog_id/comments)
        const blogId = parseInt(req.params.blog_id);
        // Lấy số trang hiện tại (mặc định 1)
        const page = parseInt(req.query.page as string) || 1;
        // Lấy số lượng bình luận mỗi trang (mặc định 10)
        const pageSize = parseInt(req.query.limit as string) || 10;

        // Gọi service để lấy danh sách bình luận theo blog_id
        const result = await blogCommentService.getCommentsByBlogId(blogId, page, pageSize);

        // Trả kết quả JSON gồm message + dữ liệu bình luận + tổng số trang
        res.status(200).json({ message: 'Lấy danh sách bình luận thành công', ...result });
    } catch (error: any) {
        // Nếu có lỗi trong quá trình truy xuất, trả về mã lỗi 500
        res.status(500).json({ message: error.message });
    }
};

// Controller: Tạo bình luận mới (yêu cầu phải đăng nhập)
export const handleCreateComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Lấy user_id từ thông tin người dùng trong token đã được middleware giải mã
        // Dấu "?" dùng để truy cập an toàn trong trường hợp user không tồn tại
        const userId = (req.user as { id?: number })?.id;

        // Nếu chưa đăng nhập hoặc token không hợp lệ, trả về lỗi 401
        if (!userId) {
            return res.status(401).json({ message: 'Yêu cầu không hợp lệ hoặc bạn cần đăng nhập để bình luận.' });
        }

        // Lấy dữ liệu bài viết và nội dung bình luận từ body
        const { blog_id, content } = req.body;

        // Gọi service để tạo bình luận mới (gắn user_id từ token)
        const newComment = await blogCommentService.createComment({
            blog_id,
            user_id: userId,
            content
        });

        // Trả kết quả khi tạo bình luận thành công
        res.status(201).json({ message: 'Bình luận thành công', data: newComment });
    } catch (error: any) {
        // Nếu có lỗi khi tạo bình luận, trả về mã lỗi 500
        res.status(500).json({ message: error.message });
    }
};

// Controller: Cập nhật bình luận (chỉ chủ sở hữu)
export const handleUpdateComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const commentId = parseInt(req.params.id);
        const { content } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Yêu cầu không hợp lệ hoặc bạn cần đăng nhập.' });
        }
        if (!content) {
            return res.status(400).json({ message: 'Nội dung bình luận là bắt buộc.' });
        }

        await blogCommentService.updateComment(commentId, userId, content);
        res.status(200).json({ message: 'Cập nhật bình luận thành công' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
// ===================


// Controller: Xóa bình luận theo ID (SỬA: Thêm kiểm tra quyền)
export const handleDeleteComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const userRole = (req.user as any)?.role; // Giả sử token có vai trò
        const id = parseInt(req.params.id);

        if (!userId) {
            return res.status(401).json({ message: 'Yêu cầu không hợp lệ hoặc bạn cần đăng nhập.' });
        }

        // Truyền cả userId và userRole vào service
        await blogCommentService.deleteComment(id, userId, userRole);

        res.status(200).json({ message: 'Xóa bình luận thành công' });
    } catch (error: any) {
        res.status(400).json({ message: error.message }); // Lỗi 400 nếu không có quyền
    }
};
