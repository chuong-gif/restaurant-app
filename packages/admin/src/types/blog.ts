// packages/admin/src/types/blog.ts
import { MediaFile, User } from './user'; // Import User và MediaFile nếu cần join

// Dựa trên bảng `danh_muc_blog`
export interface BlogCategory {
    id: number;
    ten_danh_muc: string;
    trang_thai: boolean;
    created_at?: string;
    updated_at?: string;
}

// Kiểu dữ liệu trả về từ API lấy danh sách Danh mục Blog
export interface BlogCategoryListResponse {
    message: string;
    data: BlogCategory[];
    total: number;
    totalPages: number;
    currentPage: number;
}

// Dựa trên bảng `bai_viet` và include từ service
export interface BlogPost {
    id: number;
    anh_bia_id?: number | null;
    tieu_de: string;
    noi_dung: string; // Nội dung HTML từ ReactQuill
    nguoi_dung_id?: number | null; // ID tác giả
    danh_muc_blog_id?: number | null;
    slug: string;
    created_at?: string;
    updated_at?: string;

    // Dữ liệu join từ API
    danh_muc_blog?: { ten_danh_muc: string } | null;
    nguoi_dung?: { ho_ten: string } | null; // Tên tác giả
    media_files?: { file_url: string } | null; // URL ảnh bìa
}
// Định nghĩa kiểu cho một bình luận
export interface BlogComment {
    id: number;
    noi_dung: string;
    created_at: string;
    nguoi_dung: {
        ho_ten: string;
    };
}

// Kiểu dữ liệu trả về từ API lấy danh sách Bài viết
export interface BlogPostListResponse {
    message: string;
    data: BlogPost[];
    total: number;
    totalPages: number;
    currentPage: number;
}

// Kiểu dữ liệu trả về từ API lấy chi tiết Bài viết
export interface BlogPostDetailResponse {
    message: string;
    data: BlogPost;
}
export interface BlogCommentListResponse {
    message: string;
    data: BlogComment[];
    total: number;
    totalPages: number;
    currentPage: number;
}