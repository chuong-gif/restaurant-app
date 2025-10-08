import { Router } from 'express';
import {
    handleCreateReservation,
    handleGetAdminReservations,
    handleChangeDishes,
    handleUpdateStatus,
} from '../controllers/reservation.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// ===== Public Route (For Client) =====
router.post('/', handleCreateReservation);

// ===== Admin Routes (Protected) =====
router.get('/admin', authenticateToken, handleGetAdminReservations);
router.post('/admin/change-dishes', authenticateToken, handleChangeDishes);
router.patch('/admin/status/:id', authenticateToken, handleUpdateStatus);

// Thêm các route khác cho admin (get by id, delete, etc.) nếu cần

export default router;
