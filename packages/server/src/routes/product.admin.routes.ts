// packages/server/src/routes/product.admin.routes.ts
import { Router } from 'express';
import {
    handleGetProducts,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleGetProductById, // <-- THÊM IMPORT
    handlePermanentlyDeleteProduct // <-- THÊM IMPORT
} from '../controllers/product.controller';

const router = Router();

// GET /api/v1/admin/products -> Lấy tất cả sản phẩm
router.get('/', handleGetProducts);

// GET /api/v1/admin/products/:id -> Lấy 1 sản phẩm (SỬA LỖI 3)
router.get('/:id', handleGetProductById); // <-- THÊM ROUTE NÀY

// POST /api/v1/admin/products -> Tạo mới một sản phẩm
router.post('/', handleCreateProduct);

// PUT /api/v1/admin/products/:id -> Cập nhật một sản phẩm
router.put('/:id', handleUpdateProduct);

// DELETE /api/v1/admin/products/:id -> Xóa mềm một sản phẩm
router.delete('/:id', handleDeleteProduct);

// DELETE /api/v1/admin/products/permanent/:id -> Xóa vĩnh viễn (SỬA LỖI 2)
router.delete('/permanent/:id', handlePermanentlyDeleteProduct); // <-- THÊM ROUTE NÀY

export default router;