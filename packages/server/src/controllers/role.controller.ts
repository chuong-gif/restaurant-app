import { Request, Response } from 'express';
import * as roleService from '../services/role.service'; // Import các hàm xử lý logic từ role.service

// 📘 Lấy danh sách vai trò (có phân trang và tìm kiếm)
export const handleGetRoles = async (req: Request, res: Response) => {
    try {
        // Lấy các tham số từ query string (?search=&page=&limit=)
        const search = (req.query.search as string) || '';
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;

        // Gọi service để lấy danh sách vai trò
        const result = await roleService.getRoles(search, page, pageSize);

        // Trả về kết quả thành công
        res.status(200).json({ message: 'Lấy danh sách vai trò thành công', ...result });
    } catch (error: any) {
        // Xử lý lỗi máy chủ
        res.status(500).json({ message: error.message });
    }
};

// 📘 Lấy thông tin chi tiết một vai trò theo ID
export const handleGetRoleById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id); // Lấy ID từ URL params
        const role = await roleService.getRoleById(id); // Gọi service lấy dữ liệu vai trò
        res.status(200).json(role); // Trả dữ liệu về client
    } catch (error: any) {
        // Nếu không tìm thấy, trả lỗi 404
        res.status(404).json({ message: error.message });
    }
};

// 📘 Tạo mới một vai trò
export const handleCreateRole = async (req: Request, res: Response) => {
    try {
        // Transform dữ liệu từ frontend sang đúng format service cần
        const { ten_vai_tro, mo_ta } = req.body;

        const newRole = await roleService.createRole({
            ten_vai_tro,
            mo_ta
        });

        res.status(201).json({ message: 'Tạo vai trò thành công', data: newRole });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// 📘 Cập nhật thông tin vai trò
export const handleUpdateRole = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id); // Lấy ID từ URL
        const updatedRole = await roleService.updateRole(id, req.body); // Cập nhật thông tin vai trò
        res.status(200).json({ message: 'Cập nhật vai trò thành công', data: updatedRole });
    } catch (error: any) {
        // Xử lý lỗi cập nhật
        res.status(400).json({ message: error.message });
    }
};

// 📘 Xóa một vai trò theo ID
export const handleDeleteRole = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id); // Lấy ID từ URL
        await roleService.deleteRole(id); // Gọi service để xóa vai trò
        res.status(200).json({ message: 'Xóa vai trò thành công' }); // Trả về thông báo thành công
    } catch (error: any) {
        // Xử lý lỗi (ví dụ: ID không tồn tại)
        res.status(400).json({ message: error.message });
    }
};

// 📘 Gán quyền hạn (permissions) cho một vai trò
export const handleAssignPermissions = async (req: Request, res: Response) => {
    try {
        const roleId = parseInt(req.params.id); // ID của vai trò cần gán quyền
        const { permissionIds } = req.body; // Lấy danh sách ID quyền hạn từ body

        // Kiểm tra dữ liệu hợp lệ
        if (!Array.isArray(permissionIds)) {
            return res.status(400).json({ message: 'permissionIds phải là một mảng.' });
        }

        // Gọi service để gán quyền cho vai trò
        await roleService.assignPermissionsToRole(roleId, permissionIds);

        // Trả về thông báo thành công
        res.status(200).json({ message: 'Phân quyền cho vai trò thành công.' });
    } catch (error: any) {
        // Lỗi hệ thống hoặc service
        res.status(500).json({ message: error.message });
    }
};
