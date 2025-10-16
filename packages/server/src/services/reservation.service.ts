import prisma from '../models';
import { Prisma } from '@prisma/client';

/**
 * 🍽️ Tìm bàn trống phù hợp theo số khách và ngày đặt
 */
const findAvailableTable = async (reservationDate: Date, partySize: number): Promise<number> => {
    // 🧮 Xác định các mức sức chứa bàn có thể phù hợp
    let requiredCapacity: number[];
    if (partySize <= 2) requiredCapacity = [2, 4, 6, 8];
    else if (partySize <= 4) requiredCapacity = [4, 6, 8];
    else if (partySize <= 6) requiredCapacity = [6, 8];
    else requiredCapacity = [8];

    // 🪑 Lấy danh sách bàn có sức chứa phù hợp
    const potentialTables = await prisma.ban_an.findMany({
        where: { suc_chua: { in: requiredCapacity } },
        select: { id: true },
        orderBy: { suc_chua: 'asc' }, // Sắp xếp bàn nhỏ trước
    });
    const potentialTableIds = potentialTables.map(t => t.id);

    // 🕒 Tính thời gian bắt đầu và kết thúc trong ngày đặt
    const startOfDay = new Date(reservationDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reservationDate);
    endOfDay.setHours(23, 59, 59, 999);

    // ❌ Lấy danh sách các bàn đã được đặt trong ngày
    const reservedTables = await prisma.dat_ban.findMany({
        where: {
            ban_an_id: { in: potentialTableIds },
            ngay_dat_ban: { gte: startOfDay, lte: endOfDay },
            trang_thai: { notIn: [5] } // 5 = Đã hủy, nên loại ra
        },
        select: { ban_an_id: true }
    });
    const reservedTableIds = new Set(reservedTables.map(r => r.ban_an_id));

    // ✅ Tìm bàn đầu tiên chưa bị đặt
    const availableTableId = potentialTableIds.find(id => !reservedTableIds.has(id));

    // ⚠️ Nếu không còn bàn nào trống thì báo lỗi
    if (!availableTableId) {
        throw new Error('Rất tiếc, đã hết bàn trống phù hợp với yêu cầu của bạn.');
    }
    return availableTableId;
};

/**
 * 🧾 Tạo mới một đơn đặt bàn
 */
export const createReservation = async (data: any) => {
    // 📦 Tách danh sách sản phẩm (món ăn) và dữ liệu đặt bàn
    const { products, ...reservationData } = data;
    const partySize = parseInt(reservationData.party_size, 10);
    const reservationDate = new Date(reservationData.reservation_date);

    // 🔍 Tìm bàn trống phù hợp
    const tableId = await findAvailableTable(reservationDate, partySize);

    // 💰 Gói trong transaction để đảm bảo toàn bộ thao tác thành công hoặc rollback
    return prisma.$transaction(async (tx) => {
        // 🧾 Tạo bản ghi đặt bàn mới
        const newReservation = await tx.dat_ban.create({
            data: {
                ma_dat_ban: reservationData.reservation_code,
                khach_hang_id: reservationData.user_id,
                ho_ten_khach: reservationData.fullname,
                dien_thoai: reservationData.tel,
                email: reservationData.email,
                ngay_dat_ban: reservationDate,
                so_luong_khach: partySize,
                ghi_chu: reservationData.note,
                tong_tien: parseInt(reservationData.total_amount || 0, 10),
                tien_dat_coc: (parseInt(reservationData.total_amount || 0, 10)) * 0.3, // 30% tiền cọc
                trang_thai: 1, // 1 = Chờ xác nhận
                ban_an_id: tableId,
                khuyen_mai_id: reservationData.promotion_id
            },
        });

        // 🍲 Nếu có món ăn kèm theo, lưu chi tiết vào bảng chi_tiet_dat_ban
        if (products && Array.isArray(products) && products.length > 0) {
            await tx.chi_tiet_dat_ban.createMany({
                data: products.map((p: any) => ({
                    dat_ban_id: newReservation.id,
                    san_pham_id: p.product_id,
                    so_luong: p.quantity,
                    gia_tai_thoi_diem: p.price,
                })),
            });
        }

        // 🎟️ Giảm số lượng khuyến mãi nếu có dùng mã
        if (reservationData.promotion_id) {
            await tx.khuyen_mai.update({
                where: { id: reservationData.promotion_id, so_luong: { gt: 0 } },
                data: { so_luong: { decrement: 1 } },
            });
        }

        // ✅ Trả về thông tin đặt bàn mới
        return newReservation;
    });
};

