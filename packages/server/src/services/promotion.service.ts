import prisma from '../models';
import { Prisma } from '@prisma/client';

/**
 * 📜 Lấy danh sách khuyến mãi với phân trang và tìm kiếm
 * @param search - 🔍 Từ khóa tìm kiếm theo mã khuyến mãi
 * @param page - 📄 Trang hiện tại
 * @param pageSize - 📦 Số lượng mục trên mỗi trang
 */
export const getPromotions = async (search: string, page: number, pageSize: number) => {
    // 🧩 Tạo điều kiện tìm kiếm: lọc theo mã khuyến mãi có chứa từ khóa
    const where: Prisma.khuyen_maiWhereInput = {
        ma_khuyen_mai: {
            contains: search,
        },
    };

    // ⚙️ Dùng transaction để thực hiện 2 truy vấn song song:
    // 1️⃣ Lấy danh sách khuyến mãi theo điều kiện, có sắp xếp và phân trang
    // 2️⃣ Đếm tổng số khuyến mãi để tính tổng số trang
    const [promotions, total] = await prisma.$transaction([
        prisma.khuyen_mai.findMany({
            where,
            orderBy: { id: 'desc' },      // ⬇️ Sắp xếp theo ID giảm dần (mới nhất lên đầu)
            skip: (page - 1) * pageSize,  // ⏩ Bỏ qua các bản ghi trước trang hiện tại
            take: pageSize,               // 📦 Giới hạn số bản ghi trên mỗi trang
        }),
        prisma.khuyen_mai.count({ where }), // 🔢 Đếm tổng số kết quả phù hợp
    ]);

    // 📤 Trả về dữ liệu kèm thông tin phân trang
    return {
        data: promotions,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
    };
};

/**
 * 🧾 Lấy thông tin chi tiết của một khuyến mãi theo ID
 * @param id - 🆔 ID của khuyến mãi
 */
export const getPromotionById = async (id: number) => {
    // 🔍 Tìm khuyến mãi theo ID duy nhất
    const promotion = await prisma.khuyen_mai.findUnique({ where: { id } });

    // ⚠️ Nếu không tìm thấy, báo lỗi
    if (!promotion) throw new Error('Khuyến mãi không tồn tại.');

    // ✅ Trả về thông tin khuyến mãi
    return promotion;
};

/**
 * 🆕 Tạo khuyến mãi mới
 * @param data - 📦 Dữ liệu dùng để tạo khuyến mãi
 */
export const createPromotion = async (data: {
    code_name: string;
    discount: number;
    quantity: number;
    valid_from: Date;
    valid_to: Date;
    type: boolean;
}) => {
    // 🏗️ Gọi Prisma để tạo bản ghi khuyến mãi mới trong DB
    return prisma.khuyen_mai.create({
        data: {
            ma_khuyen_mai: data.code_name,   // 🔤 Mã khuyến mãi
            giam_gia: data.discount,         // 💰 Mức giảm giá
            so_luong: data.quantity,         // 📦 Số lượng khuyến mãi
            ngay_hieu_luc: data.valid_from,  // ⏰ Ngày bắt đầu hiệu lực
            ngay_ket_thuc: data.valid_to,    // ⏳ Ngày hết hạn
            loai_giam_gia: !data.type,        // ⚖️ Kiểu giảm (theo % hay giá cố định)
        },
    });
};

/**
 * 🛠️ Cập nhật thông tin khuyến mãi
 * @param id - 🆔 ID của khuyến mãi cần cập nhật
 * @param data - ✏️ Dữ liệu cập nhật mới
 */
export const updatePromotion = async (id: number, data: any) => {
    // 🔧 Cập nhật bản ghi theo ID, chỉ thay đổi các trường được truyền vào
    return prisma.khuyen_mai.update({
        where: { id },
        data: {
            ma_khuyen_mai: data.code_name,
            giam_gia: data.discount,
            so_luong: data.quantity,
            // 🕐 Chuyển đổi ngày sang đối tượng Date (nếu có)
            ngay_hieu_luc: data.valid_from ? new Date(data.valid_from) : undefined,
            ngay_ket_thuc: data.valid_to ? new Date(data.valid_to) : undefined,
            loai_giam_gia: data.type !== undefined ? !data.type : undefined,
        },
    });
};

/**
 * 🗑️ Xóa khuyến mãi khỏi hệ thống
 * @param id - 🆔 ID của khuyến mãi cần xóa
 */
export const deletePromotion = async (id: number) => {
    // ❌ Xóa bản ghi khuyến mãi theo ID
    return prisma.khuyen_mai.delete({ where: { id } });
};

/**
 * ✅ Kiểm tra mã khuyến mãi có hợp lệ không
 */
export const checkPromotion = async (promo_code: string, total_amount: number) => {
    const now = new Date();

    // Tìm mã khuyến mãi
    const promotion = await prisma.khuyen_mai.findFirst({
        where: {
            ma_khuyen_mai: promo_code,
            so_luong: { gt: 0 },
            ngay_hieu_luc: { lte: now },
            ngay_ket_thuc: { gte: now },
        },
    });

    if (!promotion) {
        return {
            valid: false,
            message: 'Mã khuyến mãi không hợp lệ, đã hết hạn hoặc hết số lượng.'
        };
    }

    // Tính toán số tiền giảm
    let discount_amount = 0;

    // VÌ ĐÃ ĐẢO NGƯỢC KHI LƯU (createPromotion), nên:
    // - promotion.loai_giam_gia = true: là phần trăm (frontend gửi false)
    // - promotion.loai_giam_gia = false: là số tiền (frontend gửi true)

    if (promotion.loai_giam_gia === true) { // true = phần trăm
        discount_amount = (total_amount * promotion.giam_gia) / 100;
    } else { // false = số tiền
        discount_amount = promotion.giam_gia;
    }

    return {
        valid: true,
        discount_amount: Math.round(discount_amount),
        // ĐẢO NGƯỢC LẠI KHI TRẢ VỀ cho frontend
        discount_type: !promotion.loai_giam_gia, // false->true, true->false
        promo_id: promotion.id,
        message: 'Mã khuyến mãi hợp lệ'
    };
};
