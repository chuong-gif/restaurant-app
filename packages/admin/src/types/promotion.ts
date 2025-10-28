// packages/admin/src/types/promotion.ts

// Dựa trên bảng `khuyen_mai` và response backend
export interface Promotion {
    id: number;
    ma_khuyen_mai: string;
    giam_gia: number;
    loai_giam_gia: boolean; // false = %, true = Tiền mặt
    so_luong: number;
    ngay_hieu_luc: string; // ISO String
    ngay_ket_thuc: string; // ISO String
    created_at?: string;
    updated_at?: string;
}

// Kiểu dữ liệu trả về từ API lấy danh sách
export interface PromotionListResponse {
    message: string;
    data: Promotion[];
    total: number;
    totalPages: number;
    currentPage: number;
}

// Kiểu dữ liệu trả về từ API lấy chi tiết
export interface PromotionDetailResponse {
    message: string;
    data: Promotion;
}