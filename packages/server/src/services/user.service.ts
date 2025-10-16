// 📦 Import các thư viện cần thiết
import prisma from '../models';
import { Prisma, nguoi_dung_loai_nguoi_dung as UserType } from '@prisma/client';
import bcrypt from 'bcrypt';

const saltRounds = 10; // 🔐 Số vòng mã hóa mật khẩu

// 👥 LẤY DANH SÁCH NGƯỜI DÙNG (Có phân trang, tìm kiếm, lọc)
export const getUsers = async (filters: {
    page: number;
    pageSize: number;
    search: string;
    status?: number;
    roleId?: number;
    userType?: UserType;
}) => {
    const { page, pageSize, search, status, roleId, userType } = filters;

    const where: Prisma.nguoi_dungWhereInput = {
        ho_ten: { contains: search },
        trang_thai: status !== undefined ? status === 1 : undefined,
        vai_tro_id: roleId,
        loai_nguoi_dung: userType,
    };

    const [users, total] = await prisma.$transaction([
        prisma.nguoi_dung.findMany({
            where,
            select: { // 🧩 Chỉ lấy các trường cần thiết, không bao giờ lấy mật khẩu
                id: true,
                ho_ten: true,
                tai_khoan: true,
                email: true,
                dien_thoai: true,
                dia_chi: true,
                trang_thai: true,
                loai_nguoi_dung: true,
                vai_tro_id: true,
                luong: true,
                created_at: true,
                media_files: {
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
        select: {
            id: true,
            ho_ten: true,
            tai_khoan: true,
            email: true,
            dien_thoai: true,
            dia_chi: true,
            trang_thai: true,
            loai_nguoi_dung: true,
            vai_tro_id: true,
            luong: true,
            media_files: { select: { file_url: true } },
        },
    });
    if (!user) throw new Error('❌ Người dùng không tồn tại.');
    return user;
};

// ✨ TẠO NGƯỜI DÙNG MỚI
export const createUser = async (data: any) => {
    const { password, ...userData } = data;

    // ⚠️ Kiểm tra email trùng
    const existingUser = await prisma.nguoi_dung.findUnique({ where: { email: userData.email } });
    if (existingUser) throw new Error('📧 Email đã tồn tại.');

    const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : '';

    return prisma.nguoi_dung.create({
        data: {
            ...userData,
            mat_khau: hashedPassword,
        },
    });
};

// 🔄 CẬP NHẬT THÔNG TIN NGƯỜI DÙNG
export const updateUser = async (id: number, data: any) => {
    const { password, ...updates } = data;
    if (password) updates.mat_khau = await bcrypt.hash(password, saltRounds);

    return prisma.nguoi_dung.update({
        where: { id },
        data: updates,
    });
};

// 🗑️ XÓA NGƯỜI DÙNG (kèm kiểm tra ràng buộc)
export const deleteUser = async (id: number) => {
    // ⚙️ Không cho xóa nếu người dùng đã có lịch sử đặt bàn
    const reservationCount = await prisma.dat_ban.count({ where: { khach_hang_id: id } });
    if (reservationCount > 0) {
        throw new Error('🚫 Không thể xóa người dùng này vì họ đã có lịch sử đặt bàn.');
    }

    return prisma.nguoi_dung.delete({ where: { id } });
};

// 🔐 KIỂM TRA MẬT KHẨU HIỆN TẠI
export const checkCurrentPassword = async (email: string, currentPassword: string) => {
    const user = await prisma.nguoi_dung.findUnique({ where: { email } });
    if (!user) throw new Error('❌ Người dùng không tồn tại.');

    const isMatch = await bcrypt.compare(currentPassword, user.mat_khau);
    if (!isMatch) throw new Error('⚠️ Mật khẩu hiện tại không chính xác.');

    return true;
};
