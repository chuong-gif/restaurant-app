// packages/server/src/controllers/product.controller.ts
import { Request, Response } from 'express';
import * as productService from '../services/product.service';

// Handler cho việc lấy tất cả sản phẩm (cả hoạt động và ngưng)
export const handleGetProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const searchName = (req.query.searchName as string) || '';

        const result = await productService.getProducts(searchName, page, pageSize);
        res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", ...result });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm", error });
    }
};

// Handler cho việc lấy sản phẩm đang hoạt động
export const handleGetActiveProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;
        const searchName = (req.query.searchName as string) || '';

        const result = await productService.getProducts(searchName, page, pageSize, 1); // status = 1
        res.status(200).json({ message: "Lấy danh sách sản phẩm đang hoạt động thành công", ...result });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm", error });
    }
};

// Handler cho việc lấy sản phẩm mới nhất
export const handleGetNewestProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getNewestProducts();
        res.status(200).json({ message: "Lấy sản phẩm mới nhất thành công", data: products });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm", error });
    }
}