import prisma from '../models';
import { Prisma, nguoi_dung_loai_nguoi_dung as UserType } from '@prisma/client';
import bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * Lấy danh sách người dùng với các bộ lọc, phân trang và tìm kiếm.
 * Có thể lọc theo loại người dùng (Khách hàng, Nhân viên).
 */
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
        ho_ten: {
            contains: search,
        },
        trang_thai: status !== undefined ? status === 1 : undefined,
        vai_tro_id: roleId,
        loai_nguoi_dung: userType,
    };

    const [users, total] = await prisma.$transaction([
        prisma.nguoi_dung.findMany({
            where,
            select: { // Chỉ lấy các trường cần thiết, không bao giờ lấy mật khẩu
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
                    select: {
                        file_url: true,
                    },
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

/**
 * Lấy thông tin chi tiết của một người dùng theo ID (không bao gồm mật khẩu)
 */
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
            media_files: {
                select: {
                    file_url: true,
                },
            },
        },
    });
    if (!user) throw new Error('Người dùng không tồn tại.');
    return user;
};

/**
 * Tạo người dùng mới (dùng cho cả Khách hàng và Nhân viên)
 */
export const createUser = async (data: any) => {
    const { password, ...userData } = data;

    const existingUser = await prisma.nguoi_dung.findUnique({ where: { email: userData.email } });
    if (existingUser) {
        throw new Error('Email đã tồn tại.');
    }

    const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : '';

    return prisma.nguoi_dung.create({
        data: {
            ...userData,
            mat_khau: hashedPassword,
        },
    });
};

/**
 * Cập nhật thông tin người dùng
 */
export const updateUser = async (id: number, data: any) => {
    const { password, ...updates } = data;

    if (password) {
        updates.mat_khau = await bcrypt.hash(password, saltRounds);
    }

    return prisma.nguoi_dung.update({
        where: { id },
        data: updates,
    });
};

/**
 * Xóa người dùng
 */
export const deleteUser = async (id: number) => {
    // Thêm logic kiểm tra ràng buộc khóa ngoại nếu cần
    // Ví dụ: không cho xóa user nếu họ đã có đơn đặt bàn
    const reservationCount = await prisma.dat_ban.count({ where: { khach_hang_id: id } });
    if (reservationCount > 0) {
        throw new Error('Không thể xóa người dùng này vì họ đã có lịch sử đặt bàn.');
    }

    return prisma.nguoi_dung.delete({ where: { id } });
};

/**
 * Kiểm tra mật khẩu hiện tại
 */
export const checkCurrentPassword = async (email: string, currentPassword: string) => {
    const user = await prisma.nguoi_dung.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Người dùng không tồn tại.');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.mat_khau);
    if (!isMatch) {
        throw new Error('Mật khẩu hiện tại không chính xác.');
    }
    return true;
};
