import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware'; // Import interface từ file auth.middleware

/**
 * Tạo ra một middleware để kiểm tra xem người dùng có quyền thực hiện hành động không.
 * @param requiredPermission Mã quyền yêu cầu (ví dụ: 'force_delete_user')
 */
export const authorize = (requiredPermission: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        // Lấy thông tin user từ request (đã được gán bởi authenticateToken)
        const user = req.user;

        // Kiểm tra xem req.user và danh sách quyền có tồn tại không
        if (!user || typeof user !== 'object' || !user.permissions) {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này.' });
        }

        // Kiểm tra xem người dùng có quyền này không
        const permissions = user.permissions as string[];
        if (permissions.includes(requiredPermission)) {
            // Có quyền -> cho đi tiếp
            next();
        } else {
            // Không có quyền -> chặn
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này.' });
        }
    };
};