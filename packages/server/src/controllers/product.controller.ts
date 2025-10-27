// packages/server/src/controllers/product.controller.ts
import { Request, Response } from 'express';
import * as productService from '../services/product.service';

// ====================== LẤY DANH SÁCH SẢN PHẨM (ĐÃ SỬA) ======================
export const handleGetProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const searchName = (req.query.searchName as string) || '';
        const categoryId = req.query.danh_muc_id ? parseInt(req.query.danh_muc_id as string) : undefined;
        const statusQuery = req.query.trang_thai as string;
        const trang_thai = statusQuery === 'true' ? true : (statusQuery === 'false' ? false : undefined);

        const result = await productService.getProducts(searchName, page, pageSize, categoryId, trang_thai);

        res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", ...result });
    } catch (error: any) {
        res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm", error: error.message });
    }
};

// ====================== LẤY SẢN PHẨM THEO ID (SỬA LỖI 3) ======================
export const handleGetProductById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const product = await productService.getProductById(id);
        res.status(200).json({ message: "Lấy sản phẩm thành công", data: product });
    } catch (error: any) {
        if (error.message === 'Sản phẩm không tồn tại') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    }
};

// ====================== LẤY SẢN PHẨM ĐANG HOẠT ĐỘNG (CHO CLIENT) ======================
export const handleGetActiveProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;
        const searchName = (req.query.searchName as string) || '';
        const result = await productService.getProducts(searchName, page, pageSize, undefined, true);
        res.status(200).json({ message: "Lấy danh sách sản phẩm đang hoạt động thành công", ...result });
    } catch (error: any) {
        res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm", error: error.message });
    }
};

// ====================== LẤY SẢN PHẨM MỚI NHẤT ======================
export const handleGetNewestProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getNewestProducts();
        res.status(200).json({ message: "Lấy sản phẩm mới nhất thành công", data: products });
    } catch (error: any) {
        res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm", error: error.message });
    }
};

// ====================== TẠO MỚI SẢN PHẨM ======================
export const handleCreateProduct = async (req: Request, res: Response) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json({ message: "Tạo sản phẩm thành công", data: newProduct });
    } catch (error: any) {
        res.status(400).json({ message: "Tạo sản phẩm thất bại", error: error.message });
    }
};

// ====================== CẬP NHẬT SẢN PHẨM ======================
export const handleUpdateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedProduct = await productService.updateProduct(parseInt(id), req.body);
        res.status(200).json({ message: "Cập nhật sản phẩm thành công", data: updatedProduct });
    } catch (error: any) {
        res.status(400).json({ message: "Cập nhật sản phẩm thất bại", error: error.message });
    }
};

// ====================== XÓA (MỀM) SẢN PHẨM ======================
export const handleDeleteProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const deleted = await productService.deleteProduct(id);
        res.status(200).json({ message: 'Xóa sản phẩm (ngưng hoạt động) thành công', data: deleted });
    } catch (error: any) {
        res.status(400).json({ message: 'Xóa sản phẩm thất bại', error: error.message });
    }
};

// ====================== XÓA VĨNH VIỄN SẢN PHẨM (SỬA LỖI 2) ======================
export const handlePermanentlyDeleteProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await productService.permanentlyDeleteProduct(id);
        res.status(200).json({ message: 'Xóa vĩnh viễn sản phẩm thành công' });
    } catch (error: any) {
        res.status(400).json({ message: 'Xóa vĩnh viễn thất bại', error: error.message });
    }
};