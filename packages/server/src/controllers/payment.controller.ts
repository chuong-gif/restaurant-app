import { Request, Response } from 'express';
// Import các hàm xử lý logic thanh toán từ tầng service
import * as paymentService from '../services/payment.service';

// Controller: Tạo yêu cầu thanh toán bằng ví MoMo
export const handleCreateMomoPayment = async (req: Request, res: Response) => {
    try {
        // Lấy dữ liệu gửi từ client (số tiền và ID đặt bàn)
        const { amount, reservationId } = req.body;

        // Kiểm tra dữ liệu hợp lệ — nếu thiếu thì báo lỗi
        if (!amount || !reservationId) {
            return res.status(400).json({ message: 'Số tiền và ID đặt bàn là bắt buộc.' });
        }

        // Gọi service để tạo giao dịch thanh toán MoMo (tạo order, ký request, gửi đến MoMo API, v.v.)
        const momoResponse = await paymentService.createMomoPayment(amount, reservationId);

        // Trả về kết quả từ MoMo (thường gồm URL thanh toán hoặc trạng thái giao dịch)
        res.status(200).json(momoResponse);
    } catch (error: any) {
        // Bắt lỗi và trả về mã lỗi 500 (Internal Server Error)
        res.status(500).json({ message: error.message });
    }
};

// Controller: Xử lý callback (IPN) mà MoMo gửi về sau khi thanh toán
export const handleMomoIpnCallback = async (req: Request, res: Response) => {
    try {
        // Ghi log nội dung callback từ MoMo để theo dõi
        console.log("MoMo IPN Received:", req.body);

        // Gọi service để xử lý dữ liệu IPN (kiểm tra chữ ký, cập nhật trạng thái đơn hàng, v.v.)
        await paymentService.handleMomoCallback(req.body);

        // MoMo yêu cầu phản hồi 204 (no content) nếu xử lý thành công để ngừng gửi lại
        res.status(204).send();
    } catch (error: any) {
        // Nếu lỗi, vẫn phải trả 204 để MoMo không gửi lại IPN nhiều lần
        console.error("Lỗi xử lý MoMo IPN:", error.message);
        res.status(204).send();
    }
};
