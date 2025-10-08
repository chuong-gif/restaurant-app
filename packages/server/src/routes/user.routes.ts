import { Router } from 'express';
import {
    handleGetUsers,
    handleGetUserById,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleCheckPassword,
} from '../controllers/user.controller';

const router = Router();

// Các route này có thể áp dụng cho cả việc quản lý Nhân viên và Khách hàng
// Middleware xác thực sẽ quyết định ai có quyền truy cập
router.get('/', handleGetUsers);
router.get('/:id', handleGetUserById);
router.post('/', handleCreateUser);
router.patch('/:id', handleUpdateUser);
router.delete('/:id', handleDeleteUser);
router.post('/check-password', handleCheckPassword);

export default router;
