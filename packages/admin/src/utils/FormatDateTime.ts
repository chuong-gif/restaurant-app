// packages/admin/src/utils/FormatDateTime.ts

/**
 * Định dạng ngày giờ theo kiểu 'HH:mm DD/MM/YYYY'.
 * @param dateInput Chuỗi ngày giờ (ISO string) hoặc đối tượng Date.
 * @returns Chuỗi ngày giờ đã định dạng hoặc chuỗi rỗng nếu đầu vào không hợp lệ.
 */
export const formatDateTime = (dateInput: string | Date | undefined | null): string => {
    if (!dateInput) {
        return '';
    }

    try {
        const date = new Date(dateInput);

        // Kiểm tra xem date có hợp lệ không
        if (isNaN(date.getTime())) {
            return '';
        }

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return ''; // Trả về chuỗi rỗng nếu có lỗi
    }
};