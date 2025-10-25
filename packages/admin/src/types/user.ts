// Dựa trên enum nguoi_dung_loai_nguoi_dung trong schema.prisma
export type UserType = 'Khách Hàng' | 'Nhân Viên';

// Dựa trên model nguoi_dung trong schema.prisma
export interface User {
    id: number;
    ho_ten: string;
    tai_khoan?: string | null;
    anh_dai_dien_id?: number | null;
    email: string;
    dien_thoai?: string | null;
    dia_chi?: string | null;
    vai_tro_id?: number | null;
    trang_thai?: boolean | null;
    loai_nguoi_dung: UserType;
    luong?: number | null;
    created_at?: string;
    updated_at?: string;
    // Thêm các thuộc tính khác từ quan hệ nếu cần, ví dụ: vai_tro
    vai_tro?: {
        id: number;
        ten_vai_tro: string;
    } | null;
}

export interface AuthState {
    user: User | null;
    token: string | null;
}