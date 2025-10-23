// File: packages/server/src/controllers/productCategory.controller.ts
import { Request, Response } from 'express';
import * as productCategoryService from '../services/productCategory.service';

/**
 * 🎮 Controller để lấy tất cả danh mục sản phẩm
 */
export const handleGetAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await productCategoryService.getAllCategories();
        res.status(200).json(categories); // Trả về danh sách danh mục dạng JSON
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};