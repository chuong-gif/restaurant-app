import { PrismaClient, Prisma } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

/**
 * 📚 Lấy danh sách bài viết (Admin - Sửa lỗi: Bỏ mode: "insensitive", Sửa format return)
 */
export async function getBlogsAdmin(filters: {
    page: number;
    limit: number;
    search?: string;
    categoryId?: number;
}) {
    const { page, limit, search, categoryId } = filters; // Đảm bảo limit được nhận

    // Sửa: Bỏ 'any', dùng type của Prisma
    const where: Prisma.bai_vietWhereInput = {};

    if (search) {
        where.OR = [
            // Sửa: Bỏ 'mode: "insensitive"'
            { tieu_de: { contains: search } },
            { noi_dung: { contains: search } },
        ];
    }
    if (categoryId) where.danh_muc_blog_id = categoryId;

    const [blogs, total] = await prisma.$transaction([
        prisma.bai_viet.findMany({
            where,
            include: {
                danh_muc_blog: { select: { ten_danh_muc: true } },
                nguoi_dung: { select: { ho_ten: true } }, // Join đúng theo schema đã sửa
                media_files: { select: { file_url: true } }
            },
            orderBy: { created_at: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.bai_viet.count({ where })
    ]);

    // Sửa: Trả về đúng format mà frontend (blogApi.ts) mong đợi
    return {
        data: blogs, // Đổi 'blogs' -> 'data'
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}

/**

* Lấy bài viết theo ID
  */
export async function getBlogById(id: number) {
    return prisma.bai_viet.findUnique({
        where: { id },
        include: {
            danh_muc_blog: true,
            media_files: true,
            nguoi_dung: true,
        },
    });
}

/**

* Lấy bài viết theo slug
  */
export async function getBlogBySlug(slug: string) {
    return prisma.bai_viet.findUnique({
        where: { slug },
        include: {
            danh_muc_blog: true,
            media_files: true,
            nguoi_dung: true,
        },
    });
}

/**

* Tạo mới bài viết
  */
export async function createBlog(data: {
    tieu_de: string;
    noi_dung: string;
    danh_muc_blog_id?: number;
    anh_bia_id?: number;
    nguoi_dung_id?: number;
}) {
    const slug = slugify(data.tieu_de, { lower: true, strict: true });

    return prisma.bai_viet.create({
        data: {
            tieu_de: data.tieu_de,
            noi_dung: data.noi_dung,
            slug,
            danh_muc_blog: data.danh_muc_blog_id
                ? { connect: { id: data.danh_muc_blog_id } }
                : undefined,
            media_files: data.anh_bia_id
                ? { connect: { id: data.anh_bia_id } }
                : undefined,
            nguoi_dung: data.nguoi_dung_id
                ? { connect: { id: data.nguoi_dung_id } }
                : undefined,
        },
        include: {
            danh_muc_blog: true,
            media_files: true,
            nguoi_dung: true,
        },
    });
}

/**

* Cập nhật bài viết
  */
export async function updateBlog(
    id: number,
    data: {
        tieu_de?: string;
        noi_dung?: string;
        danh_muc_blog_id?: number | null;
        anh_bia_id?: number | null;
        nguoi_dung_id?: number | null;
    }
) {
    const updateData: any = {};

    if (data.tieu_de) {
        updateData.tieu_de = data.tieu_de;
        updateData.slug = slugify(data.tieu_de, { lower: true, strict: true });
    }

    if (data.noi_dung) updateData.noi_dung = data.noi_dung;

    // Cập nhật quan hệ danh mục
    if (data.danh_muc_blog_id !== undefined) {
        updateData.danh_muc_blog = data.danh_muc_blog_id
            ? { connect: { id: data.danh_muc_blog_id } }
            : { disconnect: true };
    }

    // Cập nhật ảnh bìa
    if (data.anh_bia_id !== undefined) {
        updateData.media_files = data.anh_bia_id
            ? { connect: { id: data.anh_bia_id } }
            : { disconnect: true };
    }

    // Cập nhật tác giả
    if (data.nguoi_dung_id !== undefined) {
        updateData.nguoi_dung = data.nguoi_dung_id
            ? { connect: { id: data.nguoi_dung_id } }
            : { disconnect: true };
    }

    return prisma.bai_viet.update({
        where: { id },
        data: updateData,
        include: {
            danh_muc_blog: true,
            media_files: true,
            nguoi_dung: true,
        },
    });
}

/**

* Xóa bài viết
  */
export async function deleteBlog(id: number) {
    return prisma.bai_viet.delete({
        where: { id },
    });
}

