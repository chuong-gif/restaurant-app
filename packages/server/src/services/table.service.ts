// packages/server/src/services/table.service.ts
import prisma from '../models';
import { Prisma, ban_an as Table } from '@prisma/client';

/**
 * 🪑 Lấy danh sách bàn ăn (Admin - có lọc, phân trang, join ảnh/video)
 */
export const getTablesAdmin = async (filters: {
    page: number;
    pageSize: number;
    searchSoBan?: number; // Lọc theo số bàn
    searchSucChua?: number; // Lọc theo sức chứa
    searchTang?: number; // Lọc theo tầng (MỚI)
}) => {
    const { page, pageSize, searchSoBan, searchSucChua, searchTang } = filters;

    const where: Prisma.ban_anWhereInput = {};
    if (searchSoBan !== undefined && !isNaN(searchSoBan)) {
        where.so_ban = searchSoBan;
    }
    if (searchSucChua !== undefined && !isNaN(searchSucChua)) {
        where.suc_chua = searchSucChua;
    }
    // === THÊM LỌC THEO TẦNG ===
    if (searchTang !== undefined && !isNaN(searchTang)) {
        where.tang = searchTang;
    }
    // ========================

    const [tables, total] = await prisma.$transaction([
        prisma.ban_an.findMany({
            where,
            include: { // === INCLUDE MEDIA FILES ===
                media_files_ban_an_anh_ban_idTomedia_files: { // Relation ảnh
                    select: { id: true, file_url: true }
                },
                media_files_ban_an_video_ban_idTomedia_files: { // Relation video
                    select: { id: true, file_url: true }
                }
            },
            // ==========================
            orderBy: { so_ban: 'asc' }, // Sắp xếp theo số bàn
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.ban_an.count({ where }),
    ]);

    return { data: tables, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

/**
 * ✨ Tạo bàn ăn mới (Thêm tang, anh_ban_id, video_ban_id)
 */
export const createTable = async (data: any): Promise<Table> => {
    // Kiểm tra trùng số bàn
    const existingTable = await prisma.ban_an.findUnique({ where: { so_ban: parseInt(data.so_ban, 10) } });
    if (existingTable) {
        throw new Error(`Số bàn ${data.so_ban} đã tồn tại.`);
    }

    return prisma.ban_an.create({
        data: {
            so_ban: parseInt(data.so_ban, 10),
            suc_chua: parseInt(data.suc_chua, 10),
            trang_thai: data.trang_thai === undefined ? true : Boolean(data.trang_thai),
            mo_ta_vi_tri: data.mo_ta_vi_tri,
            // === THÊM CÁC TRƯỜNG MỚI ===
            tang: data.tang ? parseInt(data.tang, 10) : undefined,
            anh_ban_id: data.anh_ban_id ? parseInt(data.anh_ban_id, 10) : undefined,
            video_ban_id: data.video_ban_id ? parseInt(data.video_ban_id, 10) : undefined,
            // =========================
        },
    });
};

/**
 * 🛠️ Cập nhật thông tin bàn ăn (Thêm tang, anh_ban_id, video_ban_id)
 */
export const updateTable = async (id: number, data: any): Promise<Table> => {
    const existing = await prisma.ban_an.findUnique({ where: { id } });
    if (!existing) {
        throw new Error('Bàn ăn không tồn tại.');
    }

    // Kiểm tra trùng số bàn (nếu số bàn thay đổi)
    if (data.so_ban && parseInt(data.so_ban, 10) !== existing.so_ban) {
        const conflictingTable = await prisma.ban_an.findUnique({ where: { so_ban: parseInt(data.so_ban, 10) } });
        if (conflictingTable) {
            throw new Error(`Số bàn ${data.so_ban} đã tồn tại.`);
        }
    }

    const dataToUpdate: any = {};
    if (data.so_ban !== undefined) dataToUpdate.so_ban = parseInt(data.so_ban, 10);
    if (data.suc_chua !== undefined) dataToUpdate.suc_chua = parseInt(data.suc_chua, 10);
    if (data.trang_thai !== undefined) dataToUpdate.trang_thai = Boolean(data.trang_thai);
    if (data.mo_ta_vi_tri !== undefined) dataToUpdate.mo_ta_vi_tri = data.mo_ta_vi_tri;
    // === THÊM CÁC TRƯỜNG MỚI ===
    if (data.tang !== undefined) dataToUpdate.tang = data.tang ? parseInt(data.tang, 10) : undefined;
    if (data.anh_ban_id !== undefined) dataToUpdate.anh_ban_id = data.anh_ban_id ? parseInt(data.anh_ban_id, 10) : undefined;
    if (data.video_ban_id !== undefined) dataToUpdate.video_ban_id = data.video_ban_id ? parseInt(data.video_ban_id, 10) : undefined;
    // =========================

    return prisma.ban_an.update({
        where: { id },
        data: dataToUpdate,
    });
};

/**
 * ❌ Xóa bàn ăn (kèm kiểm tra ràng buộc)
 */
export const deleteTable = async (id: number): Promise<void> => {
    // Kiểm tra bàn có trong đơn đặt bàn nào chưa hoàn thành/hủy không
    const activeReservation = await prisma.dat_ban.findFirst({
        where: {
            ban_an_id: id,
            trang_thai: true // only active reservations
        }
    });
    if (activeReservation) {
        throw new Error('Không thể xóa bàn đang có trong đơn đặt bàn chưa hoàn thành hoặc chưa hủy.');
    }

    // Xóa các liên kết đặt bàn đã hoàn thành/hủy (nếu cần, hoặc để NULL)
    // await prisma.dat_ban.updateMany({ where: { ban_an_id: id }, data: { ban_an_id: null }});

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

    // Chỉ lấy bàn đang trống (trang_thai = 1) và đúng sức chứa
    const potentialTables = await prisma.ban_an.findMany({
        where: {
            suc_chua: { in: requiredCapacity },
            trang_thai: true
        },
        include: { // Include ảnh/video
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
            trang_thai: true // only active reservations
        },
        select: { ban_an_id: true }
    });
    const reservedTableIds = new Set(reservedTables.map(r => r.ban_an_id).filter(id => id !== null));

    // Lọc ra các bàn không nằm trong danh sách đã đặt
    const availableTables = potentialTables.filter(table => !reservedTableIds.has(table.id));

    return availableTables;
};