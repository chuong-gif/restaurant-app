// packages/admin/src/types/product.ts

// Dựa trên bảng `media_files`
export interface MediaFile {
    id: number;
    file_path: string;
    file_url: string;
    file_type: string;
}

// Dựa trên bảng `danh_muc_san_pham`
export interface ProductCategory {
    id: number;
    ten_danh_muc: string;
    trang_thai: boolean;
}

// Dựa trên bảng `san_pham`
export interface Product {
    id: number;
    ma_san_pham: string;
    ten_san_pham: string;
    gia_ban: number;
    gia_khuyen_mai: number;
    hinh_anh_id: number | null;
    mo_ta: string | null;
    trang_thai: boolean; // tinyint(1) trong SQL -> boolean
    danh_muc_id: number;
    created_at: string;
    updated_at: string;

    // Dữ liệu join (từ `include` trong service)
    media_files?: MediaFile | null;
    danh_muc_san_pham?: ProductCategory | null;
}

// Kiểu dữ liệu trả về từ API lấy danh sách
export interface ProductListResponse {
    message: string;
    data: Product[];
    total: number;
    totalPages: number;
    currentPage: number;
}
// Dựa trên bảng `ban_an`
export interface Table {
    id: number;
    so_ban: number; // Bắt buộc là number
    suc_chua: number; // Bắt buộc là number
    trang_thai: boolean; // <-- Đảm bảo là boolean
    anh_ban_id?: number | null;
    video_ban_id?: number | null;
    mo_ta_vi_tri?: string | null;
    tang?: number | null;
    created_at?: string;
    updated_at?: string;
    media_files_ban_an_anh_ban_idTomedia_files?: { id: number; file_url: string } | null;
    media_files_ban_an_video_ban_idTomedia_files?: { id: number; file_url: string } | null;
}

// Dựa trên bảng `khuyen_mai` (chỉ lấy các trường cần thiết)
export interface Promotion {
    id: number;
    ma_khuyen_mai: string;
    giam_gia: number;
    loai_giam_gia: boolean; // 0: %, 1: Tiền mặt
}

// Dựa trên bảng `chi_tiet_dat_ban` và include từ service
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
export interface TableListResponse {
    message: string;
    data: Table[];
    total: number;
    totalPages: number;
    currentPage: number;
}