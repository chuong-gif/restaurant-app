import { Router } from 'express';
import { handleCheckPromotion } from '../controllers/promotion.controller';

const router = Router();

// Public route để kiểm tra mã khuyến mãi
router.post('/check', handleCheckPromotion);

export default router;