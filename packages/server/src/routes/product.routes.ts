// packages/server/src/routes/product.routes.ts
import { Router } from 'express';
import {
    handleGetProducts,
    handleGetActiveProducts,
    handleGetNewestProducts
} from '../controllers/product.controller';

const router = Router();

// Route cho admin, lấy tất cả sản phẩm
router.get('/', handleGetProducts);

// Các route khác cho client (public)
router.get('/active', handleGetActiveProducts); // Tương đương /hoat_dong
router.get('/newest', handleGetNewestProducts); // Tương đương /new

// Thêm các route cho POST, PUT, DELETE ở đây...

export default router;