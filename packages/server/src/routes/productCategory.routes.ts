// File: packages/server/src/routes/productCategory.routes.ts
import { Router } from 'express';
import { handleGetAllProductCategories } from '../controllers/productCategory.controller';

const router = Router();

// Định nghĩa route GET '/' để lấy tất cả danh mục
router.get('/', handleGetAllProductCategories);

export default router;