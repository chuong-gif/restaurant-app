// packages/server/src/routes/reservation.admin.routes.ts
import { Router } from 'express';
import {
    handleGetAdminReservations,
    handleGetAdminReservationById,
    handleChangeDishes,
    handleUpdateStatus,
    handleSoftDeleteReservation,
    handlePermanentlyDeleteReservation,
    handleAdminCreateReservation // <-- THÊM IMPORT
} from '../controllers/reservation.controller';

const router = Router();

// === THÊM ROUTE MỚI CHO ADMIN TẠO ===
// POST /api/v1/admin/reservations -> Tạo mới đặt bàn (do Admin)
router.post('/', handleAdminCreateReservation);
// =================================

// GET /api/v1/admin/reservations -> Lấy danh sách
router.get('/', handleGetAdminReservations);

// GET /api/v1/admin/reservations/:id -> Lấy chi tiết
router.get('/:id', handleGetAdminReservationById);

// POST /api/v1/admin/reservations/:id/change-dishes -> Thay đổi món ăn
router.post('/:id/change-dishes', handleChangeDishes);

// PATCH /api/v1/admin/reservations/:id/status -> Cập nhật trạng thái
router.patch('/:id/status', handleUpdateStatus);

// DELETE /api/v1/admin/reservations/soft/:id -> Xóa mềm (Hủy đơn)
router.delete('/soft/:id', handleSoftDeleteReservation);

// DELETE /api/v1/admin/reservations/permanent/:id -> Xóa vĩnh viễn
router.delete('/permanent/:id', handlePermanentlyDeleteReservation);

export default router;