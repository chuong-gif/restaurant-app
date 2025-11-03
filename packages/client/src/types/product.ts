// packages/client/src/types/product.ts

// Kiểu dữ liệu cho file media (dựa trên schema)
type MediaFile = {
    id: number;
    file_url: string;
};

// Kiểu dữ liệu cho danh mục (dựa trên schema)
type Category = {
    id: number;
    ten_danh_muc: string;
};

// Kiểu dữ liệu chính cho Sản phẩm (dựa trên product.service.ts)
export type SanPham = {
    id: number;
    ten_san_pham: string;
    gia_ban: number;
    gia_khuyen_mai: number;
    mo_ta: string | null;
    trang_thai: boolean;
    media_files?: MediaFile | null;      // Quan hệ
    danh_muc_san_pham?: Category | null; // Quan hệ
};

// Kiểu dữ liệu cho API response (dựa trên product.controller.ts)
export type ProductsApiResponse = {
    message: string;
    data: SanPham[];
    total: number;
    totalPages: number;
    currentPage: number;
};