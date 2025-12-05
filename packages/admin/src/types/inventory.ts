// packages/admin/src/types/inventory.ts

export interface Supplier {
    id: number;
    ten_nha_cung_cap: string; // Khớp với DB
    so_dien_thoai?: string | null;
    email?: string | null;
    dia_chi?: string | null;
    ghi_chu?: string | null;
    trang_thai: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Material {
    id: number;
    ten_nguyen_lieu: string;
    don_vi_tinh: string;
    so_luong_ton: number;
    muc_canh_bao: number;
    gia_nhap_cuoi?: number | null;
    trang_thai: boolean;
    ghi_chu?: string | null;
    created_at?: string;
    updated_at?: string;
}

// Kiểu trả về chung cho danh sách phân trang
export interface InventoryListResponse<T> {
    data: T[];
    total: number;
    totalPages: number;
    currentPage: number;
}