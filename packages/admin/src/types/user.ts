// packages/admin/src/types/user.ts

// Dựa trên enum nguoi_dung_loai_nguoi_dung trong schema.prisma
export const UserType = {
    KHACH_HANG: 'Khách Hàng',
    NHAN_VIEN: 'Nhân Viên',
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

// Dựa trên bảng `media_files` (Thêm vào nếu chưa có)
export interface MediaFile {
    id: number;
    file_path: string;
    file_url: string;
    file_type: string;
}

// === THÊM MỚI: Dựa trên bảng `vai_tro` ===
export interface Role {
    id: number;
    ten_vai_tro: string;
    mo_ta?: string | null;
}
// ===================================

// Dựa trên model nguoi_dung và response từ user.service.ts
export interface User {
    id: number;
    ho_ten: string;
    email: string;
    dien_thoai?: string | null;
    dia_chi?: string | null;
    trang_thai: boolean; // tinyint(1) -> boolean
    loai_nguoi_dung: UserType;
    vai_tro_id?: number | null;
    anh_dai_dien_id?: number | null; // ID của ảnh
    created_at?: string;

    // Dữ liệu join từ `getUsers`
    vai_tro?: { ten_vai_tro: string } | null;
    media_files?: { file_url: string } | null; // URL ảnh
}

// Kiểu dữ liệu trả về từ API lấy danh sách User
export interface UserListResponse {
    message: string;
    data: User[];
    total: number;
    totalPages: number;
    currentPage: number;
}

// Kiểu dữ liệu state cho Auth (Giữ nguyên)
export interface AuthState {
    user: User | null; // Sửa: User bây giờ là interface User đã định nghĩa ở trên
    token: string | null;
}

// === THÊM MỚI: Kiểu dữ liệu trả về từ API lấy danh sách Role ===
export interface RoleListResponse {
    message: string;
    data: Role[];
    total: number;
    totalPages: number;
    currentPage: number;
}