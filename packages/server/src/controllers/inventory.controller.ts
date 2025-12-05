// packages/server/src/controllers/inventory.controller.ts
import { Request, Response } from 'express';
import * as inventoryService from '../services/inventory.service';

// --- SUPPLIERS ---
export const handleGetSuppliers = async (req: Request, res: Response) => {
    try {
        const filters = {
            page: parseInt(req.query.page as string) || 1,
            pageSize: parseInt(req.query.limit as string) || 10,
            searchName: req.query.searchName as string,
            status: req.query.status
        };
        const result = await inventoryService.getSuppliers(filters);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleCreateSupplier = async (req: Request, res: Response) => {
    try {
        await inventoryService.createSupplier(req.body);
        res.status(201).json({ message: 'Thêm nhà cung cấp thành công' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleUpdateSupplier = async (req: Request, res: Response) => {
    try {
        await inventoryService.updateSupplier(parseInt(req.params.id), req.body);
        res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleDeleteSupplier = async (req: Request, res: Response) => {
    try {
        await inventoryService.deleteSupplier(parseInt(req.params.id));
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// --- MATERIALS ---
export const handleGetMaterials = async (req: Request, res: Response) => {
    try {
        const filters = {
            page: parseInt(req.query.page as string) || 1,
            pageSize: parseInt(req.query.limit as string) || 10,
            searchName: req.query.searchName as string,
            status: req.query.status
        };
        const result = await inventoryService.getMaterials(filters);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleCreateMaterial = async (req: Request, res: Response) => {
    try {
        await inventoryService.createMaterial(req.body);
        res.status(201).json({ message: 'Thêm nguyên liệu thành công' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleUpdateMaterial = async (req: Request, res: Response) => {
    try {
        await inventoryService.updateMaterial(parseInt(req.params.id), req.body);
        res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleDeleteMaterial = async (req: Request, res: Response) => {
    try {
        await inventoryService.deleteMaterial(parseInt(req.params.id));
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
// === THÊM CONTROLLER NHẬP KHO ===
export const handleImportInventory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Lấy ID người đang đăng nhập
        await inventoryService.createImportReceipt(req.body, userId);
        res.status(201).json({ message: 'Nhập kho thành công!' });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Lỗi nhập kho' });
    }
};