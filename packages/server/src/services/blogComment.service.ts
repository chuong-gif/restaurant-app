import prisma from '../models';

/**
 * ✅ Lấy danh sách bình luận theo ID bài viết (blogId) — có hỗ trợ phân trang
 */
export const getCommentsByBlogId = async (blogId: number, page: number, pageSize: number) => {
    // Thực hiện 2 truy vấn song song bằng transaction:
    // 1️⃣ Lấy danh sách bình luận
    // 2️⃣ Đếm tổng số bình luận của bài viết
    const [comments, total] = await prisma.$transaction([
        prisma.binh_luan_blog.findMany({
            where: { bai_viet_id: blogId },   // lọc theo ID bài viết
            orderBy: { id: 'desc' },          // sắp xếp bình luận mới nhất lên đầu
            skip: (page - 1) * pageSize,      // bỏ qua các bình luận của trang trước
            take: pageSize,                   // giới hạn số bình luận mỗi trang
            include: {
                nguoi_dung: { // JOIN sang bảng người dùng để lấy thông tin người bình luận
                    select: {
                        ho_ten: true, // chỉ lấy tên người dùng
                        // có thể thêm 'avatar' nếu cần hiển thị ảnh đại diện
                    }
                }
            }
        }),
        prisma.binh_luan_blog.count({ where: { bai_viet_id: blogId } }) // đếm tổng số bình luận
    ]);

    // Trả về dữ liệu bình luận + tổng số trang + trang hiện tại
    return { data: comments, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

/**
 * ✅ Tạo mới một bình luận cho bài viết
 */
export const createComment = async (data: { blog_id: number, user_id: number, content: string }) => {
    // Thêm bản ghi mới vào bảng bình_luan_blog
    return prisma.binh_luan_blog.create({
        data: {
            bai_viet_id: data.blog_id,   // liên kết với bài viết
            nguoi_dung_id: data.user_id, // người dùng bình luận
            noi_dung: data.content,      // nội dung bình luận
        }
    });
};

/**
 * ✅ Xóa một bình luận theo ID
 */
export const deleteComment = async (id: number) => {
    // Xóa bản ghi trong bảng bình_luan_blog theo ID
    return prisma.binh_luan_blog.delete({ where: { id } });
};
