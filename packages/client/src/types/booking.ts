// packages/client/src/types/booking.ts
import { SanPham } from './product';
import { BanAn } from './table';

// Kiểu dữ liệu cho Chi tiết món ăn trong đơn
type ChiTietDatBan = {
    so_luong: number;
    gia_tai_thoi_diem: number;
    san_pham: Pick<SanPham, 'ten_san_pham' | 'media_files'>;
};

// Kiểu dữ liệu cho Khuyến mãi
type KhuyenMai = {
    ma_khuyen_mai: string;
    giam_gia: number;
    loai_giam_gia: boolean; // true = %, false = tiền
};

// Kiểu dữ liệu chính cho Đơn Đặt Bàn (Chi tiết)
export type DatBan = {
    id: number;
    ma_dat_ban: string | null;
    ho_ten_khach: string;
    dien_thoai: string;
    email: string | null;
    ngay_dat_ban: string; // ISO String
    so_luong_khach: number;
    ghi_chu: string | null;
    tong_tien: number | null; // Tổng tiền món ăn (chưa thuế, chưa giảm)
    tien_dat_coc: number;
    trang_thai: number; // 0-6
    so_lan_doi: number;

    // Quan hệ
    ban_an: BanAn | null;
    khuyen_mai: KhuyenMai | null;
    chi_tiet_dat_ban: ChiTietDatBan[];
};

// Kiểu dữ liệu cho đơn trong Danh sách (List)
// (Dựa trên hàm `getBookingsByUserId` [cite: 399-406])
export type DatBanItem = {
    id: number;
    ma_dat_ban: string | null;
    ngay_dat_ban: string;
    so_luong_khach: number;
    tong_tien: number | null;
    tien_dat_coc: number;
    trang_thai: number;
    ban_an: { so_ban: number } | null;
};