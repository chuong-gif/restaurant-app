// File: packages/web-admin/src/layouts/AdminLayout.tsx

import { Layout } from "antd";
import { Navigate, Outlet } from "react-router-dom"; // 👈 1. Import thêm Navigate
import { useAppSelector } from "../store/hooks"; // 👈 2. Import hook để đọc state
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const { Content } = Layout;

export default function AdminLayout() {
    // 👇 3. LẤY TOKEN TỪ REDUX STATE
    const { token } = useAppSelector((state) => state.auth);

    // 👇 4. LOGIC "NGƯỜI GÁC CỔNG"
    // Nếu không có token (chưa đăng nhập), chuyển hướng về trang login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có token, hiển thị giao diện trang quản trị
    return (
        <Layout
            className="h-screen w-screen overflow-hidden"
            style={{ height: "100vh", width: "100vw" }}
        >
            <Sidebar />
            <Layout
                className="flex flex-col flex-1 bg-gray-100 overflow-hidden"
                style={{ height: "100vh", width: "100%" }}
            >
                <Header />
                <Content
                    className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gray-100"
                    style={{ height: "calc(100vh - 64px)" }}
                >
                    <div className="w-full h-full bg-white rounded-xl shadow p-6">
                        <Outlet /> {/* Outlet sẽ render component con (Dashboard, Products, etc.) */}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}