import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { nguoi_dung_loai_nguoi_dung as UserType } from '@prisma/client';

export const handleGetUsers = async (req: Request, res: Response) => {
    try {
        const filters = {
            page: parseInt(req.query.page as string) || 1,
            pageSize: parseInt(req.query.limit as string) || 10,
            search: (req.query.search as string) || '',
            status: req.query.searchStatus ? parseInt(req.query.searchStatus as string) : undefined,
            roleId: req.query.searchRoleId ? parseInt(req.query.searchRoleId as string) : undefined,
            userType: req.query.searchUserType as UserType,
        };
        const result = await userService.getUsers(filters);
        res.status(200).json({ message: 'Lấy danh sách người dùng thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleGetUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const user = await userService.getUserById(id);
        res.status(200).json({ result: user });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const handleCreateUser = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json({ message: 'Tạo người dùng thành công', data: newUser });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedUser = await userService.updateUser(id, req.body);
        res.status(200).json({ message: 'Cập nhật người dùng thành công', data: updatedUser });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleDeleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await userService.deleteUser(id);
        res.status(200).json({ message: 'Xóa người dùng thành công' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleCheckPassword = async (req: Request, res: Response) => {
    try {
        const { email, currentPassword } = req.body;
        await userService.checkCurrentPassword(email, currentPassword);
        res.status(200).json({ message: 'Mật khẩu chính xác.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
