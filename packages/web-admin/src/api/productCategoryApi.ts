// File mới: packages/web-admin/src/api/productCategoryApi.ts

import api from "@/api/axiosInstance";

// Định nghĩa kiểu dữ liệu cho một danh mục
interface Category {
    id: number;
    ten_danh_muc: string;
    // Thêm các trường khác nếu có
}

/**
 * 🟢 Lấy danh sách tất cả danh mục (cho admin)
 * @returns Promise<Category[]>
 */
export const getAllCategories = async (): Promise<Category[]> => {
    // Thêm cacheBuster để tránh trình duyệt dùng lại dữ liệu cũ
    const cacheBuster = `_=${new Date().getTime()}`;
    const response = await api.get(`/admin/product-categories?${cacheBuster}`);
    // Giả sử API trả về { data: [...] }, nếu không thì chỉ cần return response;
    return response.data || response;
};