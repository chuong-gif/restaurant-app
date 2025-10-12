// Dán code này vào file: packages/web-client/src/App.tsx

import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Layout chính của bạn

// Sử dụng React.lazy để các trang chỉ được tải khi người dùng truy cập
// Điều này giúp tốc độ tải ban đầu của trang web nhanh hơn rất nhiều
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Menu = React.lazy(() => import('./pages/Menu'));
const DetailProduct = React.lazy(() => import('./pages/DetailProduct'));
const Booking = React.lazy(() => import('./pages/Booking'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Service = React.lazy(() => import('./pages/Service'));
const Blog = React.lazy(() => import('./pages/Blog'));
const DetailBlog = React.lazy(() => import('./pages/DetailBlog'));
const Login = React.lazy(() => import('./pages/Authenticator/Login'));
const Register = React.lazy(() => import('./pages/Authenticator/Register'));
const ForgotPassword = React.lazy(() => import('./pages/Authenticator/ForgotPassword'));
const ChangePassword = React.lazy(() => import('./pages/Authenticator/ChangePassword'));
const Account = React.lazy(() => import('./pages/Account'));
const MyBooking = React.lazy(() => import('./pages/MyBookings'));
const Policy = React.lazy(() => import('./pages/Policy'));
const ReservationGuide = React.lazy(() => import('./pages/ReservationGuide'));
// Thêm các trang khác nếu cần...

// Component hiển thị khi trang đang được tải (lazy loading)
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
);

const App: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* Tất cả các trang của client sẽ được bọc trong Layout chung */}
                <Route path="/" element={<Layout />}>
                    {/* Trang con sẽ được hiển thị bên trong <Outlet /> của Layout */}
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="menu/:slug" element={<DetailProduct />} />
                    <Route path="booking" element={<Booking />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="service" element={<Service />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:blogId" element={<DetailBlog />} />
                    <Route path="account" element={<Account />} />
                    <Route path="my-bookings" element={<MyBooking />} />
                    <Route path="policy" element={<Policy />} />
                    <Route path="reservation-guide" element={<ReservationGuide />} />

                    {/* Các trang không cần Layout đầy đủ có thể được đặt ở ngoài */}
                    {/* Nhưng để đơn giản, ta đặt chung và xử lý ẩn/hiện Header/Footer trong Layout */}
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>

                {/* Thêm các route cho trang admin hoặc các trang không có layout ở đây nếu cần */}
                {/* Ví dụ: <Route path="/admin/*" element={<AdminLayout />} /> */}
            </Routes>
        </Suspense>
    );
};

export default App;