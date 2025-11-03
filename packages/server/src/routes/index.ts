// File: packages/server/src/routes/index.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

// --- Import Routers ---
import authRoutes from './auth.routes';
import adminAuthRoutes from './adminAuth.routes';
import productPublicRoutes from './product.routes';
import productAdminRoutes from './product.admin.routes';
import productCategoryAdminRoutes from './productCategory.routes';
import { handleGetPublicCategories } from '../controllers/productCategory.controller';
import mediaRoutes from './media.routes';
import myReservationRoutes from './myReservation.routes';
// === THÊM IMPORT HANDLER MỚI ===
import {
    handleGetMyProfile,
    handleUpdateMyProfile,
    handleChangeMyPassword
} from '../controllers/user.controller';
// ===============================
import userAdminRoutes from './user.routes';
import roleAdminRoutes from './role.routes';
import reservationPublicRoutes from './reservation.public.routes';
import reservationAdminRoutes from './reservation.admin.routes';
import permissionAdminRoutes from './permission.routes';
import tableRoutes from './table.routes';

// === THÊM IMPORT CHO BLOG VÀ PROMOTION ===
import blogRoutes from './blog.routes';
import blogCategoryRoutes from './blogCategory.routes';
import promotionRoutes from './promotion.routes';
// ======================================
import statisticalRoutes from './statistical.routes';


const router = Router();

/* ==========================================================
🌍 ===== PUBLIC ROUTES =====
========================================================== */
router.use('/auth', authRoutes);
router.use('/admin/auth', adminAuthRoutes);

const publicRouter = Router();
publicRouter.use('/products', productPublicRoutes);
publicRouter.get('/product-categories', handleGetPublicCategories);
// ‼‼ LƯU Ý: blogRoutes đang xử lý cả public và admin. Cần tách file sau.
publicRouter.use('/blogs', blogRoutes); // Tạm thời dùng chung
publicRouter.use('/blog-categories', blogCategoryRoutes); // Tạm thời dùng chung
publicRouter.use('/reservations', reservationPublicRoutes);
publicRouter.use('/media', mediaRoutes);
// publicRouter.use('/promotions', promotionRoutes); // Promotion thường là private/admin
router.use('/public', publicRouter);

/* ==========================================================
👤 ===== PRIVATE USER ROUTES =====
========================================================== */
const privateUserRouter = Router();
privateUserRouter.use(authenticateToken);
privateUserRouter.use('/my-reservations', myReservationRoutes);
// === THÊM CÁC ROUTE MỚI VÀO ĐÂY ===
privateUserRouter.get('/me', handleGetMyProfile);         // GET /api/v1/user/me
privateUserRouter.patch('/me', handleUpdateMyProfile);    // PATCH /api/v1/user/me
privateUserRouter.post('/change-password', handleChangeMyPassword); // POST /api/v1/user/change-password
// ==================================

router.use('/user', privateUserRouter);

/* ==========================================================
🔒 ===== ADMIN ROUTES =====
========================================================== */
const adminRouter = Router();
adminRouter.use(authenticateToken); // Middleware xác thực

// Gắn các router quản lý
adminRouter.use('/products', productAdminRoutes);
adminRouter.use('/product-categories', productCategoryAdminRoutes);

adminRouter.use('/users', userAdminRoutes);
adminRouter.use('/roles', roleAdminRoutes);
adminRouter.use('/reservations', reservationAdminRoutes);
adminRouter.use('/permissions', permissionAdminRoutes);

// === THÊM 3 DÒNG .use() NÀY VÀO ĐÂY ===
adminRouter.use('/blogs', blogRoutes); // Gắn route blog vào /admin/blogs
adminRouter.use('/blog-categories', blogCategoryRoutes); // Gắn route blog category vào /admin/blog-categories
adminRouter.use('/promotions', promotionRoutes); // Gắn route promotion vào /admin/promotions
// ======================================
adminRouter.use('/statistical', statisticalRoutes);
// Gắn adminRouter vào router chính
router.use('/admin', adminRouter);

// Gắn tableRoutes (đã tự xử lý /admin và /public bên trong)
router.use(tableRoutes);

export default router;