// packages/server/src/routes/auth.routes.ts
import { Router } from 'express';
import { handleSocialLoginController, handleRegisterController } from '../controllers/auth.controller';

const router = Router();

// Gộp cả Google và Facebook vào một route chung
router.post('/social-login', handleSocialLoginController);
router.post('/register', handleRegisterController);
// Thêm route cho login thường, forgot-password ở đây

export default router;