// packages/server/src/controllers/table.controller.ts
import { Request, Response } from 'express';
import * as tableService from '../services/table.service';

/**
 * 🎮 Lấy danh sách bàn ăn (Admin - có lọc)
 */
export const handleGetTablesAdmin = async (req: Request, res: Response) => {
    try {
        const filters = {
            page: parseInt(req.query.page as string) || 1,
            pageSize: parseInt(req.query.limit as string) || 10,
            searchSoBan: req.query.so_ban ? parseInt(req.query.so_ban as string) : undefined,
            searchSucChua: req.query.suc_chua ? parseInt(req.query.suc_chua as string) : undefined,
            // === THÊM LỌC TẦNG ===
            searchTang: req.query.tang ? parseInt(req.query.tang as string) : undefined,
            // ====================
        };
        const result = await tableService.getTablesAdmin(filters);
        res.status(200).json({ message: 'Lấy danh sách bàn ăn thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

/**
 * 🎮 Tạo bàn ăn mới
 */
export const handleCreateTable = async (req: Request, res: Response) => {
    try {
        // Kiểm tra dữ liệu cơ bản
        const { so_ban, suc_chua } = req.body;
        if (!so_ban || !suc_chua) {
            return res.status(400).json({ message: 'Số bàn và sức chứa là bắt buộc.' });
        }
        const newTable = await tableService.createTable(req.body);
        res.status(201).json({ message: 'Tạo bàn ăn thành công', data: newTable });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Tạo bàn ăn thất bại.' });
    }
};

/**
 * 🎮 Cập nhật thông tin bàn ăn
 */
export const handleUpdateTable = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        // Kiểm tra body không rỗng
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Không có dữ liệu cập nhật.' });
        }
        const updatedTable = await tableService.updateTable(id, req.body);
        res.status(200).json({ message: 'Cập nhật bàn ăn thành công', data: updatedTable });
    } catch (error: any) {
        if (error.message === 'Bàn ăn không tồn tại.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Cập nhật bàn ăn thất bại.' });
        }
    }
};

/**
 * 🎮 Xóa bàn ăn
 */
export const handleDeleteTable = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await tableService.deleteTable(id);
        res.status(200).json({ message: 'Xóa bàn ăn thành công.' });
    } catch (error: any) {
        if (error.message === 'Bàn ăn không tồn tại.') {
            res.status(404).json({ message: error.message });
        } else {
            // Bao gồm cả lỗi không thể xóa do ràng buộc
            res.status(400).json({ message: error.message || 'Xóa bàn ăn thất bại.' });
        }
    }
};

/**
 * 🎮 Lấy danh sách bàn trống theo ngày (Cho Client)
 * (ĐÃ SỬA: Bỏ partySize)
 */
export const handleGetAvailableTablesByDate = async (req: Request, res: Response) => {
    try {
        const dateString = req.query.date as string;
        // === BỎ LẤY partySize ===
        // const partySize = parseInt(req.query.partySize as string);

        if (!dateString) { // Chỉ cần ngày
            return res.status(400).json({ message: 'Ngày đặt là bắt buộc.' });
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ message: 'Ngày đặt không hợp lệ.' });
        }

        // Gọi service (đã bỏ partySize)
        const availableTables = await tableService.getAvailableTablesByDate(date);
        res.status(200).json({ message: 'Lấy danh sách bàn trống thành công', data: availableTables });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Lỗi khi tìm bàn trống.' });
    }
};

/**
 * 🗺️ POS: Lấy sơ đồ bàn (Real-time)
 */
export const handleGetTableMap = async (req: Request, res: Response) => {
    try {
        const data = await tableService.getTableMapStatus();
        res.status(200).json({ message: 'Lấy sơ đồ bàn thành công', data });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};