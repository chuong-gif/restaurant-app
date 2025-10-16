import { Request, Response } from 'express';
// Import các hàm xử lý logic gửi liên hệ từ service
import * as contactService from '../services/contact.service';

// Controller: Xử lý khi người dùng gửi form liên hệ (Contact Form)
export const handleSendContactEmail = async (req: Request, res: Response) => {
    try {
        // Lấy thông tin người gửi từ body
        const { name, email, subject, message } = req.body;

        // Kiểm tra các trường bắt buộc: nếu thiếu -> trả về lỗi 400 (Bad Request)
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
        }

        // Gọi service để xử lý việc gửi email liên hệ
        // (service này có thể gửi email thật qua SMTP hoặc lưu vào CSDL)
        await contactService.sendContactEmail({ name, email, subject, message });

        // Trả về phản hồi khi gửi liên hệ thành công
        res.status(200).json({ message: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.' });
    } catch (error: any) {
        // Nếu có lỗi trong quá trình gửi email hoặc xử lý dữ liệu, trả về mã lỗi 500
        res.status(500).json({ message: error.message });
    }
};
