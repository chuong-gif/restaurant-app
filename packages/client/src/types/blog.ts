// packages/client/src/types/blog.ts
import { User } from './user'; // Import kiểu User

// Kiểu dữ liệu cho file media
type MediaFile = {
    id: number;
    file_url: string;
};

// Kiểu cho danh mục Blog
export type BlogCategory = {
    id: number;
    ten_danh_muc: string;
    trang_thai: boolean;
};

// Kiểu cho Danh sách Danh mục
export type BlogCategoriesApiResponse = {
    message: string;
    data: BlogCategory[];
};

// Kiểu dữ liệu chính cho Bài viết
export type Blog = {
    id: number;
    tieu_de: string;
    noi_dung: string;
    slug: string;
    created_at: string; // ISO string

    // Quan hệ
    danh_muc_blog?: BlogCategory | null;
    media_files?: MediaFile | null;
    nguoi_dung?: Pick<User, 'ho_ten'> | null; // Chỉ lấy họ tên tác giả
};

// Kiểu dữ liệu cho API response
export type BlogsApiResponse = {
    message: string;
    data: Blog[];
    total: number;
    totalPages: number;
    currentPage: number;
};