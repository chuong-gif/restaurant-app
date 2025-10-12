import prisma from '../models';
import { Prisma } from '@prisma/client';

/**
 * Lấy danh sách danh mục bài viết với phân trang và tìm kiếm
 */
export const getCategories = async (
    search: string,
    status: boolean | undefined,
    page: number,
    pageSize: number
) => {
    const where: Prisma.danh_muc_blogWhereInput = {
        ten_danh_muc: {
            contains: search,
        },
    };

    if (status !== undefined) {
        where.trang_thai = status;
    }

    const [categories, total] = await prisma.$transaction([
        prisma.danh_muc_blog.findMany({
            where,
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.danh_muc_blog.count({ where }),
    ]);

    return {
        data: categories,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
    };
};

/**
 * Tạo một danh mục mới
 */
export const createCategory = async (name: string, status: boolean) => {
    return prisma.danh_muc_blog.create({
        data: {
            ten_danh_muc: name,
            trang_thai: status,
        },
    });
};

/**
 * Cập nhật một danh mục
 */
export const updateCategory = async (id: number, data: { name?: string; status?: boolean }) => {
    return prisma.danh_muc_blog.update({
        where: { id },
        data: {
            ten_danh_muc: data.name,
            trang_thai: data.status,
        },
    });
};

/**
 * Xóa một danh mục và chuyển các bài viết liên quan (nếu có)
 */
export const deleteCategory = async (id: number) => {
    const categoryToDelete = await prisma.danh_muc_blog.findUnique({
        where: { id },
        include: { bai_viet: true }, // Lấy cả các bài viết liên quan
    });

    if (!categoryToDelete) {
        throw new Error('Danh mục không tồn tại.');
    }

    if (categoryToDelete.ten_danh_muc === 'Chưa phân loại') {
        throw new Error('Không thể xóa danh mục "Chưa phân loại".');
    }

    // Nếu không có bài viết nào, chỉ cần xóa
    if (categoryToDelete.bai_viet.length === 0) {
        return prisma.danh_muc_blog.delete({ where: { id } });
    }

    // Nếu có bài viết, chuyển chúng sang "Chưa phân loại"
    let unclassifiedCategory = await prisma.danh_muc_blog.findFirst({
        where: { ten_danh_muc: 'Chưa phân loại' },
    });

    // Nếu chưa có, tạo mới
    if (!unclassifiedCategory) {
        unclassifiedCategory = await prisma.danh_muc_blog.create({
            data: { ten_danh_muc: 'Chưa phân loại', trang_thai: true },
        });
    }

    // Sử dụng transaction để đảm bảo cả hai hành động đều thành công
    return prisma.$transaction([
        // 1. Cập nhật các bài viết để trỏ đến danh mục mới
        prisma.bai_viet.updateMany({
            where: { danh_muc_blog_id: id },
            data: { danh_muc_blog_id: unclassifiedCategory.id },
        }),
        // 2. Xóa danh mục cũ
        prisma.danh_muc_blog.delete({ where: { id } }),
    ]);
};
