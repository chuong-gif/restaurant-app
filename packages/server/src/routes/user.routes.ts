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
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

// *** LƯU Ý: Giả sử authenticateToken đã được áp dụng ở file index.ts ***

// GET /admin/users -> Lấy danh sách (có lọc)
router.get('/', authorize('view_user'), handleGetUsers);

// GET /admin/users/:id -> Lấy chi tiết
router.get('/:id', authorize('view_user'), handleGetUserById); // Hoặc 'edit_user'

// POST /admin/users -> Tạo mới
router.post('/', authorize('add_user'), handleCreateUser);

// PATCH /admin/users/:id -> Cập nhật
router.patch('/:id', authorize('edit_user'), handleUpdateUser);

// DELETE /admin/users/soft/:id -> Xóa mềm
router.delete('/soft/:id', authorize('soft_delete_user'), handleSoftDeleteUser);

// DELETE /admin/users/permanent/:id -> Xóa vĩnh viễn
router.delete('/permanent/:id', authorize('force_delete_user'), handlePermanentlyDeleteUser);
// POST /admin/users/check-password -> Kiểm tra mật khẩu
router.post('/check-password', authorize('force_delete_user'), handleCheckPassword);

export default router;