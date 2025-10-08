import { Request, Response } from 'express';
import * as permissionService from '../services/permission.service';

/**
 * Handler để lấy tất cả các quyền hạn
 */
export const handleGetAllPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await permissionService.getAllPermissions();
        res.status(200).json({ message: 'Lấy danh sách quyền hạn thành công', data: permissions });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
