import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

/**

* Lấy danh sách bài viết
  */
export async function getAllBlogs() {
    return prisma.bai_viet.findMany({
        include: {
            danh_muc_blog: true,
            media_files: true,
            nguoi_dung: true,
        },
        orderBy: { created_at: "desc" },
    });
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

export async function getBlogsAdmin(filters: {
    page: number;
    limit: number;
    search?: string;
    categoryId?: number;
}) {
    const where: any = {};
    if (filters.search) {
        where.OR = [
            { tieu_de: { contains: filters.search, mode: "insensitive" } },
            { noi_dung: { contains: filters.search, mode: "insensitive" } },
        ];
    }
    if (filters.categoryId) where.danh_muc_blog_id = filters.categoryId;

    const total = await prisma.bai_viet.count({ where });

    const blogs = await prisma.bai_viet.findMany({
        where,
        include: {
            danh_muc_blog: true,
            media_files: true,
            nguoi_dung: true,
        },
        orderBy: { created_at: "desc" },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
    });

    return { total, blogs };
}
