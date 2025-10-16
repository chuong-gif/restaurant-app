import prisma from '../models';
import { Prisma } from '@prisma/client';

// ✅ Utility để tạo "slug" (chuỗi URL thân thiện) từ tiêu đề bài viết
const createSlug = (title: string) => {
    return title
        .toLowerCase() // chuyển toàn bộ thành chữ thường
        .normalize("NFD") // tách dấu khỏi ký tự tiếng Việt
        .replace(/[\u0300-\u036f]/g, "") // xóa toàn bộ dấu
        .replace(/[^a-z0-9\s-]/g, "") // loại bỏ ký tự đặc biệt (chỉ giữ a-z, 0-9, khoảng trắng, gạch nối)
        .trim() // loại bỏ khoảng trắng ở đầu/cuối
        .replace(/\s+/g, "-") // thay khoảng trắng giữa các từ bằng "-"
        .replace(/-+/g, "-"); // gộp nhiều dấu "-" liên tiếp thành một
};

// ✅ Lấy danh sách bài viết có phân trang + tìm kiếm theo tiêu đề/tác giả
export const getBlogs = async (search: string, page: number, pageSize: number) => {
    // Bộ lọc tìm kiếm trong tiêu đề hoặc tác giả
    const where: Prisma.bai_vietWhereInput = {
        OR: [{ tieu_de: { contains: search } }, { tac_gia: { contains: search } }],
    };

    // Thực hiện đồng thời 2 truy vấn: lấy danh sách và đếm tổng số
    const [blogs, total] = await prisma.$transaction([
        prisma.bai_viet.findMany({
            where,
            orderBy: { id: 'desc' }, // sắp xếp giảm dần theo ID
            skip: (page - 1) * pageSize, // bỏ qua số lượng bài của các trang trước
            take: pageSize, // giới hạn số bài trên mỗi trang
            include: { danh_muc_blog: true } // lấy thêm thông tin danh mục
        }),
        prisma.bai_viet.count({ where }), // đếm tổng số bài phù hợp
    ]);

    // Trả về dữ liệu + tổng số trang + trang hiện tại
    return { data: blogs, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

// ✅ Lấy chi tiết bài viết theo ID
export const getBlogById = async (id: number) => {
    const blog = await prisma.bai_viet.findUnique({ where: { id } });
    if (!blog) throw new Error('Bài viết không tồn tại.'); // nếu không tìm thấy
    return blog;
};

// ✅ Lấy bài viết theo slug (đường dẫn thân thiện)
export const getBlogBySlug = async (slug: string) => {
    const blog = await prisma.bai_viet.findFirst({
        where: { slug },
        include: { danh_muc_blog: true } // lấy thêm thông tin danh mục
    });
    if (!blog) throw new Error('Bài viết không tồn tại.');
    return blog;
};

// ✅ Tạo mới bài viết
export const createBlog = async (data: any) => {
    const slug = createSlug(data.title); // tạo slug từ tiêu đề
    return prisma.bai_viet.create({
        data: {
            tieu_de: data.title,
            noi_dung: data.content,
            tac_gia: data.author,
            danh_muc_blog_id: data.blog_category_id,
            slug: slug,
            // anh_bia_id: data.poster, // (ghi chú) cần xử lý thêm phần media nếu có
        },
    });
};

// ✅ Cập nhật bài viết
export const updateBlog = async (id: number, data: any) => {
    const updateData: any = { ...data }; // sao chép dữ liệu cần cập nhật
    if (data.title) {
        updateData.slug = createSlug(data.title); // cập nhật lại slug nếu đổi tiêu đề
    }
    return prisma.bai_viet.update({
        where: { id }, // tìm theo ID
        data: {
            tieu_de: updateData.title,
            noi_dung: updateData.content,
            tac_gia: updateData.author,
            danh_muc_blog_id: updateData.blog_category_id,
            slug: updateData.slug,
        }
    });
};

// ✅ Xóa bài viết theo ID
export const deleteBlog = async (id: number) => {
    return prisma.bai_viet.delete({ where: { id } });
};
