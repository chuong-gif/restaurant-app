// packages/server/src/controllers/auth.controller.ts

// Import các kiểu dữ liệu Request, Response từ Express để định nghĩa hàm controller
import { Request, Response } from 'express';
// Import toàn bộ hàm từ file service xử lý logic đăng nhập, đăng ký, v.v...
import * as authService from '../services/auth.service';

// Controller xử lý đăng nhập bằng mạng xã hội (Google, Facebook, v.v.)
export const handleSocialLoginController = async (req: Request, res: Response) => {
    // Lấy dữ liệu email, fullname, avatar từ request body gửi lên
    const { email, fullname, avatar } = req.body;
    try {
        // Gọi hàm xử lý login mạng xã hội trong service
        const result = await authService.handleSocialLogin(email, fullname, avatar);
        // Trả về phản hồi JSON kèm dữ liệu nếu thành công
        res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        // Nếu có lỗi, trả về mã lỗi 500 và thông báo lỗi
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller xử lý đăng ký tài khoản người dùng
export const handleRegisterController = async (req: Request, res: Response) => {
    try {
        // Gọi hàm đăng ký người dùng trong service, truyền toàn bộ req.body
        await authService.registerUser(req.body);
        // Nếu thành công, trả về mã 201 (Created)
        res.status(201).json({ message: 'Đăng ký tài khoản thành công.' });
    } catch (error: any) {
        // Nếu có lỗi (như email tồn tại, dữ liệu sai), trả về mã 400
        res.status(400).json({ message: error.message });
    }
};

// Controller xử lý đăng nhập cho admin
export const handleAdminLoginController = async (req: Request, res: Response) => {
    // Lấy email và password từ request body
    const { email, password } = req.body;
    try {
        // Gọi hàm đăng nhập admin trong service, nhận lại dữ liệu và token
        const result = await authService.loginAdmin(email, password);
        // Trả về dữ liệu admin và accessToken nếu đăng nhập thành công
        res.status(200).json({ message: 'Đăng nhập thành công', data: result.admin, accessToken: result.token });
    } catch (error: any) {
        // Nếu sai thông tin hoặc bị lỗi, trả về mã lỗi 401 (Unauthorized)
        res.status(401).json({ message: error.message });
    }
};
