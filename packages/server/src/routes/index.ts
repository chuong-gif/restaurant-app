// File: packages/server/src/routes/index.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

// --- Import Routers ---
import authRoutes from './auth.routes';
import adminAuthRoutes from './adminAuth.routes';
import productPublicRoutes from './product.routes';
import productAdminRoutes from './product.admin.routes';
import productCategoryAdminRoutes from './productCategory.routes';
import mediaRoutes from './media.routes';
import myReservationRoutes from './myReservation.routes';
import userAdminRoutes from './user.routes';
import roleAdminRoutes from './role.routes';
import reservationPublicRoutes from './reservation.public.routes';
import reservationAdminRoutes from './reservation.admin.routes';
import permissionAdminRoutes from './permission.routes';
import tableRoutes from './table.routes';
import blogRoutes from './blog.routes';
import blogCategoryRoutes from './blogCategory.routes';
import blogCommentRoutes from './blogComment.routes';
import promotionRoutes from './promotion.routes';
import statisticalRoutes from './statistical.routes';
import contactRoutes from './contact.routes';

// --- THÊM IMPORT CÁC CONTROLLER PUBLIC ---
import {
    handleGetPublicCategories as handleGetPublicProductCategories
} from '../controllers/productCategory.controller';
import {
    handleGetPublicBlogs,
    handleGetBlogBySlug
} from '../controllers/blog.controller';
import {
    handleGetPublicCategories as handleGetPublicBlogCategories
} from '../controllers/blogCategory.controller';
// ======================================
import promotionPublicRoutes from './promotion.public.routes';
const router = Router();
import inventoryRouter from './inventory.routes';


/* ==========================================================
🌍 ===== PUBLIC ROUTES =====
========================================================== */
router.use('/auth', authRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/inventory', inventoryRouter);

const publicRouter = Router();
publicRouter.use('/products', productPublicRoutes);
publicRouter.get('/product-categories', handleGetPublicProductCategories);
publicRouter.use('/reservations', reservationPublicRoutes);
publicRouter.use('/media', mediaRoutes);

// === SỬA LỖI Ở ĐÂY: Thêm các route public cho Blog ===
publicRouter.get('/blogs', handleGetPublicBlogs); // Lấy danh sách blog
publicRouter.get('/blog-categories', handleGetPublicBlogCategories); // Lấy danh mục blog
publicRouter.get('/blogs/slug/:slug', handleGetBlogBySlug); // Lấy chi tiết blog
publicRouter.use('/comments', blogCommentRoutes); // Gắn route bình luận (đã có public GET)
publicRouter.use('/contact', contactRoutes);
// ================================================
router.use('/public/promotions', promotionPublicRoutes);
router.use('/public', publicRouter);

/* ==========================================================
👤 ===== PRIVATE USER ROUTES =====
========================================================== */
const privateUserRouter = Router();
privateUserRouter.use(authenticateToken);
privateUserRouter.use('/my-reservations', myReservationRoutes);
privateUserRouter.get('/me', handleGetMyProfile);
privateUserRouter.patch('/me', handleUpdateMyProfile);
privateUserRouter.post('/change-password', handleChangeMyPassword);
// Gắn route quản lý bình luận CỦA TÔI
privateUserRouter.use('/comments', blogCommentRoutes);
router.use('/user', privateUserRouter);

/* ==========================================================
🔒 ===== ADMIN ROUTES =====
========================================================== */
const adminRouter = Router();
adminRouter.use(authenticateToken);

// Gắn các router quản lý
adminRouter.use('/products', productAdminRoutes);
adminRouter.use('/product-categories', productCategoryAdminRoutes);
// adminRouter.use('/media', mediaRoutes); // Đã chuyển lên public
adminRouter.use('/users', userAdminRoutes);
adminRouter.use('/roles', roleAdminRoutes);
adminRouter.use('/reservations', reservationAdminRoutes);
adminRouter.use('/permissions', permissionAdminRoutes);
adminRouter.use('/blogs', blogRoutes);
adminRouter.use('/blog-categories', blogCategoryRoutes);
adminRouter.use('/promotions', promotionRoutes);
adminRouter.use('/statistical', statisticalRoutes);
adminRouter.use('/blog-comments', blogCommentRoutes);
router.use('/admin', adminRouter);

// Gắn tableRoutes (đã tự xử lý /admin và /public bên trong)
router.use(tableRoutes);

// Hàm lấy profile (bị thiếu ở bước trước, bổ sung)
async function handleGetMyProfile(req: any, res: any) {
    const { handleGetMyProfile } = require('../controllers/user.controller');
    handleGetMyProfile(req, res);
}
async function handleUpdateMyProfile(req: any, res: any) {
    const { handleUpdateMyProfile } = require('../controllers/user.controller');
    handleUpdateMyProfile(req, res);
}
async function handleChangeMyPassword(req: any, res: any) {
    const { handleChangeMyPassword } = require('../controllers/user.controller');
    handleChangeMyPassword(req, res);
}

export default router;