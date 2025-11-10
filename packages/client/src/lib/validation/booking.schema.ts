// packages/client/src/lib/validation/booking.schema.ts
import { z } from 'zod';

// Lấy logic validation từ Booking.js [cite: 236-270]
export const bookingInfoSchema = z.object({
    fullname: z.string().min(1, "Họ và tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    tel: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
        message: "Số điện thoại không đúng định dạng",
    }),
    reservation_date: z.string()
        .min(1, "Thời gian là bắt buộc")
        .refine(val => new Date(val) > new Date(), {
            message: "Không thể chọn thời gian trong quá khứ",
        })
        .refine(val => {
            const selectedDate = new Date(val);
            const minTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 giờ sau hiện tại
            return selectedDate >= minTime;
        }, {
            message: "Vui lòng đặt bàn trước ít nhất 2 giờ",
        })
        .refine(val => {
            const selectedDate = new Date(val);
            const maxTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày sau
            return selectedDate <= maxTime;
        }, {
            message: "Chỉ được đặt bàn trong vòng 7 ngày tới",
        })
        .refine(val => {
            const selectedHours = new Date(val).getHours();
            return selectedHours >= 9 && selectedHours <= 20; // 9h sáng đến 8h tối
        }, {
            message: "Chỉ được đặt bàn trong khung giờ 9:00 - 20:00",
        }),
    party_size: z.coerce.number() // Chuyển đổi string từ input sang number
        .min(1, "Số người ăn tối thiểu 1 người")
        .max(50, "Số người ăn tối đa 50 người"), // [cite: 282-288]
    note: z.string().optional(),
});

export type BookingInfoSchema = z.infer<typeof bookingInfoSchema>;