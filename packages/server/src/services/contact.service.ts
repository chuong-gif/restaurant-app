import nodemailer from 'nodemailer';

/**
 * ✅ Gửi email từ form liên hệ (Contact Form)
 */
export const sendContactEmail = async (data: { name: string; email: string; subject: string; message: string; }) => {
    const { name, email, subject, message } = data; // lấy dữ liệu người gửi từ form

    // ✉️ Cấu hình transporter để gửi email qua Gmail SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // máy chủ SMTP của Gmail
        port: 587,              // cổng dùng cho TLS (không mã hóa SSL trực tiếp)
        secure: false,           // false = dùng TLS (STARTTLS)
        auth: {                 // thông tin đăng nhập email người gửi
            user: process.env.EMAIL_USERNAME, // địa chỉ email (lưu trong biến môi trường)
            pass: process.env.EMAIL_PASSWORD, // mật khẩu ứng dụng (App Password)
        },
    });

    // 📦 Cấu hình nội dung email sẽ gửi đi
    const mailOptions = {
        from: `"${name}" <${email}>`, // hiển thị tên và email người gửi
        to: process.env.CONTACT_EMAIL_RECIPIENT, // email của người nhận (chủ website)
        subject: `[Liên hệ] - ${subject}`, // tiêu đề email
        html: `
            <h3>Thông tin liên hệ từ khách hàng:</h3>
            <ul>
                <li><strong>Tên:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
            </ul>
            <h3>Nội dung:</h3>
            <p>${message}</p>
        `, // nội dung HTML của email
        replyTo: email // khi người nhận bấm "Trả lời" thì sẽ gửi về email người liên hệ
    };

    try {
        // 🚀 Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email liên hệ đã được gửi:', info.response); // log phản hồi từ server SMTP
        return info; // trả về thông tin gửi thành công
    } catch (error) {
        // ⚠️ Bắt lỗi nếu quá trình gửi thất bại
        console.error('Lỗi khi gửi email liên hệ:', error);
        throw new Error('Không thể gửi email vào lúc này.');
    }
};
