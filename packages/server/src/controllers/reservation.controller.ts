import { Request, Response } from 'express';
import * as reservationService from '../services/reservation.service';

export const handleCreateReservation = async (req: Request, res: Response) => {
    try {
        const newReservation = await reservationService.createReservation(req.body);
        res.status(201).json({ message: 'Đặt bàn thành công', data: { id: newReservation.id, table: { id: newReservation.ban_an_id } } });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const handleGetAdminReservations = async (req: Request, res: Response) => {
    try {
        const filters = {
            page: parseInt(req.query.page as string) || 1,
            pageSize: parseInt(req.query.limit as string) || 10,
            searchName: (req.query.searchName as string) || '',
            searchPhone: (req.query.searchPhone as string) || '',
            status: req.query.status as string,
            reservation_code: (req.query.reservation_code as string) || '',
        };
        const result = await reservationService.getAdminReservations(filters);
        res.status(200).json({ message: 'Lấy danh sách đặt bàn thành công', ...result });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

export const handleChangeDishes = async (req: Request, res: Response) => {
    try {
        const reservation_id = parseInt(req.body.selecteReservation_id);
        const dishes = Array.isArray(req.body.selectedChangedishes) ? req.body.selectedChangedishes : [];
        const totalAmount = dishes.length > 0 ? dishes[0].total_amount : 0; // Logic cũ cần xem lại

        await reservationService.changeDishes(reservation_id, dishes, totalAmount);
        res.status(200).json({ message: 'Thay đổi món ăn thành công.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

export const handleUpdateStatus = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        if (status === undefined) {
            return res.status(400).json({ message: 'Trạng thái là bắt buộc.' });
        }
        await reservationService.updateReservationStatus(id, parseInt(status));
        res.status(200).json({ message: 'Cập nhật trạng thái thành công.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};
