import { Router } from 'express';
import { handleCreateMomoPayment, handleMomoIpnCallback } from '../controllers/payment.controller';

const router = Router();

// Client gọi API này để lấy URL thanh toán MoMo
router.post('/create', handleCreateMomoPayment);

// MoMo sẽ gọi API này (IPN) để thông báo kết quả giao dịch
router.post('/callback', handleMomoIpnCallback);

export default router;
