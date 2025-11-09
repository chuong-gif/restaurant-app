// packages/client/src/lib/validation/contact.schema.ts
import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().min(1, "Tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    subject: z.string().min(1, "Chủ đề là bắt buộc"),
    message: z.string().min(1, "Tin nhắn là bắt buộc"),
});

export type ContactSchema = z.infer<typeof contactSchema>;