import { Router } from 'express';
import { handleGetAllPermissions } from '../controllers/permission.controller';

const router = Router();

// Endpoint để lấy tất cả quyền hạn, thường dùng khi phân quyền cho vai trò
router.get('/', handleGetAllPermissions);

export default router;
