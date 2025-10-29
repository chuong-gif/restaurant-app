// packages/admin/src/utils/FormatCurrency.ts

/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam (VND).
 * @param value Số cần định dạng.
 * @returns Chuỗi tiền tệ đã định dạng (ví dụ: "1.000.000 đ") hoặc "0 đ" nếu đầu vào không hợp lệ.
 */
export const formatCurrency = (value: any): string => {
    if (value === undefined || value === null || isNaN(Number(value))) {
        return '0 đ';
    }

    try {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        });

        return formatter.format(Number(value)).replace('₫', 'đ').trim();
    } catch {
        return '0 đ';
    }
};
