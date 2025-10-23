// File: packages/server/src/routes/productCategory.routes.ts
import { Router } from 'express';
import { handleGetAllCategories } from '../controllers/productCategory.controller';

const router = Router();

// Định nghĩa route GET '/' để lấy tất cả danh mục
router.get('/', handleGetAllCategories);

export default router;