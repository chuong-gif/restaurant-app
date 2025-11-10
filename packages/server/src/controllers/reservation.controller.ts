// packages/server/src/controllers/reservation.controller.ts
import { Request, Response } from 'express';
import * as reservationService from '../services/reservation.service';
import { ReservationStatus } from '../services/reservation.service'; // Import enum

// ====================== TẠO MỚI ĐẶT BÀN (CLIENT) ======================
export const handleCreateReservation = async (req: Request, res: Response) => {
    try {
        // Hàm này gọi service N-N là ĐÚNG
        const newReservation = await reservationService.createReservation(req.body);
        res.status(201).json({
            message: 'Đặt bàn thành công',
            // Sửa: Không trả về tableId vì ban_an_id không còn tồn tại
            data: { id: newReservation.id }
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
// ====================== LẤY DANH SÁCH ĐẶT BÀN (CHO ADMIN) ======================
export const handleGetAdminReservations = async (req: Request, res: Response) => {
    try {
        const filters = {
            page: parseInt(req.query.page as string) || 1,
            pageSize: parseInt(req.query.limit as string) || 10,
            searchName: (req.query.searchName as string) || '',
            searchPhone: (req.query.searchPhone as string) || '',
            status: req.query.status as string, // Service sẽ xử lý parse Int
            reservation_code: (req.query.reservation_code as string) || ''
        };
        const result = await reservationService.getAdminReservations(filters);
        res.status(200).json({ message: 'Lấy danh sách đặt bàn thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// === THÊM MỚI HÀM NÀY ===
// ====================== LẤY CHI TIẾT ĐẶT BÀN (CHO ADMIN) ======================
export const handleGetAdminReservationById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const reservation = await reservationService.getAdminReservationById(id);
        res.status(200).json({ message: 'Lấy chi tiết đặt bàn thành công', data: reservation });
    } catch (error: any) {
        if (error.message === 'Không tìm thấy đơn đặt bàn.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
        }
    }
};
// =========================


// ====================== THAY ĐỔI MÓN ĂN (Sửa: Bỏ totalAmount) ======================
export const handleChangeDishes = async (req: Request, res: Response) => {
    try {
        // Sửa: Lấy id từ params thay vì body nếu route là /admin/reservations/:id/change-dishes
        const reservationId = parseInt(req.params.id); // Giả sử id nằm trong URL
        // Hoặc giữ nguyên nếu route là khác: const reservationId = parseInt(req.body.selecteReservation_id);

        const dishes = Array.isArray(req.body.selectedChangedishes) ? req.body.selectedChangedishes : [];

        // Bỏ totalAmount, service sẽ tự tính
        await reservationService.changeDishes(reservationId, dishes);

        res.status(200).json({ message: 'Thay đổi món ăn thành công.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ====================== CẬP NHẬT TRẠNG THÁI ĐẶT BÀN ======================
export const handleUpdateStatus = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const statusNum = parseInt(status); // Chuyển sang số

        if (isNaN(statusNum)) {
            return res.status(400).json({ message: 'Trạng thái phải là một số.' });
        }

        await reservationService.updateReservationStatus(id, statusNum);
        res.status(200).json({ message: 'Cập nhật trạng thái thành công.' });
    } catch (error: any) {
        if (error.message === 'Không tìm thấy đơn đặt bàn.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message }); // Lỗi khác (vd: trạng thái ko hợp lệ)
        }
    }
};

// === THÊM MỚI HÀM NÀY ===
// ====================== XÓA MỀM ĐẶT BÀN ======================
export const handleSoftDeleteReservation = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await reservationService.softDeleteReservation(id); // Gọi service xóa mềm
        res.status(200).json({ message: 'Hủy đặt bàn thành công.' });
    } catch (error: any) {
        if (error.message === 'Không tìm thấy đơn đặt bàn.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};
// =========================

// === THÊM MỚI HÀM NÀY ===
// ====================== XÓA VĨNH VIỄN ĐẶT BÀN ======================
export const handlePermanentlyDeleteReservation = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await reservationService.permanentlyDeleteReservation(id); // Gọi service xóa vĩnh viễn
        res.status(200).json({ message: 'Xóa vĩnh viễn đặt bàn thành công.' });
    } catch (error: any) {
        if (error.message === 'Không tìm thấy đơn đặt bàn.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};
// =========================


// ====================== LẤY LỊCH SỬ ĐẶT BÀN CỦA TÔI ======================
// (Giữ nguyên)
export const handleGetMyBookings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const bookings = await reservationService.getBookingsByUserId(userId);
        res.status(200).json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ====================== LẤY CHI TIẾT ĐẶT BÀN CỦA TÔI ======================
// (Giữ nguyên)
export const handleGetMyBookingDetail = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const reservationId = parseInt(req.params.id);
        const bookingDetail = await reservationService.getBookingDetailForUser(reservationId, userId);
        res.status(200).json(bookingDetail);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * 🎮 Admin tạo mới đặt bàn
 * (SỬA: Gọi đúng service N-N)
 */
export const handleAdminCreateReservation = async (req: Request, res: Response) => {
    try {
        // Sửa: Gọi hàm "createReservation" (hàm N-N)
        const newReservation = await reservationService.createReservation(req.body);
        res.status(201).json({
            message: 'Admin tạo đặt bàn thành công',
            // Sửa: Không trả về tableId vì ban_an_id không còn tồn tại
            data: { id: newReservation.id }
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Tạo đặt bàn thất bại.' });
    }
};
// =====================================