// Dựa trên model 'nguoi_dung' trong schema.prisma 

export type User = {
    id: number;
    ho_ten: string;                 // [cite: 84]
    email: string;                  // [cite: 87]
    dien_thoai?: string | null;     // [cite: 88]
    dia_chi?: string | null;        // [cite: 89]
    anh_dai_dien_url?: string | null; // Sẽ là URL sau khi server xử lý
    vai_tro?: {                    // [cite: 96]
        id: number;
        ten_vai_tro: string;
    } | null;
    // Thêm các trường khác bạn cần từ 'nguoi_dung'
};

// Kiểu dữ liệu trả về từ API đăng nhập [cite: 16]
export type AuthResponse = {
    message: string;
    user: User;
    accessToken: string;
};