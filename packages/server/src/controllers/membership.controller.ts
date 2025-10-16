import { Request, Response } from 'express';
// Import các hàm xử lý logic về thành viên (membership) từ tầng service
import * as membershipService from '../services/membership.service';

// Controller: Lấy danh sách tất cả các hạng thành viên (tiers)
export const handleGetAllTiers = async (req: Request, res: Response) => {
    try {
        // Gọi service để lấy toàn bộ danh sách hạng thành viên (ví dụ: Bronze, Silver, Gold,...)
        const tiers = await membershipService.getAllTiers();

        // Trả về phản hồi thành công cùng dữ liệu tiers
        res.status(200).json({ message: 'Lấy danh sách hạng thành viên thành công', data: tiers });
    } catch (error: any) {
        // Nếu có lỗi trong quá trình xử lý, trả mã lỗi 500 (Internal Server Error)
        res.status(500).json({ message: error.message });
    }
};

// Controller: Lấy thông tin hạng thành viên của một người dùng cụ thể
export const handleGetUserMembership = async (req: Request, res: Response) => {
    try {
        // Lấy userId từ URL params (ví dụ: /membership/:userId)
        const userId = parseInt(req.params.userId);

        // Gọi service để lấy thông tin hạng thành viên của user tương ứng
        const membershipInfo = await membershipService.getUserMembership(userId);

        // Trả về thông tin thành viên nếu tìm thấy
        res.status(200).json({ message: 'Lấy thông tin thành viên thành công', data: membershipInfo });
    } catch (error: any) {
        // Nếu không tìm thấy user hoặc có lỗi khác, trả về mã lỗi 404 (Not Found)
        res.status(404).json({ message: error.message });
    }
};
