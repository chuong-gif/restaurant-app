import prisma from '../models';

export const getCommentsByBlogId = async (blogId: number, page: number, pageSize: number) => {
    const [comments, total] = await prisma.$transaction([
        prisma.binh_luan_blog.findMany({
            where: { bai_viet_id: blogId },
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                nguoi_dung: { // Join với bảng người dùng
                    select: {
                        ho_ten: true,
                        // Thêm trường avatar nếu bạn có
                    }
                }
            }
        }),
        prisma.binh_luan_blog.count({ where: { bai_viet_id: blogId } })
    ]);

    return { data: comments, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

export const createComment = async (data: { blog_id: number, user_id: number, content: string }) => {
    return prisma.binh_luan_blog.create({
        data: {
            bai_viet_id: data.blog_id,
            nguoi_dung_id: data.user_id,
            noi_dung: data.content,
        }
    });
};

export const deleteComment = async (id: number) => {
    return prisma.binh_luan_blog.delete({ where: { id } });
};
