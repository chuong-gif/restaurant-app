import { Request, Response } from 'express';
// Import toàn bộ các hàm xử lý logic blog từ tầng service
import * as blogService from '../services/blog.service';

// Controller: Lấy danh sách bài viết, có hỗ trợ tìm kiếm và phân trang
export const handleGetBlogs = async (req: Request, res: Response) => {
    try {
        // Lấy từ khóa tìm kiếm từ query (?searchName=...), nếu không có thì là chuỗi rỗng
        const search = (req.query.searchName as string) || '';
        // Lấy số trang hiện tại (mặc định 1)
        const page = parseInt(req.query.page as string) || 1;
        // Lấy số bài viết mỗi trang (mặc định 10)
        const pageSize = parseInt(req.query.limit as string) || 10;
        // Gọi hàm service để lấy danh sách bài viết theo các tham số trên
        const result = await blogService.getBlogs(search, page, pageSize);
        // Trả kết quả JSON gồm message + dữ liệu từ service
        res.status(200).json({ message: 'Lấy danh sách bài viết thành công', ...result });
    } catch (error: any) {
        // Nếu có lỗi trong quá trình xử lý, trả về mã lỗi 500
        res.status(500).json({ message: error.message });
    }
};

// Controller: Lấy chi tiết 1 bài viết theo ID
export const handleGetBlogById = async (req: Request, res: Response) => {
    try {
        // Lấy ID bài viết từ params (URL: /blogs/:id)
        const id = parseInt(req.params.id);
        // Gọi service để lấy thông tin bài viết theo ID
        const blog = await blogService.getBlogById(id);
        // Trả về dữ liệu bài viết
        res.status(200).json(blog);
    } catch (error: any) {
        // Nếu không tìm thấy hoặc lỗi, trả về mã 404
        res.status(404).json({ message: error.message });
    }
};

// Controller: Lấy chi tiết bài viết theo slug (đường dẫn thân thiện)
export const handleGetBlogBySlug = async (req: Request, res: Response) => {
    try {
        // Lấy slug từ URL (ví dụ: /blogs/ten-bai-viet)
        const slug = req.params.slug;
        // Gọi service để lấy bài viết theo slug
        const blog = await blogService.getBlogBySlug(slug);
        // Trả về thông tin bài viết kèm thông báo
        res.status(200).json({ message: 'Lấy thông tin bài viết thành công', data: blog });
    } catch (error: any) {
        // Nếu slug không tồn tại hoặc lỗi, trả về mã 404
        res.status(404).json({ message: error.message });
    }
};

// Controller: Tạo mới một bài viết
export const handleCreateBlog = async (req: Request, res: Response) => {
    try {
        // Gọi service tạo bài viết mới với dữ liệu từ body (title, content, v.v.)
        const newBlog = await blogService.createBlog(req.body);
        // Trả về mã 201 (Created) và dữ liệu bài viết vừa tạo
        res.status(201).json({ message: 'Tạo bài viết thành công', data: newBlog });
    } catch (error: any) {
        // Nếu có lỗi khi tạo (vd: dữ liệu thiếu), trả về mã lỗi 500
        res.status(500).json({ message: error.message });
    }
};

// Controller: Cập nhật bài viết theo ID
export const handleUpdateBlog = async (req: Request, res: Response) => {
    try {
        // Lấy ID bài viết cần cập nhật
        const id = parseInt(req.params.id);
        // Gọi service để cập nhật bài viết với dữ liệu mới trong body
        const updatedBlog = await blogService.updateBlog(id, req.body);
        // Trả về bài viết sau khi cập nhật
        res.status(200).json({ message: 'Cập nhật bài viết thành công', data: updatedBlog });
    } catch (error: any) {
        // Nếu lỗi (vd: không tìm thấy ID), trả về mã lỗi 500
        res.status(500).json({ message: error.message });
    }
};

// Controller: Xóa bài viết theo ID
export const handleDeleteBlog = async (req: Request, res: Response) => {
    try {
        // Lấy ID bài viết cần xóa
        const id = parseInt(req.params.id);
        // Gọi service xóa bài viết theo ID
        await blogService.deleteBlog(id);
        // Trả về thông báo thành công
        res.status(200).json({ message: 'Xóa bài viết thành công' });
    } catch (error: any) {
        // Nếu lỗi trong quá trình xóa, trả về mã lỗi 500
        res.status(500).json({ message: error.message });
    }
};
