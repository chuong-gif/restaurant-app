// packages/admin/src/utils/FormatCurrency.ts

/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam (VND).
 * @param value Số cần định dạng.
 * @returns Chuỗi tiền tệ đã định dạng (ví dụ: "1.000.000 đ") hoặc "0 đ" nếu đầu vào không hợp lệ.
 */
export const formatCurrency = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
        return '0 đ';
    }

    try {
        // Sử dụng Intl.NumberFormat để định dạng số theo kiểu Việt Nam
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0, // Không hiển thị phần thập phân
        });

        // Loại bỏ ký hiệu "₫" và thay bằng "đ" ở cuối (theo yêu cầu của bạn)
        return formatter.format(value).replace('₫', 'đ').trim();

    } catch (error) {
        console.error("Error formatting currency:", error);
        return '0 đ'; // Trả về giá trị mặc định nếu có lỗi
    }
};