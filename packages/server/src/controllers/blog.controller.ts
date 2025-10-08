import { Request, Response } from 'express';
import * as blogService from '../services/blog.service';

export const handleGetBlogs = async (req: Request, res: Response) => {
    try {
        const search = (req.query.searchName as string) || '';
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;
        const result = await blogService.getBlogs(search, page, pageSize);
        res.status(200).json({ message: 'Lấy danh sách bài viết thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleGetBlogById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const blog = await blogService.getBlogById(id);
        res.status(200).json(blog);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const handleGetBlogBySlug = async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug;
        const blog = await blogService.getBlogBySlug(slug);
        res.status(200).json({ message: 'Lấy thông tin bài viết thành công', data: blog });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const handleCreateBlog = async (req: Request, res: Response) => {
    try {
        const newBlog = await blogService.createBlog(req.body);
        res.status(201).json({ message: 'Tạo bài viết thành công', data: newBlog });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleUpdateBlog = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedBlog = await blogService.updateBlog(id, req.body);
        res.status(200).json({ message: 'Cập nhật bài viết thành công', data: updatedBlog });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleDeleteBlog = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await blogService.deleteBlog(id);
        res.status(200).json({ message: 'Xóa bài viết thành công' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
