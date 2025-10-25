// packages/server/src/routes/productCategory.admin.routes.ts
import { Router } from 'express';
import {
    handleGetAdminCategories, // Đổi tên hàm
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory
} from '../controllers/productCategory.controller';

const router = Router();

// Endpoint được sửa: GET /api/v1/admin/product-categories (Hỗ trợ lọc)
router.get('/', handleGetAdminCategories);

// Endpoint mới: POST /api/v1/admin/product-categories
router.post('/', handleCreateCategory);

// Endpoint mới: PUT /api/v1/admin/product-categories/:id
router.put('/:id', handleUpdateCategory);

// Endpoint mới: DELETE /api/v1/admin/product-categories/:id
router.delete('/:id', handleDeleteCategory);

export default router;