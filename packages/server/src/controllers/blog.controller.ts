import { Request, Response } from 'express';
import * as blogService from '../services/blog.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

/**

* 🎮 Lấy danh sách bài viết (Admin) — có lọc, tìm kiếm, phân trang
  */
export const handleGetBlogsAdmin = async (req: Request, res: Response) => {
    try {
        const filters = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            search: (req.query.search as string) || undefined,
            categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        };

        // ✅ Gọi hàm getBlogsAdmin mới trong blog.service.ts
        const result = await blogService.getBlogsAdmin(filters);

        res.status(200).json({
            message: 'Lấy danh sách bài viết thành công',
            ...result,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

/**
 * 🎮 Lấy danh sách bài viết (Public)
 */
export const handleGetPublicBlogs = async (req: Request, res: Response) => {
    try {
        const filters = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            search: (req.query.search as string) || undefined,
            categoryId: req.query.danh_muc_id ? parseInt(req.query.danh_muc_id as string) : undefined,
        };
        const result = await blogService.getPublicBlogs(filters); // Gọi service mới
        res.status(200).json({
            message: 'Lấy danh sách bài viết thành công',
            ...result,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

//=====================================================================

/**

* 🎮 Lấy chi tiết bài viết theo ID
  */
export const handleGetBlogById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const blog = await blogService.getBlogById(id);
        res.status(200).json({ message: 'Lấy chi tiết bài viết thành công', data: blog });
    } catch (error: any) {
        if (error.message.includes('không tồn tại')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
        }
    }
};

/**

* 🎮 Lấy chi tiết bài viết theo Slug
  */
export const handleGetBlogBySlug = async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug;
        const blog = await blogService.getBlogBySlug(slug);
        res.status(200).json({ message: 'Lấy chi tiết bài viết thành công', data: blog });
    } catch (error: any) {
        if (error.message.includes('không tồn tại')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
        }
    }
};

/**

* 🎮 Tạo bài viết mới — có liên kết tới người dùng đăng bài
  */
export const handleCreateBlog = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = (req.user as any)?.id; // ✅ Lấy id từ JWT
        if (!userId) {
            return res.status(403).json({ message: 'Không tìm thấy thông tin người dùng xác thực.' });
        }

        const newBlog = await blogService.createBlog({
            ...req.body,
            nguoi_dung_id: userId, // ✅ Gắn ID người đăng bài
        });

        res.status(201).json({ message: 'Tạo bài viết thành công', data: newBlog });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Tạo bài viết thất bại.' });
    }
};

/**

* 🎮 Cập nhật bài viết
  */
export const handleUpdateBlog = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedBlog = await blogService.updateBlog(id, req.body);
        res.status(200).json({ message: 'Cập nhật bài viết thành công', data: updatedBlog });
    } catch (error: any) {
        if (error.message.includes('không tồn tại')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Cập nhật bài viết thất bại.' });
        }
    }
};

/**

* 🎮 Xóa bài viết
  */
export const handleDeleteBlog = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await blogService.deleteBlog(id);
        res.status(200).json({ message: 'Xóa bài viết thành công.' });
    } catch (error: any) {
        if (error.message.includes('không tồn tại')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Xóa bài viết thất bại.' });
        }
    }
};
