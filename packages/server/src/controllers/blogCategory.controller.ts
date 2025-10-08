import { Request, Response } from 'express';
import * as blogCategoryService from '../services/blogCategory.service';
import { Prisma } from '@prisma/client';

export const handleGetCategories = async (req: Request, res: Response) => {
    try {
        const search = (req.query.search as string) || '';
        const status = req.query.searchStatus ? req.query.searchStatus === '1' : undefined;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;

        const result = await blogCategoryService.getCategories(search, status, page, pageSize);
        res.status(200).json({ message: 'Lấy danh sách danh mục thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleCreateCategory = async (req: Request, res: Response) => {
    try {
        const { name, status } = req.body;
        if (!name || status === undefined) {
            return res.status(400).json({ message: 'Tên và trạng thái là bắt buộc.' });
        }
        const newCategory = await blogCategoryService.createCategory(name, status);
        res.status(201).json({ message: 'Tạo danh mục thành công', data: newCategory });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'Tên danh mục đã tồn tại.' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const handleUpdateCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name, status } = req.body;
        const updatedCategory = await blogCategoryService.updateCategory(id, { name, status });
        res.status(200).json({ message: 'Cập nhật danh mục thành công', data: updatedCategory });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'Tên danh mục đã tồn tại.' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const handleDeleteCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await blogCategoryService.deleteCategory(id);
        res.status(200).json({ message: 'Xóa danh mục thành công.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
