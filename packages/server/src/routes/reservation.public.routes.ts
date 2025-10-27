// packages/server/src/routes/reservation.public.routes.ts
import { Router } from 'express';
import { handleCreateReservation } from '../controllers/reservation.controller';

const router = Router();

// Endpoint công khai để khách tạo đặt bàn mới
// POST /api/v1/public/reservations
router.post('/', handleCreateReservation);

export default router;