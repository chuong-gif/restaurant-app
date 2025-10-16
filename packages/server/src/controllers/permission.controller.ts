import { Request, Response } from 'express';
// Import các hàm xử lý logic quyền hạn từ tầng service
import * as permissionService from '../services/permission.service';

/**
 * Controller: Lấy danh sách tất cả các quyền hạn trong hệ thống
 */
export const handleGetAllPermissions = async (req: Request, res: Response) => {
    try {
        // Gọi service để truy xuất toàn bộ quyền hạn từ cơ sở dữ liệu
        const permissions = await permissionService.getAllPermissions();

        // Trả về danh sách quyền hạn cùng thông báo thành công
        res.status(200).json({ message: 'Lấy danh sách quyền hạn thành công', data: permissions });
    } catch (error: any) {
        // Bắt lỗi và phản hồi mã lỗi 500 nếu có sự cố trong quá trình xử lý
        res.status(500).json({ message: error.message });
    }
};
