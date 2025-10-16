import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

// 🧩 ===== IMPORT TẤT CẢ CÁC ROUTER CON =====

// 🔐 --- Router xác thực ---
import authRoutes from './auth.routes';
import adminAuthRoutes from './adminAuth.routes';

// ⚙️ --- Router quản lý ---
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
import membershipRoutes from './membership.routes';
import paymentRoutes from './payment.routes';
import contactRoutes from './contact.routes';

// 🚀 Tạo đối tượng router gốc
const router = Router();

// 🌍 ===== PUBLIC ROUTES (Dành cho Client / Công khai) =====
// 👉 Các route này không yêu cầu token đăng nhập
router.use('/auth', authRoutes);                                            // 🔑 Đăng nhập, đăng ký của khách hàng
router.use('/public/products', productRoutes);                              // 🛒 Sản phẩm
router.use('/public/blogs', blogRoutes);                                    // 📰 Bài viết
router.use('/public/blog-categories', blogCategoryRoutes);                  // 🏷️ Danh mục blog
router.use('/public/blog-comments', blogCommentRoutes);                     // 💬 Bình luận blog
router.use('/public/tables', tableRoutes);                                  // 🍽️ Bàn ăn
router.use('/public/reservations', reservationRoutes);                      // 📅 Đặt bàn
router.use('/public/promotions', promotionRoutes);                          // 🎟️ Khuyến mãi
router.use('/public/membership', membershipRoutes);                         // 💳 Thành viên
router.use('/public/payment', paymentRoutes);                               // 💰 Thanh toán
router.use('/public/contact', contactRoutes);                               // 📩 Liên hệ

// 🔒 ===== PRIVATE ROUTES (Dành cho Admin / Nhân viên) =====
// 👉 Các route này được bảo vệ bởi middleware `authenticateToken`
const adminRouter = Router();

// 🧱 Middleware bảo vệ: kiểm tra token JWT trước khi vào các route bên trong
adminRouter.use(authenticateToken);

// ⚙️ --- Các nhóm route chỉ dành cho Admin ---
adminRouter.use('/products', productRoutes);                                // 🛠️ Quản lý sản phẩm (CRUD sản phẩm)
adminRouter.use('/blogs', blogRoutes);                                      // 📰 Quản lý bài viết/blog
adminRouter.use('/blog-categories', blogCategoryRoutes);                    // 🏷️ Quản lý danh mục blog
adminRouter.use('/blog-comments', blogCommentRoutes);                       // 💬 Quản lý bình luận blog
adminRouter.use('/promotions', promotionRoutes);                            // 🎟️ Quản lý khuyến mãi và mã giảm giá
adminRouter.use('/tables', tableRoutes);                                    // 🪑 Quản lý bàn ăn
adminRouter.use('/reservations', reservationRoutes);                        // 📅 Quản lý đặt bàn (đặt lịch, xác nhận, hủy)
adminRouter.use('/users', userRoutes);                                      // 👥 Quản lý người dùng (admin, khách hàng, nhân viên)
adminRouter.use('/permissions', permissionRoutes);                          // 🔐 Quản lý quyền truy cập (permissions)
adminRouter.use('/roles', roleRoutes);                                      // 🏷️ Quản lý vai trò (roles - gán quyền, xóa, cập nhật)

// 🔑 --- Router xác thực dành riêng cho Admin ---
router.use('/admin/auth', adminAuthRoutes);

// 🧭 Gắn nhóm router admin vào prefix /admin (tức là /admin/products, /admin/users, v.v.)
router.use('/admin', adminRouter);

// 📦 Xuất router chính để dùng trong app.ts
export default router;
