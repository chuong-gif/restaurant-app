// packages/server/src/routes/reservation.admin.routes.ts
import { Router } from 'express';
import {
    handleGetAdminReservations,
    handleGetAdminReservationById, // Thêm mới
    handleChangeDishes,
    handleUpdateStatus,
    handleSoftDeleteReservation, // Thêm mới
    handlePermanentlyDeleteReservation // Thêm mới
} from '../controllers/reservation.controller';
// Không cần authenticateToken ở đây vì nó được áp dụng ở routes/index.ts

const router = Router();

// GET /api/v1/admin/reservations -> Lấy danh sách (có lọc, phân trang)
router.get('/', handleGetAdminReservations);

// GET /api/v1/admin/reservations/:id -> Lấy chi tiết một đơn
router.get('/:id', handleGetAdminReservationById);

// POST /api/v1/admin/reservations/:id/change-dishes -> Thay đổi món ăn
// Sửa: Đưa ID vào URL params cho nhất quán
router.post('/:id/change-dishes', handleChangeDishes);

// PATCH /api/v1/admin/reservations/:id/status -> Cập nhật trạng thái
// Sửa: Đưa status vào body, dùng chung PATCH với update thường? Hoặc giữ nguyên route này
router.patch('/:id/status', handleUpdateStatus); // Giữ nguyên route cũ cho đơn giản

// DELETE /api/v1/admin/reservations/soft/:id -> Xóa mềm (Hủy đơn)
router.delete('/soft/:id', handleSoftDeleteReservation);

// DELETE /api/v1/admin/reservations/permanent/:id -> Xóa vĩnh viễn
router.delete('/permanent/:id', handlePermanentlyDeleteReservation);

// Có thể thêm route PATCH /:id nếu cần cập nhật thông tin khác ngoài status/món ăn

export default router;