import { Request, Response } from 'express';
import * as reservationService from '../services/reservation.service';

// ====================== TẠO MỚI ĐẶT BÀN ======================
export const handleCreateReservation = async (req: Request, res: Response) => {
    try {
        // Gọi service để tạo mới một bản ghi đặt bàn dựa trên dữ liệu từ body
        const newReservation = await reservationService.createReservation(req.body);

        // Trả về thông báo và dữ liệu đơn giản gồm id đặt bàn và id bàn ăn
        res.status(201).json({
            message: 'Đặt bàn thành công',
            data: { id: newReservation.id, table: { id: newReservation.ban_an_id } }
        });
    } catch (error: any) {
        // Nếu có lỗi (ví dụ dữ liệu không hợp lệ) → trả mã 400
        res.status(400).json({ message: error.message });
    }
};

// ====================== LẤY DANH SÁCH ĐẶT BÀN (CHO ADMIN) ======================
export const handleGetAdminReservations = async (req: Request, res: Response) => {
    try {
        // Lấy các tham số lọc từ query string để tìm kiếm và phân trang
        const filters = {
            page: parseInt(req.query.page as string) || 1,              // Trang hiện tại
            pageSize: parseInt(req.query.limit as string) || 10,        // Số lượng mỗi trang
            searchName: (req.query.searchName as string) || '',         // Tìm theo tên khách hàng
            searchPhone: (req.query.searchPhone as string) || '',       // Tìm theo số điện thoại
            status: req.query.status as string,                         // Lọc theo trạng thái
            reservation_code: (req.query.reservation_code as string) || '' // Lọc theo mã đặt bàn
        };

        // Gọi service để lấy danh sách đặt bàn theo các tiêu chí trên
        const result = await reservationService.getAdminReservations(filters);

        // Trả kết quả cho client
        res.status(200).json({ message: 'Lấy danh sách đặt bàn thành công', ...result });
    } catch (error: any) {
        // Nếu có lỗi trong quá trình xử lý hoặc truy vấn DB → trả mã 500
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ====================== THAY ĐỔI MÓN ĂN TRONG ĐẶT BÀN ======================
export const handleChangeDishes = async (req: Request, res: Response) => {
    try {
        // Lấy ID của đơn đặt bàn được chọn
        const reservation_id = parseInt(req.body.selecteReservation_id);

        // Lấy danh sách món ăn mới (đảm bảo là mảng)
        const dishes = Array.isArray(req.body.selectedChangedishes) ? req.body.selectedChangedishes : [];

        // Tính tổng tiền tạm thời từ dữ liệu món ăn (logic này hiện cần xem xét lại)
        const totalAmount = dishes.length > 0 ? dishes[0].total_amount : 0;

        // Gọi service để cập nhật danh sách món ăn trong đặt bàn
        await reservationService.changeDishes(reservation_id, dishes, totalAmount);

        res.status(200).json({ message: 'Thay đổi món ăn thành công.' });
    } catch (error: any) {
        // Bắt lỗi server
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ====================== CẬP NHẬT TRẠNG THÁI ĐẶT BÀN ======================
export const handleUpdateStatus = async (req: Request, res: Response) => {
    try {
        // Lấy id đặt bàn từ URL params
        const id = parseInt(req.params.id);
        const { status } = req.body;

        // Kiểm tra dữ liệu hợp lệ
        if (status === undefined) {
            return res.status(400).json({ message: 'Trạng thái là bắt buộc.' });
        }

        // Gọi service để cập nhật trạng thái đặt bàn (VD: chờ xác nhận, đã hoàn thành...)
        await reservationService.updateReservationStatus(id, parseInt(status));

        res.status(200).json({ message: 'Cập nhật trạng thái thành công.' });
    } catch (error: any) {
        // Nếu xảy ra lỗi → trả lỗi máy chủ
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};
