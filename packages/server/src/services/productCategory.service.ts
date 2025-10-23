// File: packages/server/src/services/productCategory.service.ts
import prisma from '../models';

/**
 * 🏷️ Lấy tất cả danh mục sản phẩm (cho admin)
 */
export const getAllProductCategories = async () => {
    return prisma.danh_muc_san_pham.findMany({
        orderBy: {
            id: 'asc'
        }
    });
};