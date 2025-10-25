import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { token } = useAuth();

    // Nếu có token (đã đăng nhập) thì cho phép truy cập
    // Nếu không, chuyển hướng về trang login
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;