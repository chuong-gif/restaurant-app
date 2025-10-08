import { Request, Response } from 'express';
import * as roleService from '../services/role.service';

export const handleGetRoles = async (req: Request, res: Response) => {
    try {
        const search = (req.query.search as string) || '';
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;
        const result = await roleService.getRoles(search, page, pageSize);
        res.status(200).json({ message: 'Lấy danh sách vai trò thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleGetRoleById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const role = await roleService.getRoleById(id);
        res.status(200).json(role);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const handleCreateRole = async (req: Request, res: Response) => {
    try {
        const newRole = await roleService.createRole(req.body);
        res.status(201).json({ message: 'Tạo vai trò thành công', data: newRole });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleUpdateRole = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedRole = await roleService.updateRole(id, req.body);
        res.status(200).json({ message: 'Cập nhật vai trò thành công', data: updatedRole });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleDeleteRole = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await roleService.deleteRole(id);
        res.status(200).json({ message: 'Xóa vai trò thành công' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleAssignPermissions = async (req: Request, res: Response) => {
    try {
        const roleId = parseInt(req.params.id);
        const { permissionIds } = req.body; // Expect an array of numbers

        if (!Array.isArray(permissionIds)) {
            return res.status(400).json({ message: 'permissionIds phải là một mảng.' });
        }

        await roleService.assignPermissionsToRole(roleId, permissionIds);
        res.status(200).json({ message: 'Phân quyền cho vai trò thành công.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
