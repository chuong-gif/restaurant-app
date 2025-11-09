// packages/client/src/types/comment.ts
import { User } from './user';

// Kiểu cho một bình luận
export type BlogComment = {
    id: number;
    noi_dung: string;
    created_at: string; // ISO string
    nguoi_dung_id: number;
    bai_viet_id: number;

    // Quan hệ
    nguoi_dung: {
        ho_ten: string;
        media_files?: { file_url: string } | null; // Lấy avatar
    };
};

// Kiểu cho API response
export type CommentsApiResponse = {
    message: string;
    data: BlogComment[];
    total: number;
    totalPages: number;
    currentPage: number;
};