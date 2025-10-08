// packages/server/src/services/auth.service.ts
import prisma from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nguoi_dung_loai_nguoi_dung as UserType } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-default-secret-key';

// Helper function to generate JWT
const generateToken = (user: { id: number; email: string; ho_ten: string; anh_dai_dien_id: number | null }) => {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.ho_ten,
        // Lấy avatar url từ quan hệ nếu có
        avatar: user.anh_dai_dien_id
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '3h' });
};

// --- Dịch vụ cho Khách hàng ---

// Xử lý đăng nhập Social (Google, Facebook)
export const handleSocialLogin = async (email: string, fullname: string, avatarUrl: string | null) => {
    let user = await prisma.nguoi_dung.findUnique({
        where: { email },
    });

    // Nếu user chưa tồn tại, tạo mới
    if (!user) {
        user = await prisma.nguoi_dung.create({
            data: {
                ho_ten: fullname,
                email: email,
                mat_khau: '', // Mật khẩu trống cho tài khoản social
                loai_nguoi_dung: UserType.Kh_ch_H_ng,
                // Logic để liên kết với media_files nếu cần
            },
        });
    }

    // Tạo token và trả về thông tin user
    const token = generateToken(user);
    const { mat_khau, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};

// Đăng ký người dùng mới
export const registerUser = async (userData: any) => {
    const existingUser = await prisma.nguoi_dung.findUnique({ where: { email: userData.email } });
    if (existingUser) {
        throw new Error('Email đã tồn tại.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await prisma.nguoi_dung.create({
        data: {
            ho_ten: userData.fullname,
            email: userData.email,
            dien_thoai: userData.tel,
            dia_chi: userData.address,
            mat_khau: hashedPassword,
            loai_nguoi_dung: UserType.Kh_ch_H_ng,
        },
    });

    // Logic tạo thẻ thành viên mặc định
    const defaultTier = await prisma.hang_thanh_vien.findFirst({ where: { ten_hang: 'Mới' } });
    if (defaultTier) {
        await prisma.the_thanh_vien.create({
            data: {
                khach_hang_id: newUser.id,
                hang_thanh_vien_id: defaultTier.id,
                diem_tich_luy: 0,
            },
        });
    }

    return newUser;
};

// --- Dịch vụ cho Admin/Nhân viên ---

export const loginAdmin = async (email: string, password: string) => {
    const admin = await prisma.nguoi_dung.findFirst({
        where: {
            email,
            loai_nguoi_dung: UserType.Nh_n_Vi_n,
        },
    });

    if (!admin) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    const isMatch = await bcrypt.compare(password, admin.mat_khau);
    if (!isMatch) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    const token = generateToken(admin);
    const { mat_khau, ...adminWithoutPassword } = admin;
    return { admin: adminWithoutPassword, token };
};