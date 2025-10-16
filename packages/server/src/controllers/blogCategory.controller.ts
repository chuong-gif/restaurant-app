import { Request, Response } from 'express';
// Import các hàm xử lý logic của danh mục bài viết (category)
import * as blogCategoryService from '../services/blogCategory.service';
// Import Prisma để bắt các lỗi cụ thể của Prisma (ORM)
import { Prisma } from '@prisma/client';

// Controller: Lấy danh sách danh mục bài viết (có tìm kiếm, lọc trạng thái và phân trang)
export const handleGetCategories = async (req: Request, res: Response) => {
    try {
        // Lấy từ khóa tìm kiếm tên danh mục (nếu có)
        const search = (req.query.search as string) || '';
        // Lọc theo trạng thái hoạt động (nếu có). "1" => true, "0" => false
        const status = req.query.searchStatus ? req.query.searchStatus === '1' : undefined;
        // Lấy số trang (mặc định là 1)
        const page = parseInt(req.query.page as string) || 1;
        // Lấy số lượng danh mục mỗi trang (mặc định 10)
        const pageSize = parseInt(req.query.limit as string) || 10;

        // Gọi service để lấy danh sách danh mục với các tham số trên
        const result = await blogCategoryService.getCategories(search, status, page, pageSize);

        // Trả về kết quả JSON gồm message và dữ liệu trả về từ service
        res.status(200).json({ message: 'Lấy danh sách danh mục thành công', ...result });
    } catch (error: any) {
        // Nếu có lỗi trong quá trình xử lý, trả về mã lỗi 500
        res.status(500).json({ message: error.message });
    }
};

// Controller: Tạo mới một danh mục bài viết
export const handleCreateCategory = async (req: Request, res: Response) => {
    try {
        // Lấy dữ liệu name và status từ body
        const { name, status } = req.body;

        // Kiểm tra bắt buộc: phải có name và status
        if (!name || status === undefined) {
            return res.status(400).json({ message: 'Tên và trạng thái là bắt buộc.' });
        }

        // Gọi service để tạo danh mục mới
        const newCategory = await blogCategoryService.createCategory(name, status);

        // Trả về mã 201 (Created) và dữ liệu danh mục vừa tạo
        res.status(201).json({ message: 'Tạo danh mục thành công', data: newCategory });
    } catch (error: any) {
        // Bắt lỗi trùng tên danh mục (mã lỗi P2002 từ Prisma)
        if (error instanceof Error && (error as any).code === 'P2002') {
            return res.status(409).json({ message: 'Tên danh mục đã tồn tại.' });
        }
        // Lỗi khác -> trả về mã 500
        res.status(500).json({ message: error.message });
    }
};

// Controller: Cập nhật danh mục theo ID
export const handleUpdateCategory = async (req: Request, res: Response) => {
    try {
        // Lấy id danh mục từ params (URL: /categories/:id)
        const id = parseInt(req.params.id);
        // Lấy dữ liệu mới từ body
        const { name, status } = req.body;

        // Gọi service để cập nhật danh mục
        const updatedCategory = await blogCategoryService.updateCategory(id, { name, status });

        // Trả về dữ liệu danh mục sau khi cập nhật
        res.status(200).json({ message: 'Cập nhật danh mục thành công', data: updatedCategory });
    } catch (error: any) {
        // Nếu tên bị trùng -> báo lỗi 409
        if (error instanceof Error && (error as any).code === 'P2002') {
            return res.status(409).json({ message: 'Tên danh mục đã tồn tại.' });
        }
        // Các lỗi khác -> báo lỗi 500
        res.status(500).json({ message: error.message });
    }
};

// Controller: Xóa danh mục theo ID
export const handleDeleteCategory = async (req: Request, res: Response) => {
    try {
        // Lấy id danh mục từ params
        const id = parseInt(req.params.id);
        // Gọi service để xóa danh mục
        await blogCategoryService.deleteCategory(id);
        // Trả về phản hồi khi xóa thành công
        res.status(200).json({ message: 'Xóa danh mục thành công.' });
    } catch (error: any) {
        // Nếu có lỗi (vd: danh mục không tồn tại, đang được sử dụng, v.v.) -> báo lỗi 400
        res.status(400).json({ message: error.message });
    }
};
