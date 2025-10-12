import prisma from '../models';
import { Prisma } from '@prisma/client';

/**
 * Lấy danh sách khuyến mãi với phân trang và tìm kiếm
 * @param search - Từ khóa tìm kiếm theo mã khuyến mãi
 * @param page - Trang hiện tại
 * @param pageSize - Số lượng mục trên mỗi trang
 */
export const getPromotions = async (search: string, page: number, pageSize: number) => {
    const where: Prisma.khuyen_maiWhereInput = {
        ma_khuyen_mai: {
            contains: search,
        },
    };

    const [promotions, total] = await prisma.$transaction([
        prisma.khuyen_mai.findMany({
            where,
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.khuyen_mai.count({ where }),
    ]);

    return {
        data: promotions,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
    };
};

/**
 * Lấy thông tin khuyến mãi theo ID
 * @param id - ID của khuyến mãi
 */
export const getPromotionById = async (id: number) => {
    const promotion = await prisma.khuyen_mai.findUnique({ where: { id } });
    if (!promotion) throw new Error('Khuyến mãi không tồn tại.');
    return promotion;
};

/**
 * Tạo khuyến mãi mới
 * @param data - Dữ liệu để tạo khuyến mãi
 */
export const createPromotion = async (data: {
    code_name: string;
    discount: number;
    quantity: number;
    valid_from: Date;
    valid_to: Date;
    type: boolean;
}) => {
    return prisma.khuyen_mai.create({
        data: {
            ma_khuyen_mai: data.code_name,
            giam_gia: data.discount,
            so_luong: data.quantity,
            ngay_hieu_luc: data.valid_from,
            ngay_ket_thuc: data.valid_to,
            loai_giam_gia: data.type,
        },
    });
};

/**
 * Cập nhật khuyến mãi
 * @param id - ID của khuyến mãi cần cập nhật
 * @param data - Dữ liệu cập nhật
 */
export const updatePromotion = async (id: number, data: any) => {
    return prisma.khuyen_mai.update({
        where: { id },
        data: {
            ma_khuyen_mai: data.code_name,
            giam_gia: data.discount,
            so_luong: data.quantity,
            ngay_hieu_luc: data.valid_from ? new Date(data.valid_from) : undefined,
            ngay_ket_thuc: data.valid_to ? new Date(data.valid_to) : undefined,
            loai_giam_gia: data.type,
        },
    });
};

/**
 * Xóa khuyến mãi
 * @param id - ID của khuyến mãi cần xóa
 */
export const deletePromotion = async (id: number) => {
    return prisma.khuyen_mai.delete({ where: { id } });
};

