import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { nguoi_dung_loai_nguoi_dung as UserType } from '@prisma/client';

// 📌 Lấy danh sách người dùng có phân trang, tìm kiếm, lọc theo trạng thái, role, loại người dùng
export const handleGetUsers = async (req: Request, res: Response) => {
    try {
        // Lấy các tham số lọc và phân trang từ query string
        const filters = {
            page: parseInt(req.query.page as string) || 1, // Trang hiện tại (mặc định là 1)
            pageSize: parseInt(req.query.limit as string) || 10, // Số bản ghi mỗi trang
            search: (req.query.search as string) || '', // Từ khóa tìm kiếm
            status: req.query.searchStatus ? parseInt(req.query.searchStatus as string) : undefined, // Lọc theo trạng thái
            roleId: req.query.searchRoleId ? parseInt(req.query.searchRoleId as string) : undefined, // Lọc theo vai trò
            userType: req.query.searchUserType as UserType, // Lọc theo loại người dùng (enum)
        };

        // Gọi service để truy vấn dữ liệu từ database
        const result = await userService.getUsers(filters);

        // Trả kết quả thành công về client
        res.status(200).json({ message: 'Lấy danh sách người dùng thành công', ...result });
    } catch (error: any) {
        // Bắt lỗi server
        res.status(500).json({ message: error.message });
    }
};

// 📌 Lấy thông tin chi tiết của 1 người dùng theo ID
export const handleGetUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id); // Lấy id từ params URL
        const user = await userService.getUserById(id); // Gọi service để lấy thông tin người dùng
        res.status(200).json({ result: user }); // Trả dữ liệu về client
    } catch (error: any) {
        // Nếu không tìm thấy user -> trả lỗi 404
        res.status(404).json({ message: error.message });
    }
};

// 📌 Tạo mới một người dùng
export const handleCreateUser = async (req: Request, res: Response) => {
    try {
        // Gọi service để thêm người dùng mới vào DB
        const newUser = await userService.createUser(req.body);
        // Trả kết quả thành công (HTTP 201)
        res.status(201).json({ message: 'Tạo người dùng thành công', data: newUser });
    } catch (error: any) {
        // Lỗi dữ liệu không hợp lệ, hoặc email trùng, v.v.
        res.status(400).json({ message: error.message });
    }
};

// 📌 Cập nhật thông tin người dùng theo ID
export const handleUpdateUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id); // Lấy id từ URL
        const updatedUser = await userService.updateUser(id, req.body); // Cập nhật thông tin
        res.status(200).json({ message: 'Cập nhật người dùng thành công', data: updatedUser });
    } catch (error: any) {
        // Lỗi server hoặc không tìm thấy user
        res.status(500).json({ message: error.message });
    }
};

// 📌 Xóa người dùng theo ID
export const handleDeleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id); // Lấy id từ URL
        await userService.deleteUser(id); // Gọi service xóa người dùng
        res.status(200).json({ message: 'Xóa người dùng thành công' }); // Trả về kết quả thành công
    } catch (error: any) {
        // Nếu không xóa được (VD: ID không tồn tại) -> trả lỗi 400
        res.status(400).json({ message: error.message });
    }
};

// 📌 Kiểm tra mật khẩu hiện tại của người dùng (dùng khi đổi mật khẩu)
export const handleCheckPassword = async (req: Request, res: Response) => {
    try {
        const { email, currentPassword } = req.body; // Lấy email và mật khẩu hiện tại từ request
        await userService.checkCurrentPassword(email, currentPassword); // Kiểm tra mật khẩu có đúng không
        res.status(200).json({ message: 'Mật khẩu chính xác.' }); // Nếu đúng -> thông báo thành công
    } catch (error: any) {
        // Nếu sai mật khẩu -> trả lỗi 400
        res.status(400).json({ message: error.message });
    }
};
