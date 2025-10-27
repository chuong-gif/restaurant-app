// packages/server/src/routes/user.routes.ts
import { Router } from 'express';
import {
    handleGetUsers,
    handleGetUserById,
    handleCreateUser,
    handleUpdateUser, // Dùng cho cả Cập nhật và Khôi phục
    handleSoftDeleteUser, // Hàm mới cho Xóa mềm
    handlePermanentlyDeleteUser, // Hàm mới cho Xóa vĩnh viễn
    handleCheckPassword,
} from '../controllers/user.controller';

const router = Router();

// GET /admin/users -> Lấy danh sách (có lọc)
router.get('/', handleGetUsers);

// GET /admin/users/:id -> Lấy chi tiết
router.get('/:id', handleGetUserById);

// POST /admin/users -> Tạo mới
router.post('/', handleCreateUser);

// PATCH /admin/users/:id -> Cập nhật thông tin HOẶC Khôi phục (update trang_thai = true)
router.patch('/:id', handleUpdateUser);

// DELETE /admin/users/soft/:id -> Xóa mềm (update trang_thai = false)
router.delete('/soft/:id', handleSoftDeleteUser); // <-- ROUTE MỚI CHO XÓA MỀM

// DELETE /admin/users/permanent/:id -> Xóa vĩnh viễn
router.delete('/permanent/:id', handlePermanentlyDeleteUser); // <-- ROUTE MỚI CHO XÓA CỨNG

// POST /admin/users/check-password -> Kiểm tra mật khẩu
router.post('/check-password', handleCheckPassword);

export default router;