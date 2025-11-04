// File: packages/server/src/routes/product.routes.ts

import { Router } from 'express';
import {
    handleGetActiveProducts,
    handleGetNewestProducts,
    handleGetProductById
    // Sau này có thể thêm handleGetProductBySlug ở đây
} from '../controllers/product.controller';

const router = Router();

// GET /api/v1/public/products -> Lấy sản phẩm (có lọc)
router.get('/', handleGetActiveProducts);

// GET /api/v1/public/products/active -> Lấy sản phẩm đang hoạt động
router.get('/active', handleGetActiveProducts);

// GET /api/v1/public/products/newest -> Lấy sản phẩm mới nhất
router.get('/newest', handleGetNewestProducts);

router.get('/:id', handleGetProductById);
// Các route public khác (lấy chi tiết sản phẩm...) sẽ nằm ở đây

export default router;