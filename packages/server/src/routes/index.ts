// packages/server/src/routes/index.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

// Import các router con
import productRoutes from './product.routes';
// import authRoutes from './auth.routes';
// import userRoutes from './user.routes';
// ... import tất cả các router khác

const router = Router();

// ================== PRIVATE ROUTES (Cần xác thực) ==================
// Tất cả các route trong block này sẽ được bảo vệ bởi authenticateToken
router.use('/admin/products', authenticateToken, productRoutes);
// router.use('/admin/users', authenticateToken, userRoutes);
// ... các route private khác cho admin

// ================== PUBLIC ROUTES (Công khai) ==================
// Các route này không cần token
router.use('/public/products', productRoutes); // Client có thể dùng chung router, nhưng controller có thể khác
// router.use('/public/blogs', blogRoutes);
// ...

// ================== AUTH ROUTES ==================
// router.use('/auth', authRoutes);


export default router;