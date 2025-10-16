import prisma from '../models';
import { Prisma } from '@prisma/client';

/**
 * ✅ Lấy danh sách danh mục bài viết (category) có hỗ trợ tìm kiếm và phân trang
 */
export const getCategories = async (
    search: string,          // chuỗi tìm kiếm theo tên danh mục
    status: boolean | undefined, // trạng thái danh mục (true/false hoặc undefined nếu không lọc)
    page: number,            // số trang hiện tại
    pageSize: number         // số lượng danh mục mỗi trang
) => {
    // Tạo điều kiện lọc cho truy vấn
    const where: Prisma.danh_muc_blogWhereInput = {
        ten_danh_muc: {
            contains: search, // tìm theo tên danh mục chứa chuỗi search
        },
    };

    // Nếu có lọc theo trạng thái thì thêm vào điều kiện
    if (status !== undefined) {
        where.trang_thai = status;
    }

    // Thực hiện đồng thời 2 truy vấn: lấy danh mục và đếm tổng số
    const [categories, total] = await prisma.$transaction([
        prisma.danh_muc_blog.findMany({
            where,
            orderBy: { id: 'desc' },         // sắp xếp theo ID giảm dần (mới nhất lên đầu)
            skip: (page - 1) * pageSize,     // bỏ qua số lượng dữ liệu của các trang trước
            take: pageSize,                  // giới hạn số lượng danh mục mỗi trang
        }),
        prisma.danh_muc_blog.count({ where }), // đếm tổng số danh mục phù hợp
    ]);

    // Trả về dữ liệu + thông tin phân trang
    return {
        data: categories,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
    };
};

/**
 * ✅ Tạo một danh mục mới
 */
export const createCategory = async (name: string, status: boolean) => {
    // Thêm một bản ghi mới vào bảng danh_muc_blog
    return prisma.danh_muc_blog.create({
        data: {
            ten_danh_muc: name,  // tên danh mục
            trang_thai: status,  // trạng thái (hiển thị / ẩn)
        },
    });
};

/**
 * ✅ Cập nhật danh mục theo ID
 */
export const updateCategory = async (id: number, data: { name?: string; status?: boolean }) => {
    // Cập nhật tên và/hoặc trạng thái danh mục
    return prisma.danh_muc_blog.update({
        where: { id }, // điều kiện tìm theo ID
        data: {
            ten_danh_muc: data.name,
            trang_thai: data.status,
        },
    });
};

/**
 * ✅ Xóa danh mục — đồng thời xử lý các bài viết liên quan (nếu có)
 */
export const deleteCategory = async (id: number) => {
    // Lấy thông tin danh mục cần xóa, bao gồm cả các bài viết bên trong
    const categoryToDelete = await prisma.danh_muc_blog.findUnique({
        where: { id },
        include: { bai_viet: true }, // lấy kèm danh sách bài viết thuộc danh mục này
    });

    // Nếu không tìm thấy danh mục
    if (!categoryToDelete) {
        throw new Error('Danh mục không tồn tại.');
    }

    // Không cho phép xóa danh mục đặc biệt "Chưa phân loại"
    if (categoryToDelete.ten_danh_muc === 'Chưa phân loại') {
        throw new Error('Không thể xóa danh mục "Chưa phân loại".');
    }

    // Nếu danh mục không chứa bài viết nào → có thể xóa luôn
    if (categoryToDelete.bai_viet.length === 0) {
        return prisma.danh_muc_blog.delete({ where: { id } });
    }

    // Nếu có bài viết trong danh mục này → cần chuyển chúng sang danh mục "Chưa phân loại"
    let unclassifiedCategory = await prisma.danh_muc_blog.findFirst({
        where: { ten_danh_muc: 'Chưa phân loại' },
    });

    // Nếu chưa tồn tại danh mục "Chưa phân loại" thì tạo mới
    if (!unclassifiedCategory) {
        unclassifiedCategory = await prisma.danh_muc_blog.create({
            data: { ten_danh_muc: 'Chưa phân loại', trang_thai: true },
        });
    }

    // ✅ Dùng transaction để đảm bảo 2 hành động (chuyển bài viết + xóa danh mục) thực hiện an toàn cùng lúc
    return prisma.$transaction([
        // Bước 1: Cập nhật tất cả bài viết trỏ đến danh mục mới ("Chưa phân loại")
        prisma.bai_viet.updateMany({
            where: { danh_muc_blog_id: id },
            data: { danh_muc_blog_id: unclassifiedCategory.id },
        }),
        // Bước 2: Xóa danh mục cũ
        prisma.danh_muc_blog.delete({ where: { id } }),
    ]);
};
