// packages/server/src/services/statistical.service.ts
import prisma from '../models';
import { Prisma } from '@prisma/client';
import { ReservationStatus } from './reservation.service'; // Import mã trạng thái
import { nguoi_dung_loai_nguoi_dung } from '@prisma/client';


/**
 * 📊 Lấy các số liệu thống kê tổng quan (4 ô)
 */
export const getOverviewStats = async () => {
    // Chạy song song 4 truy vấn đếm
    const [userCount, productCount, blogCount, reservationCount] = await prisma.$transaction([
        prisma.nguoi_dung.count({
            where: {
                loai_nguoi_dung: nguoi_dung_loai_nguoi_dung.Khach_Hang, // ✅ dùng enum
                trang_thai: true,
            },
        }),

        prisma.san_pham.count({
            where: { trang_thai: true } // Chỉ đếm sản phẩm active
        }),
        prisma.bai_viet.count(), // Đếm tất cả bài viết
        prisma.dat_ban.count({
            where: { trang_thai: { notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW] } } // Đếm đơn hợp lệ
        }),
    ]);

    return {
        userCount,
        productCount,
        blogCount,
        reservationCount,
    };
};

/**
 * 📈 Lấy dữ liệu doanh thu theo 12 tháng trong năm
 * (Chỉ tính các đơn đã HOÀN THÀNH - status = 5)
 */
export const getMonthlyRevenue = async (year: number) => {
    // Lấy tất cả đơn hàng đã hoàn thành trong năm
    const completedReservations = await prisma.dat_ban.findMany({
        where: {
            trang_thai: ReservationStatus.COMPLETED, // Chỉ tính đơn HOÀN THÀNH
            ngay_dat_ban: {
                gte: new Date(`${year}-01-01T00:00:00.000Z`),
                lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
            },
        },
        select: {
            tong_tien: true, // Chỉ lấy tổng tiền
            ngay_dat_ban: true, // Lấy ngày đặt
        }
    });

    // Khởi tạo mảng 12 tháng với doanh thu = 0
    const monthlyRevenue = Array(12).fill(0);

    // Tính toán doanh thu cho từng tháng
    for (const reservation of completedReservations) {
        const monthIndex = reservation.ngay_dat_ban.getMonth(); // 0 = Tháng 1, 11 = Tháng 12
        if (reservation.tong_tien) {
            monthlyRevenue[monthIndex] += reservation.tong_tien;
        }
    }

    return monthlyRevenue;
};

/**
 * 🥧 Lấy dữ liệu thống kê trạng thái đơn hàng (theo tháng hoặc cả năm)
 */
export const getReservationStatusStats = async (year: number, month?: number) => {

    const where: Prisma.dat_banWhereInput = {
        ngay_dat_ban: {
            gte: new Date(`${year}-${month ? String(month).padStart(2, '0') : '01'}-01T00:00:00.000Z`),
            lt: month
                ? (month === 12 ? new Date(`${year + 1}-01-01T00:00:00.000Z`) : new Date(`${year}-${String(month + 1).padStart(2, '0')}-01T00:00:00.000Z`))
                : new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
    };

    // Đếm số lượng đơn theo nhóm trạng thái
    const statusCounts = await prisma.dat_ban.groupBy({
        by: ['trang_thai'],
        where: where,
        _count: {
            trang_thai: true,
        },
    });

    // Chuyển đổi sang format { "Tên trạng thái": số lượng }
    const formattedCounts: { [key: string]: number } = {};
    const statusMap: { [key: number]: string } = {
        [ReservationStatus.CANCELLED]: 'Đã hủy',
        [ReservationStatus.PENDING_CONFIRMATION]: 'Chờ xác nhận',
        [ReservationStatus.CONFIRMED_DEPOSIT_PAID]: 'Đã cọc',
        [ReservationStatus.CHECKED_IN]: 'Đang ăn',
        [ReservationStatus.PENDING_PAYMENT]: 'Chờ thanh toán',
        [ReservationStatus.COMPLETED]: 'Hoàn thành',
        [ReservationStatus.NO_SHOW]: 'Không đến',
    };

    for (const group of statusCounts) {
        const statusName = statusMap[group.trang_thai] || `Trạng thái ${group.trang_thai}`;
        formattedCounts[statusName] = group._count.trang_thai;
    }

    return formattedCounts;
};

/**
 * 💰 Lấy doanh thu và số lượng đơn hàng theo khoảng ngày tùy chọn
 */
export const getRevenueByDateRange = async (startDate: Date, endDate: Date) => {
    // Đảm bảo endDate bao gồm cả ngày cuối cùng
    endDate.setHours(23, 59, 59, 999);

    const result = await prisma.dat_ban.aggregate({
        where: {
            trang_thai: ReservationStatus.COMPLETED, // Chỉ tính đơn HOÀN THÀNH
            ngay_dat_ban: {
                gte: startDate,
                lte: endDate,
            },
        },
        _sum: {
            tong_tien: true, // Tính tổng doanh thu
        },
        _count: {
            id: true, // Đếm số lượng đơn
        },
    });

    return {
        totalRevenue: result._sum.tong_tien || 0,
        orderCount: result._count.id || 0,
    };
};