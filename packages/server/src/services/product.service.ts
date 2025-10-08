// packages/server/src/services/product.service.ts
import prisma from '../models';
import { Prisma } from '@prisma/client';

// Service để lấy danh sách sản phẩm có phân trang và tìm kiếm
export const getProducts = async (
    searchName: string = '',
    page: number = 1,
    pageSize: number = 10,
    status?: number // Optional: 1 cho hoạt động, 0 cho ngưng
) => {
    // Dòng này sẽ hết báo lỗi sau khi bạn chạy generate và reload
    const whereCondition: Prisma.san_phamWhereInput = {
        ten_san_pham: {
            contains: searchName,
        },
    };

    if (status !== undefined) {
        // Trong schema.prisma, `trang_thai` là kiểu Boolean
        whereCondition.trang_thai = status === 1;
    }

    const [products, totalCount] = await prisma.$transaction([
        prisma.san_pham.findMany({
            where: whereCondition,
            orderBy: {
                id: 'desc',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                danh_muc_san_pham: true,
                media_files: true,
            },
        }),
        prisma.san_pham.count({ where: whereCondition }),
    ]);

    return {
        data: products,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: page,
    };
};
// Service để lấy sản phẩm mới nhất
export const getNewestProducts = async (limit: number = 8) => {
    return await prisma.san_pham.findMany({
        where: {
            trang_thai: true, // Chỉ lấy sản phẩm hoạt động
        },
        orderBy: {
            created_at: 'desc',
        },
        take: limit,
        include: {
            media_files: true,
        },
    });
};

// Các service khác cho create, update, delete...