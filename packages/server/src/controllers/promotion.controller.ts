import { Request, Response } from 'express';
import * as promotionService from '../services/promotion.service';

// ====================== LẤY DANH SÁCH KHUYẾN MÃI (PHÂN TRANG + TÌM KIẾM) ======================
export const handleGetPromotions = async (req: Request, res: Response) => {
    try {
        // Lấy các tham số tìm kiếm và phân trang từ query string
        const search = (req.query.search as string) || '';       // Từ khóa tìm kiếm (tên mã khuyến mãi)
        const page = parseInt(req.query.page as string) || 1;    // Trang hiện tại
        const pageSize = parseInt(req.query.limit as string) || 10; // Số lượng bản ghi mỗi trang

        // Gọi service để lấy dữ liệu khuyến mãi theo điều kiện
        const result = await promotionService.getPromotions(search, page, pageSize);

        // Trả kết quả về client
        res.status(200).json({ message: 'Lấy danh sách khuyến mãi thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ====================== LẤY CHI TIẾT KHUYẾN MÃI THEO ID ======================
export const handleGetPromotionById = async (req: Request, res: Response) => {
    try {
        // Lấy ID từ params (ví dụ: /promotions/5)
        const id = parseInt(req.params.id);

        // Gọi service để lấy thông tin khuyến mãi tương ứng
        const promotion = await promotionService.getPromotionById(id);

        // Trả dữ liệu thành công về client
        res.status(200).json({ message: 'Lấy thông tin khuyến mãi thành công', data: promotion });
    } catch (error: any) {
        // Nếu không tìm thấy, trả mã 404
        res.status(404).json({ message: error.message });
    }
};

// ====================== TẠO MỚI KHUYẾN MÃI ======================
export const handleCreatePromotion = async (req: Request, res: Response) => {
    try {
        // Lấy dữ liệu từ body của request
        const { code_name, discount, quantity, valid_from, valid_to, type } = req.body;

        // Gọi service để tạo mới khuyến mãi (chuyển đổi định dạng ngày và kiểu boolean)
        const newPromotion = await promotionService.createPromotion({
            code_name,
            discount,
            quantity,
            valid_from: new Date(valid_from), // Ép kiểu sang Date
            valid_to: new Date(valid_to),     // Ép kiểu sang Date
            type: type === 1                  // Nếu type = 1 → true (ví dụ: mã giảm % hay cố định)
        });

        // Trả về phản hồi thành công
        res.status(201).json({ message: 'Tạo khuyến mãi thành công', data: newPromotion });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ====================== CẬP NHẬT KHUYẾN MÃI ======================
export const handleUpdatePromotion = async (req: Request, res: Response) => {
    try {
        // Lấy ID khuyến mãi cần cập nhật
        const id = parseInt(req.params.id);

        // Gọi service để cập nhật khuyến mãi theo ID
        const updatedPromotion = await promotionService.updatePromotion(id, req.body);

        res.status(200).json({ message: 'Cập nhật khuyến mãi thành công', data: updatedPromotion });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ====================== XÓA KHUYẾN MÃI ======================
export const handleDeletePromotion = async (req: Request, res: Response) => {
    try {
        // Lấy ID từ params
        const id = parseInt(req.params.id);

        // Gọi service để xóa khuyến mãi
        await promotionService.deletePromotion(id);

        res.status(200).json({ message: 'Xóa khuyến mãi thành công' });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};
