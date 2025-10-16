import prisma from '../models';
import { Prisma } from '@prisma/client';

/**
 * 📋 Lấy danh sách bàn (trang quản trị)
 * @param search - 🔍 Tìm theo số bàn
 * @param capacity - ⚙️ Lọc theo sức chứa
 * @param page - 📄 Trang hiện tại
 * @param pageSize - 📦 Số lượng mục trên mỗi trang
 */
export const getTablesAdmin = async (search: string, capacity: number | undefined, page: number, pageSize: number) => {
    // 🧩 Tạo điều kiện lọc (where)
    const where: Prisma.ban_anWhereInput = {};

    // 🔎 Nếu người dùng nhập số bàn -> lọc theo số bàn
    if (search) {
        where.so_ban = parseInt(search);
    }

    // 🪑 Nếu người dùng chọn sức chứa -> lọc theo sức chứa
    if (capacity) {
        where.suc_chua = capacity;
    }

    // ⚡ Gọi transaction để thực hiện 2 truy vấn song song: lấy danh sách và tổng số
    const [tables, total] = await prisma.$transaction([
        prisma.ban_an.findMany({
            where,                      // ⚙️ Áp dụng điều kiện lọc
            orderBy: { id: 'desc' },    // ⬇️ Sắp xếp theo ID giảm dần
            skip: (page - 1) * pageSize, // ⏭️ Bỏ qua các bản ghi trang trước
            take: pageSize,              // 📦 Giới hạn số bản ghi trên trang
        }),
        prisma.ban_an.count({ where }),  // 🔢 Đếm tổng số bản ghi
    ]);

    // 📤 Trả về dữ liệu cùng thông tin phân trang
    return { data: tables, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

/**
 * 🔍 Lọc danh sách bàn có sẵn theo ngày (cho khách hàng)
 * @param date - 📅 Ngày muốn kiểm tra
 * @param capacity - ⚙️ Sức chứa mong muốn (tùy chọn)
 */
export const findAvailableTablesByDate = async (date: Date, capacity?: number) => {
    // 🪑 1. Lấy toàn bộ bàn (có thể lọc theo sức chứa)
    const allTables = await prisma.ban_an.findMany({
        where: {
            suc_chua: capacity, // ⚙️ Nếu có cung cấp sức chứa, lọc theo nó
        },
    });

    // 🕓 2. Xác định thời gian bắt đầu và kết thúc của ngày đó
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // 📑 Lấy danh sách bàn đã được đặt trong ngày đó
    const reservedTables = await prisma.dat_ban.findMany({
        where: {
            ngay_dat_ban: { gte: startOfDay, lte: endOfDay }, // 📅 Giới hạn trong ngày
            trang_thai: { in: [1, 2, 3, 4] }, // 🚫 Các trạng thái chiếm bàn
        },
        select: { ban_an_id: true },
    });

    // 🧱 Chuyển thành tập hợp (Set) ID các bàn đã được đặt
    const reservedTableIds = new Set(
        reservedTables.map(r => r.ban_an_id).filter(id => id !== null)
    );

    // ✅ 3. Kết hợp để gán trạng thái trống / đã đặt cho từng bàn
    const tableStatus = allTables.map(table => ({
        ...table,
        trang_thai: !reservedTableIds.has(table.id), // true = trống, false = đã đặt
    }));

    // 📤 Trả về danh sách bàn cùng trạng thái
    return tableStatus;
};

/**
 * ➕ Tạo bàn mới
 * ⚠️ SỬA LỖI: status là number (Int) thay vì boolean
 */
export const createTable = async (data: { number: number, capacity: number, status: number }) => {
    return prisma.ban_an.create({
        data: {
            so_ban: data.number,   // 🏷️ Số bàn
            suc_chua: data.capacity, // 👥 Sức chứa
            trang_thai: data.status, // ⚙️ Trạng thái (0 = có khách, 1 = trống)
        },
    });
};

/**
 * 🛠️ Cập nhật thông tin bàn
 */
export const updateTable = async (id: number, data: any) => {
    return prisma.ban_an.update({
        where: { id }, // 🔑 Xác định bàn cần sửa
        data: {
            so_ban: data.number,     // 🏷️ Cập nhật số bàn
            suc_chua: data.capacity, // 👥 Cập nhật sức chứa
            trang_thai: data.status, // ⚙️ Cập nhật trạng thái
        },
    });
};

/**
 * ❌ Xóa bàn ăn
 */
export const deleteTable = async (id: number) => {
    // 🕵️‍♂️ Kiểm tra xem bàn có đang được đặt không
    const hasReservations = await prisma.dat_ban.count({ where: { ban_an_id: id } });

    if (hasReservations > 0) {
        // 🚫 Nếu bàn có đặt -> không được xóa
        throw new Error('Không thể xóa bàn đang có lượt đặt.');
    }

    // 🗑️ Nếu không có đặt -> xóa bàn
    return prisma.ban_an.delete({ where: { id } });
};
