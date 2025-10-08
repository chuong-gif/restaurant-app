import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

// ===== IMPORT TẤT CẢ CÁC ROUTER CON =====
// --- Router xác thực ---
import authRoutes from './auth.routes';
import adminAuthRoutes from './adminAuth.routes';

// --- Router quản lý ---
import productRoutes from './product.routes';
import blogCategoryRoutes from './blogCategory.routes';
import blogRoutes from './blog.routes';
import blogCommentRoutes from './blogComment.routes';
import promotionRoutes from './promotion.routes';
import tableRoutes from './table.routes';
import reservationRoutes from './reservation.routes';
import userRoutes from './user.routes';
import permissionRoutes from './permission.routes';
import roleRoutes from './role.routes';

const router = Router();

// ===== PUBLIC ROUTES (Dành cho Client/Công khai) =====
// Các route này không cần token xác thực
router.use('/auth', authRoutes); // Đăng nhập, đăng ký của khách hàng
router.use('/public/products', productRoutes);
router.use('/public/blogs', blogRoutes);
router.use('/public/blog-categories', blogCategoryRoutes);
router.use('/public/blog-comments', blogCommentRoutes);
router.use('/public/tables', tableRoutes);
router.use('/public/reservations', reservationRoutes);
router.use('/public/promotions', promotionRoutes);


// ===== PRIVATE ROUTES (Dành cho Admin/Nhân viên) =====
// Tất cả các route trong nhóm này sẽ được bảo vệ bởi middleware `authenticateToken`
const adminRouter = Router();
adminRouter.use(authenticateToken); // Áp dụng middleware cho cả nhóm

adminRouter.use('/products', productRoutes);
adminRouter.use('/blogs', blogRoutes);
adminRouter.use('/blog-categories', blogCategoryRoutes);
adminRouter.use('/blog-comments', blogCommentRoutes);
adminRouter.use('/promotions', promotionRoutes);
adminRouter.use('/tables', tableRoutes);
adminRouter.use('/reservations', reservationRoutes);
adminRouter.use('/users', userRoutes);
adminRouter.use('/permissions', permissionRoutes);
adminRouter.use('/roles', roleRoutes);

// --- Router xác thực của admin ---
router.use('/admin/auth', adminAuthRoutes);

// Gắn nhóm router admin vào prefix /admin
router.use('/admin', adminRouter);


export default router;
