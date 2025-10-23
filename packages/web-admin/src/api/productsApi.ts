import api from "@/api/axiosInstance"; // bạn đã có file axiosInstance.ts nên import thế này là đúng

// 🟢 Lấy danh sách sản phẩm
export const getAllProducts = async () => {
    const cacheBuster = `_=${new Date().getTime()}`;
    // 👇 SỬA LẠI "pproducts" THÀNH "products" Ở ĐÂY
    return api.get(`/admin/products?${cacheBuster}`);
};

// 🟢 Thêm sản phẩm
export const createProduct = async (data: any) => {
    return api.post("/admin/products", data);
};

// 🟢 Cập nhật sản phẩm
export const updateProduct = async (id: number, data: any) => {
    return api.put(`/admin/products/${id}`, data);
};

// 🟢 Xóa sản phẩm
export const deleteProduct = async (id: number) => {
    return api.delete(`/admin/products/${id}`);
};
