// File mới: packages/server/src/routes/product.admin.routes.ts

import { Router } from 'express';
import {
    handleGetProducts,
    handleCreateProduct,
    // Sau này em sẽ thêm handleUpdateProduct, handleDeleteProduct vào đây
} from '../controllers/product.controller';

const router = Router();

// GET /api/v1/admin/products -> Lấy tất cả sản phẩm
router.get('/', handleGetProducts);

// POST /api/v1/admin/products -> Tạo mới một sản phẩm
router.post('/', handleCreateProduct);

// Các route quản lý khác (update, delete...) sẽ nằm ở đây

export default router;