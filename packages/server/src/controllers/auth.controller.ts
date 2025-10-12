// packages/server/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const handleSocialLoginController = async (req: Request, res: Response) => {
    const { email, fullname, avatar } = req.body;
    try {
        const result = await authService.handleSocialLogin(email, fullname, avatar);
        res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const handleRegisterController = async (req: Request, res: Response) => {
    try {
        await authService.registerUser(req.body);
        res.status(201).json({ message: 'Đăng ký tài khoản thành công.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleAdminLoginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const result = await authService.loginAdmin(email, password);
        res.status(200).json({ message: 'Đăng nhập thành công', data: result.admin, accessToken: result.token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};