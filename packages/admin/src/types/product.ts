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