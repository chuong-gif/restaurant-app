import { Request, Response } from 'express';
import * as promotionService from '../services/promotion.service';

// Handler for getting a paginated list of promotions
export const handleGetPromotions = async (req: Request, res: Response) => {
    try {
        const search = (req.query.search as string) || '';
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;
        const result = await promotionService.getPromotions(search, page, pageSize);
        res.status(200).json({ message: 'Lấy danh sách khuyến mãi thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Handler for getting a single promotion by ID
export const handleGetPromotionById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const promotion = await promotionService.getPromotionById(id);
        res.status(200).json({ message: 'Lấy thông tin khuyến mãi thành công', data: promotion });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

// Handler for creating a new promotion
export const handleCreatePromotion = async (req: Request, res: Response) => {
    try {
        const { code_name, discount, quantity, valid_from, valid_to, type } = req.body;
        const newPromotion = await promotionService.createPromotion({
            code_name, discount, quantity,
            valid_from: new Date(valid_from),
            valid_to: new Date(valid_to),
            type: type === 1 // Convert number to boolean
        });
        res.status(201).json({ message: 'Tạo khuyến mãi thành công', data: newPromotion });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Handler for updating a promotion
export const handleUpdatePromotion = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedPromotion = await promotionService.updatePromotion(id, req.body);
        res.status(200).json({ message: 'Cập nhật khuyến mãi thành công', data: updatedPromotion });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Handler for deleting a promotion
export const handleDeletePromotion = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await promotionService.deletePromotion(id);
        res.status(200).json({ message: 'Xóa khuyến mãi thành công' });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};
