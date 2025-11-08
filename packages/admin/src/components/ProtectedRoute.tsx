import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// 1. Định nghĩa interface cho props mới
interface ProtectedRouteProps {
    requiredPermission?: string; // Quyền yêu cầu để truy cập (có thể không cần)
}

const ProtectedRoute = ({ requiredPermission }: ProtectedRouteProps) => {
    const { token, user } = useAuth(); // Lấy cả user và token
    const location = useLocation();

    // 2. Kiểm tra đăng nhập (giống như cũ)
    if (!token) {
        // Chuyển hướng về trang login, lưu lại trang đang định tới
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Kiểm tra quyền (PHẦN QUAN TRỌNG MỚI)
    // Nếu route này yêu cầu quyền...
    if (requiredPermission) {
        // ...và người dùng không có mảng 'permissions' hoặc không chứa quyền đó
        if (!user?.permissions || !user.permissions.includes(requiredPermission)) {
            // Chuyển hướng đến trang "Từ chối truy cập" (hoặc về dashboard)
            // Tốt nhất là bạn nên tạo một trang /403-access-denied
            return <Navigate to="/dashboard" replace />; // Tạm thời về dashboard
        }
    }

    // 4. Nếu mọi thứ OK (đã đăng nhập VÀ có quyền) -> cho phép truy cập
    return <Outlet />;
};

export default ProtectedRoute;