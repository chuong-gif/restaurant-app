import { Router } from 'express';
import { handleAdminLoginController } from '../controllers/auth.controller';
// Trong tương lai, bạn có thể thêm các controller khác như handleAdminForgotPassword, etc.

const router = Router();

/**
 * @route   POST /admin/auth/login
 * @desc    Đăng nhập cho Nhân viên / Admin
 * @access  Public
 */
router.post('/login', handleAdminLoginController);

// Ví dụ cho các route trong tương lai:
// router.post('/forgot-password', handleAdminForgotPasswordController);
// router.post('/reset-password', handleAdminResetPasswordController);

export default router;
