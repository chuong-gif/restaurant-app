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
import userAdminRoutes from './user.routes'; // Đổi tên cho rõ ràng
import roleAdminRoutes from './role.routes'; // Đổi tên cho rõ ràng

// === SỬA IMPORT RESERVATION ===
import reservationPublicRoutes from './reservation.public.routes'; // File mới
import reservationAdminRoutes from './reservation.admin.routes';   // File mới
// =============================
import permissionAdminRoutes from './permission.routes'; // Router cho quản lý quyền

import blogPublicRoutes from './blog.routes'; // Giả sử tồn tại
import blogCategoryPublicRoutes from './blogCategory.routes'; // Giả sử tồn tại
import tableRoutes from './table.routes';


const router = Router();

/* ==========================================================
🌍 ===== PUBLIC ROUTES =====
========================================================== */
router.use('/auth', authRoutes);
router.use('/admin/auth', adminAuthRoutes); // Đăng nhập admin

const publicRouter = Router();
publicRouter.use('/products', productPublicRoutes);
publicRouter.get('/product-categories', handleGetPublicCategories);
publicRouter.use('/blogs', blogPublicRoutes);
publicRouter.use('/blog-categories', blogCategoryPublicRoutes);
publicRouter.use('/reservations', reservationPublicRoutes); // <-- Sử dụng file public mới
router.use('/public', publicRouter);

/* ==========================================================
👤 ===== PRIVATE USER ROUTES =====
========================================================== */
const privateUserRouter = Router();
privateUserRouter.use(authenticateToken);
privateUserRouter.use('/my-reservations', myReservationRoutes); // Route lấy lịch sử đặt bàn của user
// Thêm route lấy chi tiết đặt bàn của user (nếu cần)
// privateUserRouter.get('/reservations/:id', handleGetMyBookingDetail); // Cần import controller
router.use('/user', privateUserRouter);

/* ==========================================================
🔒 ===== ADMIN ROUTES =====
========================================================== */
const adminRouter = Router();
adminRouter.use(authenticateToken); // Middleware xác thực cho tất cả admin routes

// Gắn các router quản lý
adminRouter.use('/products', productAdminRoutes);
adminRouter.use('/product-categories', productCategoryAdminRoutes);
adminRouter.use('/media', mediaRoutes);
adminRouter.use('/users', userAdminRoutes);
adminRouter.use('/roles', roleAdminRoutes);
adminRouter.use('/reservations', reservationAdminRoutes); // <-- Sử dụng file admin mới
adminRouter.use('/permissions', permissionAdminRoutes);
// Gắn adminRouter vào router chính
router.use('/admin', adminRouter);
router.use(tableRoutes);

export default router;