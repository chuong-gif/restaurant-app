// packages/server/src/services/user.service.ts
import prisma from '../models';
import { Prisma, nguoi_dung_loai_nguoi_dung as UserType } from '@prisma/client';
import bcrypt from 'bcrypt';

const saltRounds = 10; // 🔐 Số vòng mã hóa mật khẩu

/**
 * 👥 LẤY DANH SÁCH NGƯỜI DÙNG
 */
export const getUsers = async (filters: {
    page: number;
    pageSize: number;
    search: string;
    trang_thai?: boolean; // Sửa: Dùng boolean
    roleId?: number;
    userType?: UserType; // Prisma Enum
}) => {
    const { page, pageSize, search, trang_thai, roleId, userType } = filters;

    const where: Prisma.nguoi_dungWhereInput = {
        OR: [
            { ho_ten: { contains: search } },
            { email: { contains: search } }
        ],
        trang_thai: trang_thai, // Dùng boolean
        vai_tro_id: roleId,
        loai_nguoi_dung: userType, // Dùng Enum
    };

    const [users, total] = await prisma.$transaction([
        prisma.nguoi_dung.findMany({
            where,
            select: {
                id: true,
                ho_ten: true,
                email: true,
                dien_thoai: true,
                dia_chi: true,
                trang_thai: true,
                loai_nguoi_dung: true,
                vai_tro_id: true,
                anh_dai_dien_id: true,
                created_at: true,
                vai_tro: { select: { ten_vai_tro: true } },
                media_files: { select: { file_url: true } },
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

/**
 * ✨ TẠO NGƯỜI DÙNG MỚI (Sửa: Xử lý Enum, Avatar, Password)
 */
export const createUser = async (data: any) => {
    // Tách các trường đặc biệt
    const { password, anh_dai_dien_id, loai_nguoi_dung, ...userData } = data;

    // === SỬA LỖI 1: Chuyển đổi String sang Enum ===
    let prismaUserType: UserType;
    if (loai_nguoi_dung === 'Khách Hàng') {
        prismaUserType = UserType.Khach_Hang;
    } else if (loai_nguoi_dung === 'Nhân Viên') {
        prismaUserType = UserType.Nhan_Vien;
    } else {
        throw new Error('Loại người dùng không hợp lệ.');
    }
    // ======================================

    // Kiểm tra email trùng
    const existingUser = await prisma.nguoi_dung.findUnique({ where: { email: userData.email } });
    if (existingUser) throw new Error('📧 Email đã tồn tại.');

    // Xử lý mật khẩu
    let hashedPassword = '';
    if (prismaUserType === UserType.Nhan_Vien) {
        if (!password || password.length < 6) {
            throw new Error('Mật khẩu cho nhân viên là bắt buộc và tối thiểu 6 ký tự.');
        }
        hashedPassword = await bcrypt.hash(password, saltRounds);
    } else if (password) {
        hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // --- Sửa: Dùng UncheckedCreateInput để gán ID trực tiếp ---
    const createData: Prisma.nguoi_dungUncheckedCreateInput = {
        ...userData,
        loai_nguoi_dung: prismaUserType, // Gán Enum đã chuyển đổi
        mat_khau: hashedPassword,
        anh_dai_dien_id: anh_dai_dien_id ? parseInt(anh_dai_dien_id, 10) : undefined, // Gán ID (number | undefined)
    };
    // -----------------------------------------------------

    return prisma.nguoi_dung.create({
        data: createData,
        select: { id: true, email: true, ho_ten: true } // Chỉ trả về các trường an toàn
    });
}

/**
 * 🔄 CẬP NHẬT THÔNG TIN NGƯỜI DÙNG (Sửa: Xử lý vai_tro_id)
 */
export const updateUser = async (id: number, data: any) => {
    // Tách các trường đặc biệt (KHÔNG cho cập nhật mật khẩu/loại ở đây)

    // === SỬA LỖI 1: Tách 'vai_tro_id' ra khỏi ...updates ===
    //
    const { password, loai_nguoi_dung, anh_dai_dien_id, vai_tro_id, ...updates } = data;

    const existing = await prisma.nguoi_dung.findUnique({ where: { id } });
    if (!existing) {
        throw new Error('❌ Người dùng không tồn tại.');
    }

    // Kiểm tra email trùng (nếu email được cập nhật)
    if (updates.email && updates.email !== existing.email) {
        const existingEmail = await prisma.nguoi_dung.findFirst({
            where: { email: updates.email, id: { not: id } }
        });
        if (existingEmail) {
            throw new Error('📧 Email đã được sử dụng bởi tài khoản khác.');
        }
    }

    const dataToUpdate: Prisma.nguoi_dungUpdateInput = {
        ...updates, // Gán các trường thông thường (ho_ten, dien_thoai, dia_chi, trang_thai...)
    };

    // === SỬA LỖI 1: Xử lý quan hệ 'vai_tro' ===
    // (Đây là logic gây ra lỗi crash trong ảnh)
    //
    if (vai_tro_id !== undefined) {
        if (vai_tro_id === null) {
            dataToUpdate.vai_tro = { disconnect: true };
        } else {
            // Kết nối vai trò mới bằng ID
            dataToUpdate.vai_tro = { connect: { id: parseInt(vai_tro_id, 10) } };
        }
    }
    // ======================================

    // === Xử lý ảnh (anh_dai_dien_id) - Code của bạn đã đúng, giữ nguyên ===
    //
    if (anh_dai_dien_id !== undefined) {
        if (anh_dai_dien_id === null) {
            dataToUpdate.media_files = { disconnect: true };
        } else {
            dataToUpdate.media_files = { connect: { id: parseInt(anh_dai_dien_id, 10) } };
        }
    }
    // ======================================

    return prisma.nguoi_dung.update({
        where: { id },
        data: dataToUpdate,
        select: { id: true, email: true, ho_ten: true }
    });
};

/**
 * 🗑️ XÓA MỀM NGƯỜI DÙNG (Theo thống nhất)
 */
export const deleteUser = async (id: number) => {
    const user = await prisma.nguoi_dung.findUnique({ where: { id } });
    if (!user) {
        throw new Error('❌ Người dùng không tồn tại.');
    }
    // Sửa: Cập nhật trạng thái thay vì xóa
    return prisma.nguoi_dung.update({
        where: { id },
        data: { trang_thai: false },
    });
};
// === THÊM MỚI HÀM NÀY ===
/**
 * 🗑️🔥 XÓA VĨNH VIỄN NGƯỜI DÙNG
 */
export const permanentlyDeleteUser = async (id: number) => {
    const user = await prisma.nguoi_dung.findUnique({ where: { id } });
    if (!user) {
        throw new Error('❌ Người dùng không tồn tại.');
    }
    // Có thể thêm kiểm tra ràng buộc (vd: đặt bàn) ở đây nếu cần
    // const reservationCount = await prisma.dat_ban.count({ where: { khach_hang_id: id } });
    // if (reservationCount > 0) { ... }

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

// === 🔑 THÊM HÀM MỚI ĐỂ ĐỔI MẬT KHẨU ===
export const changePassword = async (userId: number, newPassword: string) => {
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu trong CSDL
    await prisma.nguoi_dung.update({
        where: { id: userId },
        data: { mat_khau: hashedPassword },
    });
};