import axios from 'axios';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import prisma from '../models';

// Lấy các biến cấu hình MoMo từ file .env
const accessKey = process.env.MOMO_ACCESSKEY!;
const secretKey = process.env.MOMO_SECRETKEY!;
const partnerCode = "MOMO";
const redirectUrl = process.env.MOMO_REDIRECT_URL || "http://localhost:3001/confirm";
const ipnUrl = process.env.MOMO_IPN_URL || "http://your-server-domain/api/public/payment/callback";

/**
 * Tạo yêu cầu thanh toán đến MoMo
 */
export const createMomoPayment = async (amount: number, reservationId: number) => {
    // Tạo mã đơn hàng và requestId duy nhất
    const orderId = `HS${reservationId}_${Date.now()}`;
    const requestId = orderId;

    // Thông tin đơn hàng hiển thị cho người dùng
    const orderInfo = `Thanh toan don dat ban ${orderId}`;
    const requestType = "captureWallet"; // Loại thanh toán (ví MoMo)
    const extraData = ""; // Có thể thêm dữ liệu phụ (nếu cần)

    // Chuỗi ký để tạo chữ ký bảo mật (phải đúng thứ tự MoMo yêu cầu)
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Tạo chữ ký HMAC SHA256 từ chuỗi rawSignature và secretKey
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    // Gói dữ liệu gửi lên API của MoMo
    const requestBody = {
        partnerCode, requestId, amount, orderId, orderInfo,
        redirectUrl, ipnUrl, lang: 'vi', requestType, extraData, signature,
    };

    try {
        // Cập nhật đơn đặt bàn trong DB với mã đơn hàng MoMo
        await prisma.dat_ban.update({
            where: { id: reservationId },
            data: { momo_order_id: orderId }
        });

        // Gửi request POST đến API MoMo (sandbox/test)
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);

        // Trả về dữ liệu phản hồi từ MoMo (chứa URL thanh toán, mã QR, v.v.)
        return response.data;
    } catch (error: any) {
        // Ghi log khi lỗi xảy ra
        console.error("Lỗi khi tạo thanh toán MoMo:", error.response?.data || error.message);
        throw new Error("Không thể tạo yêu cầu thanh toán.");
    }
};

/**
 * Xử lý callback (IPN) từ MoMo sau khi thanh toán
 */
export const handleMomoCallback = async (body: any) => {
    const { resultCode, orderId, message } = body;

    // Kiểm tra nếu giao dịch thành công (resultCode = 0)
    if (resultCode === 0) {
        // Sử dụng transaction đảm bảo an toàn khi cập nhật nhiều bảng
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

            // Tìm đơn đặt bàn tương ứng với orderId từ MoMo
            const reservation = await tx.dat_ban.findFirst({
                where: { momo_order_id: orderId }
            });

            // Nếu không tìm thấy, ghi log lỗi
            if (!reservation) {
                console.error(`IPN Success but reservation with momo_order_id=${orderId} not found.`);
                throw new Error('Không tìm thấy đơn đặt bàn tương ứng.');
            }

            // Chỉ xử lý nếu đơn đang ở trạng thái "chờ xác nhận" (1)
            if (reservation.trang_thai === 1) {
                // Cập nhật đơn đặt bàn thành "đã xác nhận" (2)
                const updatedReservation = await tx.dat_ban.update({
                    where: { id: reservation.id },
                    data: { trang_thai: 2 } // 2: Đã xác nhận
                });

                // Nếu có bàn ăn đi kèm thì cập nhật bàn thành "có khách" (0)
                if (updatedReservation.ban_an_id) {
                    await tx.ban_an.update({
                        where: { id: updatedReservation.ban_an_id },
                        data: { trang_thai: 0 } // 0: Có khách
                    });
                }

                // Trả về đơn đã cập nhật
                return updatedReservation;
            }

            // Nếu đơn đã xử lý rồi thì chỉ trả về thông tin hiện tại
            return reservation;
        });
    } else {
        // Nếu giao dịch thất bại → ghi log và báo lỗi
        console.log(`Giao dịch MoMo thất bại cho orderId ${orderId}: ${message}`);
        // Có thể mở rộng: lưu log giao dịch thất bại vào DB
        throw new Error(`Thanh toán thất bại: ${message}`);
    }
};
