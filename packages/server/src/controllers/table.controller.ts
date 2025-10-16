import { Request, Response } from 'express';
import * as tableService from '../services/table.service'; // Import các hàm xử lý logic bàn ăn từ service
import { Prisma } from '@prisma/client'; // Import Prisma để xử lý lỗi đặc thù từ database

// 📘 [ADMIN] Lấy danh sách tất cả bàn ăn (có phân trang, tìm kiếm, lọc theo sức chứa)
export const handleGetTablesAdmin = async (req: Request, res: Response) => {
    try {
        // Lấy giá trị tìm kiếm tên bàn nếu có, mặc định rỗng
        const search = (req.query.search as string) || '';
        // Lọc theo sức chứa (nếu có truyền vào query)
        const capacity = req.query.searchCapacity ? parseInt(req.query.searchCapacity as string) : undefined;
        // Lấy trang hiện tại (page) và số lượng mỗi trang (limit)
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.limit as string) || 10;

        // Gọi service để truy vấn danh sách bàn theo điều kiện
        const result = await tableService.getTablesAdmin(search, capacity, page, pageSize);

        // Trả kết quả thành công cho client
        res.status(200).json({ message: 'Lấy danh sách bàn thành công', ...result });
    } catch (error: any) {
        // Bắt lỗi tổng quát (lỗi hệ thống, DB, v.v.)
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// 📘 Lọc bàn trống theo ngày (để người dùng hoặc admin xem bàn còn trống)
export const handleFilterByDate = async (req: Request, res: Response) => {
    try {
        // Lấy ngày cần kiểm tra (nếu không có thì lấy ngày hiện tại)
        const date = req.query.date ? new Date(req.query.date as string) : new Date();
        // Lọc thêm theo sức chứa (nếu có)
        const capacity = req.query.searchCapacity ? parseInt(req.query.searchCapacity as string) : undefined;

        // Gọi service để lấy danh sách bàn trống theo ngày và sức chứa
        const availableTables = await tableService.findAvailableTablesByDate(date, capacity);

        // Trả kết quả danh sách bàn trống
        res.status(200).json({ message: 'Lấy danh sách bàn trống theo ngày thành công', results: availableTables });
    } catch (error: any) {
        // Bắt lỗi máy chủ hoặc lỗi xử lý logic
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// 📘 Tạo mới một bàn ăn trong hệ thống
export const handleCreateTable = async (req: Request, res: Response) => {
    try {
        // Gửi dữ liệu sang service để tạo bàn mới
        const newTable = await tableService.createTable(req.body);

        // Phản hồi khi tạo thành công
        res.status(201).json({ message: 'Tạo bàn thành công', data: newTable });
    } catch (error: any) {
        // Nếu lỗi trùng số bàn (Prisma lỗi P2002 - unique constraint)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'Số bàn đã tồn tại.' });
        }
        // Lỗi khác (máy chủ, dữ liệu sai, v.v.)
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// 📘 Cập nhật thông tin bàn (ví dụ: số bàn, sức chứa, trạng thái)
export const handleUpdateTable = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id); // Lấy ID bàn từ URL
        // Gọi service để cập nhật dữ liệu bàn
        const updatedTable = await tableService.updateTable(id, req.body);

        // Phản hồi thành công
        res.status(200).json({ message: 'Cập nhật bàn thành công', data: updatedTable });
    } catch (error: any) {
        // Nếu trùng số bàn (unique constraint)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'Số bàn đã tồn tại.' });
        }
        // Lỗi khác
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// 📘 Xóa bàn ăn theo ID
export const handleDeleteTable = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id); // Lấy ID bàn từ params
        await tableService.deleteTable(id); // Gọi service để xóa bàn
        res.status(200).json({ message: 'Xóa bàn thành công' }); // Phản hồi kết quả
    } catch (error: any) {
        // Nếu có lỗi (ví dụ: bàn không tồn tại)
        res.status(400).json({ message: error.message });
    }
};
