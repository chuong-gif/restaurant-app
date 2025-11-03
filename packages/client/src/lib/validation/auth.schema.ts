import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Email không hợp lệ.' }),
    password: z
        .string()
        .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
});
export type LoginSchema = z.infer<typeof loginSchema>;

// === SỬA SCHEMA ĐĂNG KÝ ===
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

    // === SỬA LỖI Ở ĐÂY ===
    // Bỏ các yêu cầu bắt buộc và .refine()
    address: z.string().optional(),
    // ===================

    anh_dai_dien_id: z.number().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;