// packages/server/src/controllers/statistical.controller.ts
import { Request, Response } from 'express';
import * as statisticalService from '../services/statistical.service';

/**
 * 🎮 Controller: Lấy 4 số liệu tổng quan
 */
export const handleGetOverviewStats = async (req: Request, res: Response) => {
    try {
        const data = await statisticalService.getOverviewStats();
        res.status(200).json({ message: "Lấy thống kê tổng quan thành công", data });
    } catch (error: any) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

/**
 * 🎮 Controller: Lấy doanh thu theo tháng
 */
export const handleGetMonthlyRevenue = async (req: Request, res: Response) => {
    try {
        const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
        const data = await statisticalService.getMonthlyRevenue(year);
        res.status(200).json({ message: `Lấy doanh thu tháng năm ${year} thành công`, data });
    } catch (error: any) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

/**
 * 🎮 Controller: Lấy thống kê trạng thái đơn hàng
 */
export const handleGetReservationStatusStats = async (req: Request, res: Response) => {
    try {
        const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
        const month = req.query.month ? parseInt(req.query.month as string) : undefined; // Lấy tháng (tùy chọn)

        const data = await statisticalService.getReservationStatusStats(year, month);
        res.status(200).json({ message: "Lấy thống kê trạng thái thành công", data });
    } catch (error: any) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

/**
 * 🎮 Controller: Lấy doanh thu theo khoảng ngày tùy chọn
 */
export const handleGetRevenueByDateRange = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate và endDate là bắt buộc.' });
        }

        const data = await statisticalService.getRevenueByDateRange(new Date(startDate as string), new Date(endDate as string));
        res.status(200).json({ message: "Lấy doanh thu theo khoảng ngày thành công", data });
    } catch (error: any) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};