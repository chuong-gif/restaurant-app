// packages/server/src/services/table.service.ts
import prisma from '../models';
import { Prisma, ban_an as Table } from '@prisma/client';
// Import ReservationStatus nếu file này có logic liên quan (như getAvailableTablesByDate)
import { ReservationStatus } from './reservation.service'; // Đảm bảo import này đúng

/**
 * 🪑 Lấy danh sách bàn ăn (Admin - có lọc, phân trang, join ảnh/video)
 */
export const getTablesAdmin = async (filters: {
    page: number;
    pageSize: number;
    searchSoBan?: number;
    searchSucChua?: number;
    searchTang?: number;
}) => {
    const { page, pageSize, searchSoBan, searchSucChua, searchTang } = filters;

    const where: Prisma.ban_anWhereInput = {};
    if (searchSoBan !== undefined && !isNaN(searchSoBan)) {
        where.so_ban = searchSoBan;
    }
    if (searchSucChua !== undefined && !isNaN(searchSucChua)) {
        where.suc_chua = searchSucChua;
    }
    if (searchTang !== undefined && !isNaN(searchTang)) {
        where.tang = searchTang;
    }

    const [tables, total] = await prisma.$transaction([
        prisma.ban_an.findMany({
            where,
            include: {
                media_files_ban_an_anh_ban_idTomedia_files: { // Relation ảnh
                    select: { id: true, file_url: true }
                },
                media_files_ban_an_video_ban_idTomedia_files: { // Relation video
                    select: { id: true, file_url: true }
                }
            },
            orderBy: { so_ban: 'asc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.ban_an.count({ where }),
    ]);

    return { data: tables, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

/**
 * ✨ Tạo bàn ăn mới (Sửa: Dùng undefined thay null)
 */
export const createTable = async (data: any): Promise<Table> => {
    const existingTable = await prisma.ban_an.findUnique({ where: { so_ban: parseInt(data.so_ban, 10) } });
    if (existingTable) {
        throw new Error(`Số bàn ${data.so_ban} đã tồn tại.`);
    }

    const createData: Prisma.ban_anUncheckedCreateInput = {
        so_ban: parseInt(data.so_ban, 10),
        suc_chua: parseInt(data.suc_chua, 10),
        trang_thai: data.trang_thai === undefined ? true : Boolean(data.trang_thai),
        mo_ta_vi_tri: data.mo_ta_vi_tri || undefined, // Sửa: Dùng undefined
        // === SỬA: DÙNG undefined ===
        tang: data.tang ? parseInt(data.tang, 10) : undefined,
        anh_ban_id: data.anh_ban_id ? parseInt(data.anh_ban_id, 10) : undefined, // Prisma UncheckedCreateInput thường chấp nhận undefined
        video_ban_id: data.video_ban_id ? parseInt(data.video_ban_id, 10) : undefined,
        // ========================
    };

    return prisma.ban_an.create({
        data: createData,
    });
};

/**
 * 🛠️ Cập nhật thông tin bàn ăn (Sửa: Dùng undefined thay null)
 */
export const updateTable = async (id: number, data: any): Promise<Table> => {
    const existing = await prisma.ban_an.findUnique({ where: { id } });
    if (!existing) { /* ... */ }
    if (data.so_ban && parseInt(data.so_ban, 10) !== existing!.so_ban) { /* ... */ }

    const dataToUpdate: Prisma.ban_anUpdateInput = {};
    if (data.so_ban !== undefined) dataToUpdate.so_ban = parseInt(data.so_ban, 10);
    if (data.suc_chua !== undefined) dataToUpdate.suc_chua = parseInt(data.suc_chua, 10);
    if (data.trang_thai !== undefined) dataToUpdate.trang_thai = Boolean(data.trang_thai);
    if (data.mo_ta_vi_tri !== undefined) dataToUpdate.mo_ta_vi_tri = data.mo_ta_vi_tri || undefined; // Sửa: Dùng undefined

    // === SỬA: DÙNG undefined ===
    if (data.tang !== undefined) dataToUpdate.tang = data.tang ? parseInt(data.tang, 10) : undefined;
    // ========================

    // Xử lý ảnh (anh_ban_id) - giữ nguyên logic connect/disconnect
    if (data.anh_ban_id !== undefined) {
        if (data.anh_ban_id === null || data.anh_ban_id === undefined) { // Check cả null và undefined từ frontend
            dataToUpdate.media_files_ban_an_anh_ban_idTomedia_files = { disconnect: true };
        } else {
            dataToUpdate.media_files_ban_an_anh_ban_idTomedia_files = { connect: { id: parseInt(data.anh_ban_id, 10) } };
        }
    }

    // Xử lý video (video_ban_id) - giữ nguyên logic connect/disconnect
    if (data.video_ban_id !== undefined) {
        if (data.video_ban_id === null || data.video_ban_id === undefined) { // Check cả null và undefined
            dataToUpdate.media_files_ban_an_video_ban_idTomedia_files = { disconnect: true };
        } else {
            dataToUpdate.media_files_ban_an_video_ban_idTomedia_files = { connect: { id: parseInt(data.video_ban_id, 10) } };
        }
    }

    return prisma.ban_an.update({
        where: { id },
        data: dataToUpdate,
    });
};

/**
 * ❌ Xóa bàn ăn (kèm kiểm tra ràng buộc)
 */
export const deleteTable = async (id: number): Promise<void> => {
    const activeReservation = await prisma.dat_ban.findFirst({
        where: {
            ban_an_id: id,
            trang_thai: { notIn: [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED] } // 0=Hủy, 5=Hoàn thành
        }
    });
    if (activeReservation) {
        throw new Error('Không thể xóa bàn đang có trong đơn đặt bàn chưa hoàn thành hoặc chưa hủy.');
    }

    await prisma.ban_an.delete({ where: { id } });
};

/**
 * ✅ Lấy danh sách bàn trống theo ngày và sức chứa (Cho Client)
 */
export const getAvailableTablesByDate = async (date: Date, partySize: number): Promise<Table[]> => {
    let requiredCapacity: number[];
    if (partySize <= 2) requiredCapacity = [2, 4, 6, 8];
    else if (partySize <= 4) requiredCapacity = [4, 6, 8];
    else if (partySize <= 6) requiredCapacity = [6, 8];
    else requiredCapacity = [8];

    const potentialTables = await prisma.ban_an.findMany({
        where: {
            suc_chua: { in: requiredCapacity },
            trang_thai: true // ban_an.trang_thai là Boolean
        },
        include: {
            media_files_ban_an_anh_ban_idTomedia_files: { select: { file_url: true } },
            media_files_ban_an_video_ban_idTomedia_files: { select: { file_url: true } }
        },
        orderBy: { so_ban: 'asc' },
    });
    const potentialTableIds = potentialTables.map(t => t.id);

    const startTime = new Date(date.getTime() - 2 * 60 * 60 * 1000);
    const endTime = new Date(date.getTime() + 2 * 60 * 60 * 1000);

    const reservedTables = await prisma.dat_ban.findMany({
        where: {
            ban_an_id: { in: potentialTableIds },
            ngay_dat_ban: { gte: startTime, lte: endTime },
            trang_thai: { notIn: [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED] }
        },
        select: { ban_an_id: true }
    });
    const reservedTableIds = new Set(reservedTables.map(r => r.ban_an_id).filter(id => id !== null));

    const availableTables = potentialTables.filter(table => !reservedTableIds.has(table.id));

    return availableTables;
};