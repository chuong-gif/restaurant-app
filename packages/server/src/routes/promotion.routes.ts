import { Router } from 'express';
import {
    handleGetPromotions,
    handleGetPromotionById,
    handleCreatePromotion,
    handleUpdatePromotion,
    handleDeletePromotion,
} from '../controllers/promotion.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// These routes are protected and require authentication
router.get('/', authenticateToken, handleGetPromotions);
router.get('/:id', authenticateToken, handleGetPromotionById);
router.post('/', authenticateToken, handleCreatePromotion);
router.put('/:id', authenticateToken, handleUpdatePromotion);
router.patch('/:id', authenticateToken, handleUpdatePromotion); // Both PUT and PATCH use the same handler
router.delete('/:id', authenticateToken, handleDeletePromotion);

export default router;
