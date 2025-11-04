// packages/client/src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import unidecode from "unidecode"; // <-- THÊM DÒNG NÀY

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// === THÊM CÁC HÀM MỚI TỪ Home.js VÀO ĐÂY ===

/**
 * Tạo slug từ tên (dựa trên Home.js )
 */
export const createSlug = (name: string) => {
  return unidecode(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // thay thế ký tự không hợp lệ bằng -
    .replace(/-+/g, "-")       // loại bỏ các dấu -- liên tiếp
    .replace(/^-+/, "")         // xóa dấu - ở đầu
    .replace(/-+$/, "");        // xóa dấu - ở cuối
};

/**
 * Định dạng tiền tệ (dựa trên Home.js )
 */
export const formatCurrency = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};