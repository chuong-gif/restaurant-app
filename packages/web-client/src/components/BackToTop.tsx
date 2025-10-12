// packages/web-client/src/components/BackToTop.tsx

import React, { useState, useEffect } from 'react';

const BackToTop: React.FC = () => {
    // State để theo dõi xem nút có nên được hiển thị hay không
    const [isVisible, setIsVisible] = useState(false);

    // Hàm xử lý việc hiển thị nút dựa trên vị trí cuộn
    const toggleVisibility = () => {
        // Nếu người dùng cuộn xuống hơn 300px, hiển thị nút
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Hàm xử lý việc cuộn lên đầu trang một cách mượt mà
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Tạo hiệu ứng cuộn mượt
        });
    };

    // Sử dụng useEffect để thêm và xóa event listener khi component được tạo ra hoặc hủy đi
    useEffect(() => {
        // Lắng nghe sự kiện cuộn của cửa sổ
        window.addEventListener('scroll', toggleVisibility);

        // Dọn dẹp event listener khi component bị hủy để tránh rò rỉ bộ nhớ
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Nút chỉ được render khi isVisible là true */}
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold p-3 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 focus:outline-none"
                    aria-label="Scroll to top"
                >
                    {/* Icon mũi tên lên (sử dụng SVG cho linh hoạt) */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default BackToTop;