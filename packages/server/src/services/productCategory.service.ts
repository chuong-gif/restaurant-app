// packages/server/src/services/productCategory.service.ts
import prisma from '../models';
import { Prisma } from '@prisma/client';

/* ===================================================================
 🧭 SERVICE: LẤY DS DANH MỤC (CÓ LỌC & PHÂN TRANG)
===================================================================
*/
export const getAdminCategories = async (
    searchName: string = '',     // 🔍 Lọc theo tên
    trang_thai?: boolean,       // ⚙️ Lọc theo trạng thái
    page: number = 1,            // 📄 Số trang
    pageSize: number = 10        // 📦 Số lượng mỗi trang
) => {
    // 🧩 Tạo điều kiện
    const whereCondition: Prisma.danh_muc_san_phamWhereInput = {
        ten_danh_muc: {
            contains: searchName,
        },
    };

    // 🟢 Thêm điều kiện lọc TRẠNG THÁI
    if (trang_thai !== undefined) {
        whereCondition.trang_thai = trang_thai;
    }

    // ⚡ Thực hiện 2 truy vấn song song
    const [categories, totalCount] = await prisma.$transaction([
        prisma.danh_muc_san_pham.findMany({
            where: whereCondition,
            orderBy: {
                id: 'asc',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.danh_muc_san_pham.count({ where: whereCondition }),
    ]);

    // 📤 Trả về
    return {
        data: categories,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: page,
    };
};

/* ===============================
 🆔 SERVICE: LẤY 1 DANH MỤC
===============================
*/
export const getCategoryById = async (id: number) => {
    const category = await prisma.danh_muc_san_pham.findUnique({
        where: { id },
    });
    if (!category) {
        throw new Error('Danh mục không tồn tại');
    }
    return category;
};

/* ===============================
 ➕ SERVICE: TẠO MỚI DANH MỤC
===============================
*/
export const createCategory = async (data: { ten_danh_muc: string; trang_thai: boolean }) => {
    // Kiểm tra trùng tên
    const existing = await prisma.danh_muc_san_pham.findFirst({
        where: { ten_danh_muc: data.ten_danh_muc }
    });
    if (existing) {
        throw new Error('Tên danh mục đã tồn tại');
    }

    return prisma.danh_muc_san_pham.create({
        data: {
            ten_danh_muc: data.ten_danh_muc,
            trang_thai: data.trang_thai,
        },
    });
};

/* ===============================
 ✏️ SERVICE: CẬP NHẬT DANH MỤC
===============================
*/
export const updateCategory = async (id: number, data: { ten_danh_muc: string; trang_thai: boolean }) => {
    // Kiểm tra danh mục có tồn tại không
    const existing = await prisma.danh_muc_san_pham.findUnique({ where: { id } });
    if (!existing) {
        throw new Error('Danh mục không tồn tại');
    }

    // Kiểm tra trùng tên với danh mục khác
    const existingName = await prisma.danh_muc_san_pham.findFirst({
        where: {
            ten_danh_muc: data.ten_danh_muc,
            id: { not: id } // Loại trừ chính nó
        }
    });
    if (existingName) {
        throw new Error('Tên danh mục đã tồn tại');
    }

    return prisma.danh_muc_san_pham.update({
        where: { id },
        data: {
            ten_danh_muc: data.ten_danh_muc,
            trang_thai: data.trang_thai,
        },
    });
};

/* ===============================
 🗑️ SERVICE: XÓA DANH MỤC
===============================
*/
export const deleteCategory = async (id: number) => {
    const existing = await prisma.danh_muc_san_pham.findUnique({ where: { id } });
    if (!existing) {
        throw new Error('Danh mục không tồn tại');
    }

    // Logic quan trọng: không cho xóa danh mục "Chưa phân loại" (giả sử nó có tên này)
    if (existing.ten_danh_muc === 'Chưa phân loại') {
        throw new Error('Không thể xóa danh mục mặc định');
    }

    // Kiểm tra xem danh mục có đang được sử dụng bởi sản phẩm nào không
    const productCount = await prisma.san_pham.count({
        where: { danh_muc_id: id }
    });

    if (productCount > 0) {
        throw new Error('Không thể xóa danh mục đang có sản phẩm. Vui lòng chuyển sản phẩm sang danh mục khác trước.');
    }

    return prisma.danh_muc_san_pham.delete({
        where: { id },
    });
};