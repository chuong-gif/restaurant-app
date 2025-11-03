// packages/client/src/types/user.ts

// Định nghĩa kiểu cho file media dựa trên schema [cite: 1088-1091, 1103]
type MediaFile = {
    id: number;
    file_url: string;
    file_type: string;
};

// Định nghĩa kiểu cho vai trò
type Role = {
    ten_vai_tro: string;
};

// Dựa trên model 'nguoi_dung' trong schema.prisma 
export type User = {
    id: number;
    ho_ten: string;                 // [cite: 1093]
    email: string;                  // 
    dien_thoai?: string | null;     // [cite: 1096]
    dia_chi?: string | null;        // [cite: 1097]
    trang_thai?: boolean | null;    // [cite: 1099]
    loai_nguoi_dung: string;        // [cite: 1100]

    // ID và Quan hệ (đã sửa)
    anh_dai_dien_id?: number | null; // 
    media_files?: MediaFile | null; // 

    vai_tro_id?: number | null;     // [cite: 1098]
    vai_tro?: Role | null;          // [cite: 1104]
};

// Kiểu dữ liệu trả về từ API đăng nhập
export type AuthResponse = {
    message: string;
    user: User;
    accessToken: string;
};