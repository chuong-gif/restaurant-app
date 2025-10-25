// File mới: packages/server/src/routes/product.admin.routes.ts

import { Router } from 'express';
import {
    handleGetProducts,
    handleCreateProduct,
    handleUpdateProduct,  // <-- THÊM DÒNG NÀY
    handleDeleteProduct,  // <-- THÊM DÒNG NÀY
    // Sau này em sẽ thêm handleUpdateProduct, handleDeleteProduct vào đây
} from '../controllers/product.controller';

const router = Router();

// GET /api/v1/admin/products -> Lấy tất cả sản phẩm
router.get('/', handleGetProducts);

// POST /api/v1/admin/products -> Tạo mới một sản phẩm
router.post('/', handleCreateProduct);

// PUT /api/v1/admin/products/:id -> Cập nhật một sản phẩm
router.put('/:id', handleUpdateProduct); // <-- THÊM DÒNG NÀY

// DELETE /api/v1/admin/products/:id -> Xóa mềm một sản phẩm
router.delete('/:id', handleDeleteProduct); // <-- THÊM DÒNG NÀY
// Các route quản lý khác (update, delete...) sẽ nằm ở đây

export default router;