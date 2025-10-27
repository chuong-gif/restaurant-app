// packages/server/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { nguoi_dung_loai_nguoi_dung as UserType } from '@prisma/client';

// 📌 Lấy danh sách người dùng
export const handleGetUsers = async (req: Request, res: Response) => {
    try {
        const filters = {
            page: parseInt(req.query.page as string) || 1,
            pageSize: parseInt(req.query.limit as string) || 10, // Sửa: Dùng limit như service
            search: (req.query.search as string) || '',
            // Sửa: Dùng boolean cho trạng thái
            trang_thai: req.query.trang_thai === 'true' ? true : (req.query.trang_thai === 'false' ? false : undefined),
            roleId: req.query.searchRoleId ? parseInt(req.query.searchRoleId as string) : undefined,
            userType: req.query.searchUserType as UserType,
        };
        const result = await userService.getUsers(filters);
        res.status(200).json({ message: 'Lấy danh sách người dùng thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Lấy thông tin chi tiết của 1 người dùng theo ID
export const handleGetUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const user = await userService.getUserById(id);
        res.status(200).json({ result: user }); // Giữ nguyên key 'result' như code cũ
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

// 📌 Tạo mới một người dùng
export const handleCreateUser = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json({ message: 'Tạo người dùng thành công', data: newUser });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// 📌 Cập nhật thông tin người dùng theo ID (bao gồm cả khôi phục)
export const handleUpdateUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedUser = await userService.updateUser(id, req.body); // Service đã được sửa để linh hoạt
        // Phân biệt log message cho khôi phục
        const message = req.body.trang_thai === true ? 'Khôi phục người dùng thành công' : 'Cập nhật người dùng thành công';
        res.status(200).json({ message, data: updatedUser });
    } catch (error: any) {
        // Sửa: Trả về lỗi 404 nếu không tìm thấy user
        if (error.message === '❌ Người dùng không tồn tại.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message }); // Lỗi khác (vd: email trùng)
        }
    }
};

// 📌 Xóa MỀM người dùng theo ID (Đổi tên hàm)
export const handleSoftDeleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        // Gọi service updateUser với trang_thai = false
        const deletedUser = await userService.updateUser(id, { trang_thai: false });
        res.status(200).json({ message: 'Xóa mềm người dùng thành công', data: deletedUser });
    } catch (error: any) {
        if (error.message === '❌ Người dùng không tồn tại.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

// 📌 Xóa VĨNH VIỄN người dùng theo ID (Hàm này đã có)
export const handlePermanentlyDeleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await userService.permanentlyDeleteUser(id); // Gọi service xóa vĩnh viễn
        res.status(200).json({ message: 'Xóa vĩnh viễn người dùng thành công' });
    } catch (error: any) {
        if (error.message === '❌ Người dùng không tồn tại.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message }); // Lỗi ràng buộc hoặc lỗi khác
        }
    }
};

// 📌 Kiểm tra mật khẩu hiện tại của người dùng (Giữ nguyên)
export const handleCheckPassword = async (req: Request, res: Response) => {
    try {
        const { email, currentPassword } = req.body;
        await userService.checkCurrentPassword(email, currentPassword);
        res.status(200).json({ message: 'Mật khẩu chính xác.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};