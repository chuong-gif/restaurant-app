// File: packages/server/src/controllers/productCategory.controller.ts
import { Request, Response } from 'express';
import * as productCategoryService from '../services/productCategory.service';

/**
 * 🎮 Controller để lấy tất cả danh mục sản phẩm
 */
export const handleGetAllProductCategories = async (req: Request, res: Response) => {
    try {
        const categories = await productCategoryService.getAllProductCategories();
        res.status(200).json({ message: "Lấy danh mục thành công", data: categories });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};