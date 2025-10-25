// packages/server/src/controllers/productCategory.controller.ts
import { Request, Response } from 'express';
import * as productCategoryService from '../services/productCategory.service';

/**
 * 🎮 Controller để lấy danh mục sản phẩm (cho admin, có lọc)
 */
export const handleGetAdminCategories = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const searchName = (req.query.searchName as string) || '';

        const statusQuery = req.query.trang_thai as string;
        const trang_thai = statusQuery === 'true' ? true : (statusQuery === 'false' ? false : undefined);

        const result = await productCategoryService.getAdminCategories(searchName, trang_thai, page, pageSize);

        res.status(200).json({ message: "Lấy danh mục thành công", ...result });
    } catch (error: any) {
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh mục sản phẩm", error: error.message });
    }
};

/**
 * 🎮 Controller để lấy danh mục sản phẩm (cho client, chỉ active)
 */
export const handleGetPublicCategories = async (req: Request, res: Response) => {
    try {
        const result = await productCategoryService.getAdminCategories('', true, 1, 1000); // Lấy tất cả active
        res.status(200).json({ message: "Lấy danh mục thành công", data: result.data });
    } catch (error: any) {
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh mục sản phẩm", error: error.message });
    }
};


/**
 * 🎮 Controller để tạo mới danh mục
 */
export const handleCreateCategory = async (req: Request, res: Response) => {
    try {
        const { ten_danh_muc, trang_thai } = req.body;
        if (!ten_danh_muc) {
            return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
        }

        const newData = {
            ten_danh_muc,
            trang_thai: trang_thai ?? true // Mặc định là true nếu không gửi
        };

        const result = await productCategoryService.createCategory(newData);
        res.status(201).json({ message: "Tạo danh mục thành công", data: result });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Tạo danh mục thất bại" });
    }
};

/**
 * 🎮 Controller để cập nhật danh mục
 */
export const handleUpdateCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { ten_danh_muc, trang_thai } = req.body;

        if (!ten_danh_muc || trang_thai === undefined) {
            return res.status(400).json({ message: 'Tên danh mục và trạng thái là bắt buộc' });
        }

        const updatedData = { ten_danh_muc, trang_thai };
        const result = await productCategoryService.updateCategory(id, updatedData);
        res.status(200).json({ message: "Cập nhật danh mục thành công", data: result });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Cập nhật danh mục thất bại" });
    }
};

/**
 * 🎮 Controller để xóa danh mục
 */
export const handleDeleteCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await productCategoryService.deleteCategory(id);
        res.status(200).json({ message: "Xóa danh mục thành công" });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Xóa danh mục thất bại" });
    }
};