// packages/web-client/src/components/Layout.tsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// Bước 1: Import đầy đủ và chính xác các component con
import Header from './Header'; // Import Header từ file cùng cấp
import Footer from './Footer'; // Import Footer từ file cùng cấp
import BackToTop from './BackToTop'; // Giả sử bạn đã tạo file BackToTop.tsx
//import ChatPopup from './ChatPopup'; // Giả sử bạn đã tạo file ChatPopup.tsx

const ClientLayout: React.FC = () => {
    const location = useLocation();

    const noFooterPaths = ['/login', '/register', '/forgot-password', '/change-password'];
    const showFooter = !noFooterPaths.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Bước 2: Sử dụng component Header đã import */}
            <Header />

            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Bước 3: Sử dụng các component đã import */}
           
            <BackToTop />

            {showFooter && <Footer />}
        </div>
    );
};

// Bước 4: Đảm bảo tên khi export phải viết hoa, khớp với tên component đã định nghĩa
export default ClientLayout;