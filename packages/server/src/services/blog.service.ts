import prisma from '../models';
import { Prisma } from '@prisma/client';

// Utility để tạo slug từ tiêu đề
const createSlug = (title: string) => {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

export const getBlogs = async (search: string, page: number, pageSize: number) => {
    const where: Prisma.bai_vietWhereInput = {
        OR: [{ tieu_de: { contains: search } }, { tac_gia: { contains: search } }],
    };

    const [blogs, total] = await prisma.$transaction([
        prisma.bai_viet.findMany({
            where,
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: { danh_muc_blog: true }
        }),
        prisma.bai_viet.count({ where }),
    ]);

    return { data: blogs, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

export const getBlogById = async (id: number) => {
    const blog = await prisma.bai_viet.findUnique({ where: { id } });
    if (!blog) throw new Error('Bài viết không tồn tại.');
    return blog;
};

export const getBlogBySlug = async (slug: string) => {
    const blog = await prisma.bai_viet.findFirst({
        where: { slug },
        include: { danh_muc_blog: true }
    });
    if (!blog) throw new Error('Bài viết không tồn tại.');
    return blog;
};

export const createBlog = async (data: any) => {
    const slug = createSlug(data.title);
    return prisma.bai_viet.create({
        data: {
            tieu_de: data.title,
            noi_dung: data.content,
            tac_gia: data.author,
            danh_muc_blog_id: data.blog_category_id,
            slug: slug,
            // anh_bia_id: data.poster, // Cần xử lý logic media_files
        },
    });
};

export const updateBlog = async (id: number, data: any) => {
    const updateData: any = { ...data };
    if (data.title) {
        updateData.slug = createSlug(data.title);
    }
    return prisma.bai_viet.update({
        where: { id },
        data: {
            tieu_de: updateData.title,
            noi_dung: updateData.content,
            tac_gia: updateData.author,
            danh_muc_blog_id: updateData.blog_category_id,
            slug: updateData.slug,
        }
    });
};

export const deleteBlog = async (id: number) => {
    return prisma.bai_viet.delete({ where: { id } });
};
