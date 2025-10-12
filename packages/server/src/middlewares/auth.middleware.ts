// packages/server/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mở rộng interface Request của Express để thêm thuộc tính 'user'
export interface AuthenticatedRequest extends Request {
    user?: string | jwt.JwtPayload;
}

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-default-secret-key'; // Luôn có một secret dự phòng

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
        // 401 Unauthorized: Thiếu thông tin xác thực
        return res.status(401).json({ message: "A token is required for authentication" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // 403 Forbidden: Token không hợp lệ hoặc hết hạn
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        // Gắn thông tin user đã giải mã vào request
        req.user = user;
        next(); // Chuyển sang xử lý tiếp theo
    });
};