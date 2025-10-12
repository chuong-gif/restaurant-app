import { Request, Response } from 'express';
import * as tableService from '../services/table.service';
import { Prisma } from '@prisma/client';

export const handleGetTablesAdmin = async (req: Request, res: Response) => {
    try {
        const search = (req.query.search as string) || '';
        const capacity = req.query.searchCapacity ? parseInt(req.query.searchCapacity as string) : undefined;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;

        const result = await tableService.getTablesAdmin(search, capacity, page, pageSize);
        res.status(200).json({ message: 'Lấy danh sách bàn thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

export const handleFilterByDate = async (req: Request, res: Response) => {
    try {
        const date = req.query.date ? new Date(req.query.date as string) : new Date();
        const capacity = req.query.searchCapacity ? parseInt(req.query.searchCapacity as string) : undefined;

        const availableTables = await tableService.findAvailableTablesByDate(date, capacity);
        res.status(200).json({ message: 'Lấy danh sách bàn trống theo ngày thành công', results: availableTables });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

export const handleCreateTable = async (req: Request, res: Response) => {
    try {
        const newTable = await tableService.createTable(req.body);
        res.status(201).json({ message: 'Tạo bàn thành công', data: newTable });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'Số bàn đã tồn tại.' });
        }
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

export const handleUpdateTable = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedTable = await tableService.updateTable(id, req.body);
        res.status(200).json({ message: 'Cập nhật bàn thành công', data: updatedTable });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'Số bàn đã tồn tại.' });
        }
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

export const handleDeleteTable = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await tableService.deleteTable(id);
        res.status(200).json({ message: 'Xóa bàn thành công' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
