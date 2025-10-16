// packages/server/src/services/auth.service.ts
import prisma from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nguoi_dung_loai_nguoi_dung as UserType } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-default-secret-key'; // 🔐 Khóa bí mật dùng để ký JWT

// 🧩 Hàm helper tạo token JWT từ thông tin người dùng
const generateToken = (user: { id: number; email: string; ho_ten: string; anh_dai_dien_id: number | null }) => {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.ho_ten,
        avatar: user.anh_dai_dien_id // Lưu ID ảnh đại diện nếu có
    };
    // Ký JWT có thời hạn 3 tiếng
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '3h' });
};

// --- 🌐 Dịch vụ cho Khách hàng ---

// 📱 Xử lý đăng nhập bằng mạng xã hội (Google, Facebook)
export const handleSocialLogin = async (email: string, fullname: string, avatarUrl: string | null) => {
    // Tìm người dùng theo email
    let user = await prisma.nguoi_dung.findUnique({
        where: { email },
    });

    // Nếu chưa tồn tại → tạo mới người dùng
    if (!user) {
        user = await prisma.nguoi_dung.create({
            data: {
                ho_ten: fullname,
                email: email,
                mat_khau: '', // Mật khẩu trống vì tài khoản đăng nhập qua mạng xã hội
                loai_nguoi_dung: UserType.Kh_ch_H_ng, // Mặc định là khách hàng
                // Có thể thêm logic lưu avatar vào media_files nếu cần
            },
        });
    }

    // Tạo JWT token cho user
    const token = generateToken(user);
    const { mat_khau, ...userWithoutPassword } = user; // Xóa mật khẩu khỏi dữ liệu trả về
    return { user: userWithoutPassword, token };
};

// 📝 Đăng ký người dùng mới
export const registerUser = async (userData: any) => {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await prisma.nguoi_dung.findUnique({ where: { email: userData.email } });
    if (existingUser) {
        throw new Error('Email đã tồn tại.');
    }

    // Mã hóa mật khẩu bằng bcrypt
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Tạo mới người dùng trong DB
    const newUser = await prisma.nguoi_dung.create({
        data: {
            ho_ten: userData.fullname,
            email: userData.email,
            dien_thoai: userData.tel,
            dia_chi: userData.address,
            mat_khau: hashedPassword,
            loai_nguoi_dung: UserType.Kh_ch_H_ng, // Gán loại người dùng là khách hàng
        },
    });

    // 🔰 Tạo thẻ thành viên mặc định (nếu tồn tại hạng “Mới”)
    const defaultTier = await prisma.hang_thanh_vien.findFirst({ where: { ten_hang: 'Mới' } });
    if (defaultTier) {
        await prisma.the_thanh_vien.create({
            data: {
                khach_hang_id: newUser.id,
                hang_thanh_vien_id: defaultTier.id,
                diem_tich_luy: 0, // Điểm tích lũy ban đầu
            },
        });
    }

    return newUser;
};

// --- 🧑‍💼 Dịch vụ cho Admin / Nhân viên ---

// 🔐 Đăng nhập cho Admin/Nhân viên (phân biệt với khách hàng)
export const loginAdmin = async (email: string, password: string) => {
    // Tìm người dùng là nhân viên có email trùng khớp
    const admin = await prisma.nguoi_dung.findFirst({
        where: {
            email,
            loai_nguoi_dung: UserType.Nh_n_Vi_n, // Chỉ tìm người dùng loại nhân viên
        },
    });

    // Nếu không tìm thấy → báo lỗi
    if (!admin) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    // So sánh mật khẩu nhập vào với mật khẩu trong DB
    const isMatch = await bcrypt.compare(password, admin.mat_khau);
    if (!isMatch) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    // Tạo token đăng nhập cho admin
    const token = generateToken(admin);
    const { mat_khau, ...adminWithoutPassword } = admin; // Loại bỏ mật khẩu khỏi dữ liệu trả về

    return { admin: adminWithoutPassword, token };
};
