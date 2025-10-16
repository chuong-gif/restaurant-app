import { Router } from 'express';
import { handleGetAllTiers, handleGetUserMembership } from '../controllers/membership.controller';

const router = Router();

// Lấy tất cả các hạng thành viên (ví dụ: Đồng, Bạc, Vàng)
router.get('/tiers', handleGetAllTiers);

// Lấy thông tin thành viên của một người dùng cụ thể
router.get('/:userId', handleGetUserMembership);

export default router;
