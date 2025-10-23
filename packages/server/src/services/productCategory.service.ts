// File: packages/server/src/services/productCategory.service.ts
import prisma from '../models';

/**
 * 🏷️ Lấy tất cả danh mục sản phẩm đang hoạt động
 */
export const getAllCategories = async () => {
    return prisma.danh_muc_san_pham.findMany({
        where: {
            trang_thai: true, // Chỉ lấy các danh mục có trạng thái là true (đang hoạt động)
        },
        orderBy: {
            id: 'asc'
        }
    });
};