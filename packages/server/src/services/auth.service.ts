// packages/server/src/services/auth.service.ts
import prisma from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma, nguoi_dung_loai_nguoi_dung as UserType } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-default-secret-key'; // 🔐 Khóa bí mật dùng để ký JWT

// 🧩 Hàm helper tạo token JWT từ thông tin người dùng
const generateToken = (
    user: { id: number; email: string; ho_ten: string; vai_tro_id: number | null },
    permissions: string[] // Mảng các mã quyền, ví dụ: ['view_user', 'add_user']
) => {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.ho_ten,
        roleId: user.vai_tro_id, // Thêm vai trò
        permissions: permissions, // Thêm danh sách quyền
    };
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
                loai_nguoi_dung: UserType.Khach_Hang, // Mặc định là khách hàng
                // Có thể thêm logic lưu avatar vào media_files nếu cần
            },
        });
    }

    // Tạo JWT token cho user
    const token = generateToken(user, []);
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

    // === SỬA LỖI: Thêm `anh_dai_dien_id` vào data ===
    const createData: Prisma.nguoi_dungCreateInput = {
        ho_ten: userData.fullname,
        email: userData.email,
        dien_thoai: userData.tel,
        dia_chi: userData.address,
        mat_khau: hashedPassword,
        loai_nguoi_dung: UserType.Khach_Hang,
    };

    // === SỬA LỖI Ở ĐÂY: Chỉ thêm địa chỉ nếu nó tồn tại ===
    if (userData.address && userData.address.trim() !== '') {
        createData.dia_chi = userData.address;
    }
    // ============================================

    // Nếu client gửi ID ảnh, thì liên kết nó
    if (userData.anh_dai_dien_id) {
        createData.media_files = {
            connect: { id: parseInt(userData.anh_dai_dien_id, 10) }
        };
    }
    // ========================================

    // Tạo mới người dùng trong DB
    const newUser = await prisma.nguoi_dung.create({
        data: createData, // Dùng data đã xử lý
    });

    // 🔰 Tạo thẻ thành viên mặc định (nếu tồn tại hạng “Mới”)
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

// 🔐 Đăng nhập cho Khách hàng (phân biệt với admin)
export const loginUser = async (email: string, password: string) => {
    // Tìm người dùng là Khách Hàng có email trùng khớp
    const user = await prisma.nguoi_dung.findFirst({
        where: {
            email,
            loai_nguoi_dung: UserType.Khach_Hang, // Chỉ tìm người dùng loại "Khách Hàng"
        },
    });

    // Nếu không tìm thấy user -> báo lỗi
    if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, user.mat_khau);
    if (!isMatch) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    // Nếu đúng, tạo token
    const token = generateToken(user, []);
    // Loại bỏ mật khẩu khỏi dữ liệu trả về để bảo mật
    const { mat_khau, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
};

// --- 🧑‍💼 Dịch vụ cho Admin / Nhân viên ---

// 🔐 Đăng nhập cho Admin/Nhân viên (phân biệt với khách hàng)
export const loginAdmin = async (email: string, password: string) => {
    const admin = await prisma.nguoi_dung.findFirst({
        where: {
            email,
            loai_nguoi_dung: UserType.Nhan_Vien,
        },
    });

    if (!admin) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    const isMatch = await bcrypt.compare(password, admin.mat_khau);
    if (!isMatch) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    // === PHẦN THÊM VÀO RẤT QUAN TRỌNG ===
    let userPermissions: string[] = [];
    if (admin.vai_tro_id) {
        // Nếu admin có vai trò, đi lấy quyền của vai trò đó
        const rolePermissions = await prisma.vai_tro_quyen.findMany({
            where: { vai_tro_id: admin.vai_tro_id },
            include: {
                quyen: true, // Lấy luôn thông tin của quyền
            },
        });
        // Chỉ lấy 'ma_quyen'
        userPermissions = rolePermissions.map(rp => rp.quyen.ma_quyen);
    }
    // ===================================

    // 3. Tạo token mới với đầy đủ quyền
    const token = generateToken(admin, userPermissions);
    const { mat_khau, ...adminWithoutPassword } = admin;

    // Gắn mảng quyền (userPermissions) vào đối tượng sẽ trả về
    const adminWithPermissions = {
        ...adminWithoutPassword,
        permissions: userPermissions // <-- Gắn quyền vào đây
    };

    // Trả về đối tượng data ĐÃ CÓ QUYỀN
    return { admin: adminWithPermissions, token };
};
