import api from "@/api/axiosInstance"; // bạn đã có file axiosInstance.ts nên import thế này là đúng

// 🟢 Lấy danh sách sản phẩm
export const getAllProducts = async () => {
    return api.get("/products");
};

// 🟢 Thêm sản phẩm
export const createProduct = async (data: any) => {
    return api.post("/products", data);
};

// 🟢 Cập nhật sản phẩm
export const updateProduct = async (id: number, data: any) => {
    return api.put(`/products/${id}`, data);
};

// 🟢 Xóa sản phẩm
export const deleteProduct = async (id: number) => {
    return api.delete(`/products/${id}`);
};
