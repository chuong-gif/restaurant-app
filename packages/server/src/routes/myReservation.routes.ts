// File: packages/server/src/routes/myReservation.routes.ts
import { Router } from 'express';
import {
    handleGetMyBookings,
    handleGetMyBookingDetail,
} from '../controllers/reservation.controller';

const router = Router();

// Lấy tất cả lịch sử đặt bàn của người dùng đang đăng nhập
router.get('/', handleGetMyBookings);

// Lấy chi tiết một đơn đặt bàn theo ID
router.get('/:id', handleGetMyBookingDetail);

// Có thể thêm route HỦY đơn ở đây sau
// router.patch('/cancel/:id', handleCancelBooking);

export default router;