// File: packages/server/src/routes/index.ts

import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

// --- Import TẤT CẢ các router con ---

// Router xác thực
import authRoutes from './auth.routes';
import adminAuthRoutes from './adminAuth.routes';

// Router cho các chức năng (đã tách biệt)
import productPublicRoutes from './product.routes';
import productAdminRoutes from './product.admin.routes';
import productCategoryAdminRoutes from './productCategory.routes';

// === 1. THÊM DÒNG IMPORT NÀY ===
import { handleGetPublicCategories } from '../controllers/productCategory.controller';
// ===================================

import mediaRoutes from './media.routes';
import myReservationRoutes from './myReservation.routes';

// Giả sử các file này tồn tại cho public (nếu không có, em có thể comment lại)
import blogPublicRoutes from './blog.routes';
import blogCategoryPublicRoutes from './blogCategory.routes';
import tablePublicRoutes from './table.routes';
import reservationPublicRoutes from './reservation.routes';

const router = Router();

/* ==========================================================
🌍 ===== PUBLIC ROUTES (AI CŨNG CÓ THỂ TRUY CẬP) =====
========================================================== */

// --- Route xác thực cho Khách hàng (client) ---
router.use('/auth', authRoutes);

// --- Route xác thực cho Admin (phải là public để có thể đăng nhập) ---
router.use('/admin/auth', adminAuthRoutes);

// --- Các route public lấy dữ liệu cho trang client ---
const publicRouter = Router();
publicRouter.use('/products', productPublicRoutes);

// === 2. THÊM DÒNG ROUTE NÀY VÀO ĐÂY ===
publicRouter.get('/product-categories', handleGetPublicCategories);
// =====================================

publicRouter.use('/blogs', blogPublicRoutes);
publicRouter.use('/blog-categories', blogCategoryPublicRoutes);
publicRouter.use('/tables', tablePublicRoutes);
publicRouter.use('/reservations', reservationPublicRoutes);
// ...gắn các route public khác vào đây...
router.use('/public', publicRouter);


/* ==========================================================
👤 ===== PRIVATE USER ROUTES (YÊU CẦU ĐĂNG NHẬP) =====
========================================================== */
const privateUserRouter = Router();
privateUserRouter.use(authenticateToken); // Bắt buộc xác thực
privateUserRouter.use('/my-reservations', myReservationRoutes);

router.use('/user', privateUserRouter);


/* ==========================================================
🔒 ===== ADMIN ROUTES (YÊU CẦU ĐĂNG NHẬP) =====
========================================================== */
const adminRouter = Router();
adminRouter.use(authenticateToken); // "Người gác cổng" Bắt buộc xác thực

// Gắn các router quản lý vào đây
adminRouter.use('/products', productAdminRoutes);
adminRouter.use('/product-categories', productCategoryAdminRoutes);
adminRouter.use('/media', mediaRoutes);

// ⚠️ Cảnh báo: Các route dưới đây đang dùng chung file với public.
// Em sẽ cần tạo các file route admin riêng cho chúng (vd: blog.admin.routes.ts)
// Thầy tạm thời vô hiệu hóa để tránh xung đột.
// adminRouter.use('/blogs', blogRoutes); 
// adminRouter.use('/reservations', reservationRoutes);
// ...

// Gắn adminRouter vào router chính với tiền tố /admin
router.use('/admin', adminRouter);

export default router;