/**
 * 🧮 Lấy danh sách đặt bàn cho trang quản trị
 */
export const getAdminReservations = async (filters: any) => {
    const { page, pageSize, searchName, searchPhone, status, reservation_code } = filters;

    // 🧩 Tạo điều kiện lọc động
    const where: Prisma.dat_banWhereInput = {
        ho_ten_khach: { contains: searchName },
        dien_thoai: { contains: searchPhone },
        ma_dat_ban: { contains: reservation_code },
    };
    if (status) {
        where.trang_thai = parseInt(status);
    }

    // ⚙️ Thực hiện 2 truy vấn song song:
    const [reservations, total] = await prisma.$transaction([
        prisma.dat_ban.findMany({
            where,
            include: {
                ban_an: { select: { so_ban: true } }, // 🔢 Lấy số bàn
                khuyen_mai: { select: { giam_gia: true, loai_giam_gia: true } }, // 💸 Thông tin khuyến mãi
                chi_tiet_dat_ban: {
                    include: {
                        san_pham: { select: { ten_san_pham: true } } // 🍽️ Tên món ăn
                    }
                }
            },
            orderBy: { id: 'desc' }, // ⬇️ Mới nhất lên đầu
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.dat_ban.count({ where }), // 🔢 Tổng số bản ghi
    ]);

    // 📤 Trả về dữ liệu và thông tin phân trang
    return { data: reservations, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

/**
 * 🍛 Admin thay đổi danh sách món ăn trong đơn đặt bàn
 */
export const changeDishes = async (reservationId: number, dishes: any[], totalAmount: number) => {
    return prisma.$transaction(async (tx) => {
        // 🧾 Cập nhật tổng tiền và đánh dấu đã đổi món
        await tx.dat_ban.update({
            where: { id: reservationId },
            data: {
                tong_tien: totalAmount,
                so_lan_doi: 2 // 🔁 2 = đã đổi (sửa lỗi kiểu dữ liệu)
            }
        });

        // ❌ Xóa hết món cũ
        await tx.chi_tiet_dat_ban.deleteMany({
            where: { dat_ban_id: reservationId }
        });

        // 🍽️ Thêm danh sách món mới
        if (dishes && dishes.length > 0) {
            await tx.chi_tiet_dat_ban.createMany({
                data: dishes.map((d: any) => ({
                    dat_ban_id: reservationId,
                    san_pham_id: d.product_id,
                    so_luong: d.quantity,
                    gia_tai_thoi_diem: d.price
                }))
            });
        }
    });
};

/**
 * 🔄 Cập nhật trạng thái đặt bàn & trạng thái bàn ăn tương ứng
 */
export const updateReservationStatus = async (id: number, status: number) => {
    // ⚙️ Cập nhật trạng thái đặt bàn
    const updatedReservation = await prisma.dat_ban.update({
        where: { id },
        data: { trang_thai: status },
    });

    // 🪑 Nếu có bàn đi kèm thì cập nhật trạng thái bàn
    if (updatedReservation.ban_an_id) {
        // ✅ 3 = Hoàn thành, 4 = Đang dùng → bàn có khách
        const isOccupied = [3, 4].includes(status);
        await prisma.ban_an.update({
            where: { id: updatedReservation.ban_an_id },
            data: { trang_thai: isOccupied ? 0 : 1 }, // 0 = có khách, 1 = trống
        });
    }
    return updatedReservation;
};
