// packages/server/src/services/user.service.ts
import prisma from '../models';
import { Prisma, nguoi_dung_loai_nguoi_dung as UserType } from '@prisma/client';
import bcrypt from 'bcrypt';

const saltRounds = 10; // 🔐 Số vòng mã hóa mật khẩu

// 👥 LẤY DANH SÁCH NGƯỜI DÙNG (Có phân trang, tìm kiếm, lọc)
export const getUsers = async (filters: {
    page: number;
    pageSize: number;
    search: string;
    trang_thai?: boolean; // Sửa: Dùng boolean cho trạng thái
    roleId?: number;
    userType?: UserType;
}) => {
    const { page, pageSize, search, trang_thai, roleId, userType } = filters;

    // Sửa: Điều kiện where dùng boolean trang_thai
    const where: Prisma.nguoi_dungWhereInput = {
        OR: [ // Tìm kiếm theo tên hoặc email
            { ho_ten: { contains: search } },
            { email: { contains: search } }
        ],
        trang_thai: trang_thai, // Sử dụng trực tiếp boolean
        vai_tro_id: roleId,
        loai_nguoi_dung: userType,
    };

    const [users, total] = await prisma.$transaction([
        prisma.nguoi_dung.findMany({
            where,
            select: { // 🧩 Chỉ lấy các trường cần thiết, không bao giờ lấy mật khẩu
                id: true,
                ho_ten: true,
                // tai_khoan: true, // Thường không cần trường này
                email: true,
                dien_thoai: true,
                dia_chi: true,
                trang_thai: true,
                loai_nguoi_dung: true,
                vai_tro_id: true,
                anh_dai_dien_id: true, // Lấy ID ảnh
                created_at: true,
                vai_tro: { // Join vai trò để lấy tên
                    select: { ten_vai_tro: true }
                },
                media_files: { // Join ảnh đại diện để lấy URL
                    select: { file_url: true },
                },
            },
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.nguoi_dung.count({ where }),
    ]);

    return {
        data: users,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
    };
};

// 🔎 LẤY CHI TIẾT NGƯỜI DÙNG THEO ID
export const getUserById = async (id: number) => {
    const user = await prisma.nguoi_dung.findUnique({
        where: { id },
        select: { // Không lấy mật khẩu
            id: true,
            ho_ten: true,
            email: true,
            dien_thoai: true,
            dia_chi: true,
            trang_thai: true,
            loai_nguoi_dung: true,
            vai_tro_id: true,
            anh_dai_dien_id: true,
            vai_tro: { select: { ten_vai_tro: true } },
            media_files: { select: { file_url: true } },
        },
    });
    if (!user) throw new Error('❌ Người dùng không tồn tại.');
    return user;
};

// ✨ TẠO NGƯỜI DÙNG MỚI (Sửa: Xử lý Avatar & Password)
export const createUser = async (data: any) => {
    const { password, anh_dai_dien_id, ...userData } = data;

    // ⚠️ Kiểm tra email trùng
    const existingUser = await prisma.nguoi_dung.findUnique({ where: { email: userData.email } });
    if (existingUser) throw new Error('📧 Email đã tồn tại.');

    // --- Sửa: Xử lý mật khẩu ---
    let hashedPassword = '';
    // Bắt buộc mật khẩu nếu là Nhân Viên
    if (userData.loai_nguoi_dung === UserType.Nh_n_Vi_n) {
        if (!password || password.length < 6) { // Thêm validation cơ bản
            throw new Error('Mật khẩu cho nhân viên là bắt buộc và tối thiểu 6 ký tự.');
        }
        hashedPassword = await bcrypt.hash(password, saltRounds);
    } else if (password) { // Khách hàng có thể có hoặc không có mật khẩu
        hashedPassword = await bcrypt.hash(password, saltRounds);
    }
    // -------------------------

    return prisma.nguoi_dung.create({
        data: {
            ...userData,
            mat_khau: hashedPassword,
            // --- Sửa: Xử lý avatar ---
            anh_dai_dien_id: anh_dai_dien_id ? parseInt(anh_dai_dien_id, 10) : null,
            // ---------------------
        },
        // Chỉ trả về các trường an toàn
        select: { id: true, email: true, ho_ten: true }
    });
};

// 🔄 CẬP NHẬT THÔNG TIN NGƯỜI DÙNG (Sửa: Xử lý Avatar & Loại bỏ Password)
export const updateUser = async (id: number, data: any) => {
    // --- Sửa: Loại bỏ password khỏi data ---
    const { password, anh_dai_dien_id, ...updates } = data;
    // ------------------------------------

    // --- Sửa: Xử lý avatar ---
    if (anh_dai_dien_id !== undefined) {
        updates.anh_dai_dien_id = anh_dai_dien_id ? parseInt(anh_dai_dien_id, 10) : null;
    }
    // ---------------------

    // Kiểm tra email trùng (nếu email được cập nhật)
    if (updates.email) {
        const existingEmail = await prisma.nguoi_dung.findFirst({
            where: { email: updates.email, id: { not: id } }
        });
        if (existingEmail) {
            throw new Error('📧 Email đã được sử dụng bởi tài khoản khác.');
        }
    }


    return prisma.nguoi_dung.update({
        where: { id },
        data: updates,
        select: { id: true, email: true, ho_ten: true } // Chỉ trả về các trường an toàn
    });
};

// 🗑️ XÓA MỀM NGƯỜI DÙNG (Sửa: Chuyển sang Soft Delete)
export const deleteUser = async (id: number) => {
    const user = await prisma.nguoi_dung.findUnique({ where: { id } });
    if (!user) {
        throw new Error('❌ Người dùng không tồn tại.');
    }

    // --- Sửa: Cập nhật trạng thái thay vì xóa ---
    return prisma.nguoi_dung.update({
        where: { id },
        data: { trang_thai: false }, // Đặt trạng thái thành false
    });
    // ----------------------------------------
};

// === THÊM MỚI HÀM NÀY ===
// 🗑️🔥 XÓA VĨNH VIỄN NGƯỜI DÙNG (Dùng cho Thùng rác)
export const permanentlyDeleteUser = async (id: number) => {
    const user = await prisma.nguoi_dung.findUnique({ where: { id } });
    if (!user) {
        throw new Error('❌ Người dùng không tồn tại.');
    }

    // Kiểm tra lại ràng buộc trước khi xóa vĩnh viễn (nếu cần)
    // Ví dụ: Không cho xóa nếu user có liên kết quan trọng khác
    // const reservationCount = await prisma.dat_ban.count({ where: { khach_hang_id: id } });
    // if (reservationCount > 0) {
    //     throw new Error('🚫 Không thể xóa vĩnh viễn người dùng này vì họ đã có lịch sử đặt bàn.');
    // }

    // Logic xóa ảnh trên Firebase nên được thêm ở đây nếu cần

    return prisma.nguoi_dung.delete({ where: { id } });
};
// =========================

// 🔐 KIỂM TRA MẬT KHẨU HIỆN TẠI (Giữ nguyên)
export const checkCurrentPassword = async (email: string, currentPassword: string) => {
    const user = await prisma.nguoi_dung.findUnique({ where: { email } });
    if (!user) throw new Error('❌ Người dùng không tồn tại.');
    if (!user.mat_khau) throw new Error('Tài khoản này không sử dụng mật khẩu.'); // Thêm kiểm tra

    const isMatch = await bcrypt.compare(currentPassword, user.mat_khau);
    if (!isMatch) throw new Error('⚠️ Mật khẩu hiện tại không chính xác.');

    return true;
};