// packages/admin/src/types/reservation.ts
import { MediaFile, Product, ProductCategory, Promotion, Table } from './product'; // Vẫn import các type cơ bản từ product.ts
import { User } from './user'; // Import User từ user.ts

// Định nghĩa ReservationStatus ở đây
export const ReservationStatus = {
    CANCELLED: 0,
    PENDING_CONFIRMATION: 1, // Chờ xác nhận / Chờ cọc
    CONFIRMED_DEPOSIT_PAID: 2, // Đã xác nhận / Đã cọc
    CHECKED_IN: 3, // Khách đang ăn
    PENDING_PAYMENT: 4, // Chờ thanh toán đủ
    COMPLETED: 5,
    NO_SHOW: 6,
} as const;

// Interface cho chi tiết đặt bàn
export interface ReservationDetailItem {
    id: number;
    dat_ban_id: number;
    san_pham_id: number;
    so_luong: number;
    gia_tai_thoi_diem: number;
    san_pham?: { // Dữ liệu join từ getAdminReservationById
        id: number;
        ten_san_pham: string;
        media_files?: { file_url: string } | null;
    } | null;
}

// Interface chính cho đặt bàn
export interface Reservation {
    id: number;
    ma_dat_ban?: string | null;
    khach_hang_id?: number | null;
    ho_ten_khach: string;
    dien_thoai: string;
    email?: string | null;
    ngay_dat_ban: string; // Prisma trả về ISO string
    so_luong_khach: number;
    ghi_chu?: string | null;
    tong_tien?: number | null; // Tổng tiền món ăn (chưa VAT, KM)
    tien_dat_coc: number;
    trang_thai: number; // Mã trạng thái (0-6)
    khuyen_mai_id?: number | null;
    created_at: string;
    updated_at: string;

    // Dữ liệu join từ getAdminReservations / getAdminReservationById
    ban_an?: Table[] | null;
    khuyen_mai?: { giam_gia: number; loai_giam_gia: boolean } | Promotion | null;
    nguoi_dung?: {
        id: number;
        ho_ten: string;
        email: string;
        dien_thoai: string;
    } | null;
    chi_tiet_dat_ban?: ReservationDetailItem[] | null;
}

// Kiểu dữ liệu trả về từ API lấy danh sách Đặt bàn
export interface ReservationListResponse {
    message: string;
    data: Reservation[];
    total: number;
    totalPages: number;
    currentPage: number;
}

// Kiểu dữ liệu trả về từ API lấy chi tiết Đặt bàn
export interface ReservationDetailResponse {
    message: string;
    data: Reservation;
}