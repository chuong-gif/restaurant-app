// File: packages/web-admin/src/api/mediaApi.ts
import api from "@/api/axiosInstance";

interface MediaPayload {
    file_url: string;
    file_path: string;
    file_type?: string;
}

/**
 * 🟢 Gửi thông tin file đã tải lên Firebase về server để lưu vào CSDL
 */
export const createMediaFile = async (payload: MediaPayload) => {
    return api.post("/admin/media", payload);
};