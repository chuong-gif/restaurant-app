import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Email không hợp lệ.' }),
    password: z
        .string()
        .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
});
export type LoginSchema = z.infer<typeof loginSchema>;

// === THÊM SCHEMA ĐĂNG KÝ MỚI ===
// Dựa trên validation của Register.js
export const registerSchema = z.object({
    fullname: z.string().min(1, { message: "Họ và tên là bắt buộc" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    tel: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
        message: "Số điện thoại không đúng định dạng",
    }),
    password: z.string()
        .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
            message: "Mật khẩu phải có chữ hoa, số và ký tự đặc biệt",
        }),
    confirmPassword: z.string(),
    address: z.string()
        .min(1, { message: "Địa chỉ là bắt buộc" })
        .refine(val => val.split(",").filter(part => part.trim()).length >= 4, {
            message: "Vui lòng điền đầy đủ thông tin địa chỉ (Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/Thành)",
        }),
    avatar: z.string().url({ message: "URL ảnh đại diện không hợp lệ" }).optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], // Gắn lỗi vào trường confirmPassword
});

export type RegisterSchema = z.infer<typeof registerSchema>;