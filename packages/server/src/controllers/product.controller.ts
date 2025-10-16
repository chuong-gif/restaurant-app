// packages/server/src/controllers/product.controller.ts
import { Request, Response } from 'express';
// Import các hàm xử lý logic sản phẩm từ tầng service
import * as productService from '../services/product.service';

// ====================== LẤY TẤT CẢ SẢN PHẨM (kể cả ngưng hoạt động) ======================
export const handleGetProducts = async (req: Request, res: Response) => {
    try {
        // Lấy các tham số phân trang và tìm kiếm từ query string
        const page = parseInt(req.query.page as string) || 1;         // Trang hiện tại
        const pageSize = parseInt(req.query.pageSize as string) || 10; // Số sản phẩm mỗi trang
        const searchName = (req.query.searchName as string) || '';     // Từ khóa tìm kiếm tên sản phẩm

        // Gọi service để truy xuất sản phẩm (bao gồm cả ngưng hoạt động)
        const result = await productService.getProducts(searchName, page, pageSize);

        // Trả kết quả thành công về client
        res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", ...result });
    } catch (error) {
        // Nếu có lỗi hệ thống thì trả về mã 500
        res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm", error });
    }
};

// ====================== LẤY SẢN PHẨM ĐANG HOẠT ĐỘNG ======================
export const handleGetActiveProducts = async (req: Request, res: Response) => {
    try {
        // Lấy tham số phân trang & tìm kiếm
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;
        const searchName = (req.query.searchName as string) || '';

        // Gọi service với tham số status = 1 (chỉ lấy sản phẩm đang hoạt động)
        const result = await productService.getProducts(searchName, page, pageSize, 1);

        // Trả dữ liệu thành công về cho client
        res.status(200).json({ message: "Lấy danh sách sản phẩm đang hoạt động thành công", ...result });
    } catch (error) {
        // Xử lý lỗi máy chủ
        res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm", error });
    }
};

// ====================== LẤY SẢN PHẨM MỚI NHẤT ======================
export const handleGetNewestProducts = async (req: Request, res: Response) => {
    try {
        // Gọi service để lấy danh sách sản phẩm mới nhất
        const products = await productService.getNewestProducts();

        // Trả dữ liệu về client
        res.status(200).json({ message: "Lấy sản phẩm mới nhất thành công", data: products });
    } catch (error) {
        // Bắt và trả lỗi nếu có sự cố trong quá trình xử lý
        res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm", error });
    }
};
