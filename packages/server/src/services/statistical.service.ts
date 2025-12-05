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
export const getMonthlyFinancials = async (year: number) => {
    // 1. Lấy Doanh thu (Từ đơn đặt bàn hoàn thành)
    const completedReservations = await prisma.dat_ban.findMany({
        where: {
            trang_thai: ReservationStatus.COMPLETED,
            ngay_dat_ban: {
                gte: new Date(`${year}-01-01T00:00:00.000Z`),
                lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
            },
        },
        select: { tong_tien: true, ngay_dat_ban: true }
    });

    // 2. Lấy Chi phí (Từ phiếu nhập kho)
    const importReceipts = await prisma.phieu_nhap.findMany({
        where: {
            ngay_nhap: {
                gte: new Date(`${year}-01-01T00:00:00.000Z`),
                lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
            }
        },
        select: { tong_tien: true, ngay_nhap: true }
    });

    const revenue = Array(12).fill(0);
    const cost = Array(12).fill(0);
    const profit = Array(12).fill(0);

    // Cộng dồn Doanh thu
    for (const res of completedReservations) {
        const month = res.ngay_dat_ban.getMonth();
        if (res.tong_tien) revenue[month] += res.tong_tien;
    }

    // Cộng dồn Chi phí
    for (const imp of importReceipts) {
        const month = imp.ngay_nhap.getMonth();
        if (imp.tong_tien) cost[month] += imp.tong_tien;
    }

    // Tính Lợi nhuận
    for (let i = 0; i < 12; i++) {
        profit[i] = revenue[i] - cost[i];
    }

    return { revenue, cost, profit };
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

/**
 * 📉 Lấy thống kê chi phí nhập hàng và giá trị tồn kho
 */
export const getInventoryStats = async () => {
    // 1. Tính tổng giá trị tồn kho hiện tại (Số lượng * Giá nhập cuối)
    const materials = await prisma.nguyen_lieu.findMany({
        select: { so_luong_ton: true, gia_nhap_cuoi: true }
    });

    const currentInventoryValue = materials.reduce((sum, item) => {
        return sum + (item.so_luong_ton * (item.gia_nhap_cuoi || 0));
    }, 0);

    // 2. Tính tổng chi phí nhập hàng (trong tháng này)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const importCostMonth = await prisma.phieu_nhap.aggregate({
        where: {
            ngay_nhap: { gte: startOfMonth }
        },
        _sum: { tong_tien: true }
    });

    return {
        currentInventoryValue, // Giá trị tài sản trong kho
        importCostThisMonth: importCostMonth._sum.tong_tien || 0 // Tiền chi mua hàng tháng này
    };
};

/**
 * ⚠️ Lấy danh sách nguyên liệu sắp hết hàng (Low Stock)
 */
export const getLowStockMaterials = async () => {
    // Tìm các nguyên liệu có tồn kho <= mức cảnh báo
    // VÀ phải là nguyên liệu đang hoạt động (trang_thai = true)
    return await prisma.nguyen_lieu.findMany({
        where: {
            trang_thai: true,
            so_luong_ton: {
                lte: prisma.nguyen_lieu.fields.muc_canh_bao // So sánh cột với cột
            }
        },
        select: {
            id: true,
            ten_nguyen_lieu: true,
            so_luong_ton: true,
            muc_canh_bao: true,
            don_vi_tinh: true
        },
        orderBy: { so_luong_ton: 'asc' }, // Ưu tiên cái nào còn ít nhất lên đầu
        take: 5 // Chỉ lấy top 5 để hiện lên Dashboard cho đẹp
    });
};

// === THÊM MỚI: TOP SẢN PHẨM BÁN CHẠY ===
export const getTopSellingProducts = async () => {
    // Group by sản phẩm trong chi tiết đặt bàn của các đơn đã hoàn thành
    const topProducts = await prisma.chi_tiet_dat_ban.groupBy({
        by: ['san_pham_id'],
        where: {
            dat_ban: {
                trang_thai: ReservationStatus.COMPLETED
            }
        },
        _sum: {
            so_luong: true
        },
        orderBy: {
            _sum: {
                so_luong: 'desc'
            }
        },
        take: 5
    });

    // Lấy tên sản phẩm từ ID
    const enrichedProducts = await Promise.all(topProducts.map(async (item) => {
        const product = await prisma.san_pham.findUnique({
            where: { id: item.san_pham_id },
            select: { ten_san_pham: true }
        });
        return {
            name: product?.ten_san_pham || 'Sản phẩm đã xóa',
            value: item._sum.so_luong || 0
        };
    }));

    return enrichedProducts;
};