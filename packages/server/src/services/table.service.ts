import prisma from '../models';
import { Prisma } from '@prisma/client';

/**
 * Lấy danh sách bàn cho trang quản trị
 * @param search - Tìm theo số bàn
 * @param capacity - Lọc theo sức chứa
 * @param page - Trang hiện tại
 * @param pageSize - Số lượng mục trên trang
 */
export const getTablesAdmin = async (search: string, capacity: number | undefined, page: number, pageSize: number) => {
    const where: Prisma.ban_anWhereInput = {};
    if (search) {
        where.so_ban = parseInt(search);
    }
    if (capacity) {
        where.suc_chua = capacity;
    }

    const [tables, total] = await prisma.$transaction([
        prisma.ban_an.findMany({
            where,
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.ban_an.count({ where }),
    ]);

    return { data: tables, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

/**
 * Lọc các bàn có sẵn theo ngày (cho khách hàng xem)
 * @param date - Ngày cần kiểm tra
 * @param capacity - Sức chứa yêu cầu (tùy chọn)
 */
export const findAvailableTablesByDate = async (date: Date, capacity?: number) => {
    // 1. Lấy tất cả các bàn (có thể lọc theo sức chứa nếu được cung cấp)
    const allTables = await prisma.ban_an.findMany({
        where: {
            suc_chua: capacity,
        },
    });

    // 2. Lấy ID của các bàn đã được đặt vào ngày đó
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reservedTables = await prisma.dat_ban.findMany({
        where: {
            ngay_dat_ban: { gte: startOfDay, lte: endOfDay },
            trang_thai: { in: [1, 2, 3, 4] }, // Các trạng thái chiếm bàn
        },
        select: { ban_an_id: true },
    });

    const reservedTableIds = new Set(reservedTables.map(r => r.ban_an_id).filter(id => id !== null));

    // 3. Kết hợp thông tin để xác định trạng thái
    const tableStatus = allTables.map(table => ({
        ...table,
        trang_thai: !reservedTableIds.has(table.id), // true = trống, false = đã đặt
    }));

    return tableStatus;
};


/**
 * Tạo bàn mới
 */
export const createTable = async (data: { number: number, capacity: number, status: boolean }) => {
    return prisma.ban_an.create({
        data: {
            so_ban: data.number,
            suc_chua: data.capacity,
            trang_thai: data.status,
        },
    });
};

/**
 * Cập nhật bàn
 */
export const updateTable = async (id: number, data: any) => {
    return prisma.ban_an.update({
        where: { id },
        data: {
            so_ban: data.number,
            suc_chua: data.capacity,
            trang_thai: data.status,
        },
    });
};

/**
 * Xóa bàn
 */
export const deleteTable = async (id: number) => {
    const hasReservations = await prisma.dat_ban.count({ where: { ban_an_id: id } });
    if (hasReservations > 0) {
        throw new Error('Không thể xóa bàn đang có lượt đặt.');
    }
    return prisma.ban_an.delete({ where: { id } });
};
