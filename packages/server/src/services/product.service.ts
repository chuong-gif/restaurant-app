// 📦 Import các thư viện cần thiết
import prisma from '../models';
import { Prisma } from '@prisma/client';

/* 
==========================================================
🧭 SERVICE: LẤY DANH SÁCH SẢN PHẨM (CÓ PHÂN TRANG + TÌM KIẾM)
==========================================================
*/
export const getProducts = async (
    searchName: string = '', // 🔍 Từ khóa tìm kiếm theo tên sản phẩm
    page: number = 1,        // 📄 Số trang hiện tại
    pageSize: number = 10,   // 📦 Số lượng sản phẩm mỗi trang
    status?: number          // ⚙️ Trạng thái sản phẩm (1 = hoạt động, 0 = ngưng)
) => {
    // 🧩 Tạo điều kiện tìm kiếm theo Prisma
    const whereCondition: Prisma.san_phamWhereInput = {
        ten_san_pham: {
            contains: searchName, // 🔍 Tìm theo tên sản phẩm có chứa từ khóa
        },
    };

    // 🟢 Nếu có truyền tham số trạng thái thì thêm điều kiện vào where
    if (status !== undefined) {
        // Trong schema.prisma, `trang_thai` là kiểu Boolean → chuyển 1|0 sang true|false
        whereCondition.trang_thai = status === 1;
    }

    // ⚡ Thực hiện 2 truy vấn song song trong transaction:
    //   1️⃣ Lấy danh sách sản phẩm
    //   2️⃣ Đếm tổng số sản phẩm phù hợp
    const [products, totalCount] = await prisma.$transaction([
        prisma.san_pham.findMany({
            where: whereCondition,
            orderBy: {
                id: 'desc', // 🔽 Sắp xếp sản phẩm mới nhất lên đầu
            },
            skip: (page - 1) * pageSize, // ⏭️ Bỏ qua sản phẩm của các trang trước
            take: pageSize,               // ⏹️ Giới hạn số lượng sản phẩm lấy ra
            include: {
                danh_muc_san_pham: true,  // 🏷️ Join thêm danh mục sản phẩm
                media_files: true,         // 🖼️ Join thêm ảnh/video liên quan
            },
        }),
        prisma.san_pham.count({ where: whereCondition }), // 🔢 Đếm tổng số kết quả
    ]);

    // 📤 Trả về dữ liệu đã được xử lý + thông tin phân trang
    return {
        data: products,                              // 🧾 Danh sách sản phẩm
        total: totalCount,                           // 🔢 Tổng số sản phẩm
        totalPages: Math.ceil(totalCount / pageSize),// 📊 Tổng số trang
        currentPage: page,                           // 📍 Trang hiện tại
    };
};


/* 
===========================================
🆕 SERVICE: LẤY DANH SÁCH SẢN PHẨM MỚI NHẤT
===========================================
*/
export const getNewestProducts = async (limit: number = 8) => {
    // 🔥 Lấy ra `limit` sản phẩm mới nhất đang hoạt động
    return await prisma.san_pham.findMany({
        where: {
            trang_thai: true, // ✅ Chỉ lấy sản phẩm đang hoạt động
        },
        orderBy: {
            created_at: 'desc', // 🕒 Sắp xếp theo thời gian tạo mới nhất
        },
        take: limit, // 📦 Giới hạn số lượng sản phẩm trả về
        include: {
            media_files: true, // 🖼️ Lấy kèm thông tin file ảnh/video
        },
    });
};

// ✨ Các service khác như create, update, delete... sẽ được bổ sung sau
