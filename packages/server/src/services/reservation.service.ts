import prisma from '../models';
import { Prisma } from '@prisma/client';

/**
 * Finds an available table based on party size and date.
 */
const findAvailableTable = async (reservationDate: Date, partySize: number): Promise<number> => {
    let requiredCapacity: number[];
    if (partySize <= 2) requiredCapacity = [2, 4, 6, 8];
    else if (partySize <= 4) requiredCapacity = [4, 6, 8];
    else if (partySize <= 6) requiredCapacity = [6, 8];
    else requiredCapacity = [8];

    const potentialTables = await prisma.ban_an.findMany({
        where: { suc_chua: { in: requiredCapacity } },
        select: { id: true },
        orderBy: { suc_chua: 'asc' },
    });
    const potentialTableIds = potentialTables.map(t => t.id);

    const startOfDay = new Date(reservationDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reservationDate);
    endOfDay.setHours(23, 59, 59, 999);

    const reservedTables = await prisma.dat_ban.findMany({
        where: {
            ban_an_id: { in: potentialTableIds },
            ngay_dat_ban: { gte: startOfDay, lte: endOfDay },
            trang_thai: { notIn: [5] } // Assuming 5 is the "Cancelled" status
        },
        select: { ban_an_id: true }
    });
    const reservedTableIds = new Set(reservedTables.map(r => r.ban_an_id));

    const availableTableId = potentialTableIds.find(id => !reservedTableIds.has(id));

    if (!availableTableId) {
        throw new Error('Rất tiếc, đã hết bàn trống phù hợp với yêu cầu của bạn.');
    }
    return availableTableId;
};

/**
 * Creates a new reservation.
 */
export const createReservation = async (data: any) => {
    const { products, ...reservationData } = data;
    const partySize = parseInt(reservationData.party_size, 10);
    const reservationDate = new Date(reservationData.reservation_date);

    const tableId = await findAvailableTable(reservationDate, partySize);

    return prisma.$transaction(async (tx) => {
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
                tien_dat_coc: (parseInt(reservationData.total_amount || 0, 10)) * 0.3,
                trang_thai: 1, // 1: Pending Confirmation
                ban_an_id: tableId,
                khuyen_mai_id: reservationData.promotion_id
            },
        });

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

        if (reservationData.promotion_id) {
            await tx.khuyen_mai.update({
                where: { id: reservationData.promotion_id, so_luong: { gt: 0 } },
                data: { so_luong: { decrement: 1 } },
            });
        }

        return newReservation;
    });
};

/**
 * Gets reservations for the admin panel.
 */
export const getAdminReservations = async (filters: any) => {
    const { page, pageSize, searchName, searchPhone, status, reservation_code } = filters;
    const where: Prisma.dat_banWhereInput = {
        ho_ten_khach: { contains: searchName },
        dien_thoai: { contains: searchPhone },
        ma_dat_ban: { contains: reservation_code },
    };
    if (status) {
        where.trang_thai = parseInt(status);
    }

    const [reservations, total] = await prisma.$transaction([
        prisma.dat_ban.findMany({
            where,
            include: {
                ban_an: { select: { so_ban: true } },
                khuyen_mai: { select: { giam_gia: true, loai_giam_gia: true } },
                chi_tiet_dat_ban: {
                    include: {
                        san_pham: { select: { ten_san_pham: true } }
                    }
                }
            },
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.dat_ban.count({ where }),
    ]);

    return { data: reservations, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

/**
 * Admin changes dishes for a reservation.
 */
export const changeDishes = async (reservationId: number, dishes: any[], totalAmount: number) => {
    return prisma.$transaction(async (tx) => {
        await tx.dat_ban.update({
            where: { id: reservationId },
            data: {
                tong_tien: totalAmount,
                so_lan_doi: 2 // SỬA LỖI: Gán số 2 (đã đổi) thay vì false
            }
        });

        await tx.chi_tiet_dat_ban.deleteMany({
            where: { dat_ban_id: reservationId }
        });

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
 * Updates the status of a reservation and the corresponding table.
 */
export const updateReservationStatus = async (id: number, status: number) => {
    const updatedReservation = await prisma.dat_ban.update({
        where: { id },
        data: { trang_thai: status },
    });

    if (updatedReservation.ban_an_id) {
        // Occupied statuses: 3 (Completed), 4 (Checked-in).
        const isOccupied = [3, 4].includes(status);
        await prisma.ban_an.update({
            where: { id: updatedReservation.ban_an_id },
            // SỬA LỖI: Chuyển boolean thành số (0 = có khách, 1 = trống)
            data: { trang_thai: isOccupied ? 0 : 1 },
        });
    }
    return updatedReservation;
};

