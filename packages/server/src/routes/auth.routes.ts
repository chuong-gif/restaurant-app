// packages/server/src/routes/auth.routes.ts
import { Router } from 'express';
// Chỗ này em cần import thêm controller xử lý login nhé, ví dụ là handleLoginController
import {
    handleSocialLoginController,
    handleRegisterController,
    handleLoginController // 👈 THÊM DÒNG NÀY (sẽ tạo hàm này ở bước sau)
} from '../controllers/auth.controller';

const router = Router();

// Gộp cả Google và Facebook vào một route chung
router.post('/social-login', handleSocialLoginController);
router.post('/register', handleRegisterController);

// 👇 THÊM ROUTE LOGIN VÀO ĐÂY
router.post('/login', handleLoginController);

export default router;