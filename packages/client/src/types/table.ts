// packages/client/src/types/table.ts

// Kiểu dữ liệu cho file media (ảnh/video của bàn)
type MediaFile = {
    id: number;
    file_url: string;
};

// Kiểu dữ liệu chính cho Bàn Ăn (dựa trên table.service.ts)
export type BanAn = {
    id: number;
    so_ban: number;
    suc_chua: number;
    mo_ta_vi_tri: string | null;
    tang: number;
    trang_thai: boolean;

    // Quan hệ ảnh/video
    media_files_ban_an_anh_ban_idTomedia_files?: MediaFile | null;
    media_files_ban_an_video_ban_idTomedia_files?: MediaFile | null;
};

// Kiểu dữ liệu cho API response (dựa trên table.controller.ts)
export type TablesApiResponse = {
    message: string;
    data: BanAn[];
};