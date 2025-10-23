// File: packages/server/src/services/media.service.ts
import prisma from '../models';

interface MediaData {
    file_url: string;
    file_path: string;
    file_type: string;
}

/**
 * 💾 Lưu thông tin một file media mới vào CSDL
 */
export const createMediaFile = async (data: MediaData) => {
    const newMediaFile = await prisma.media_files.create({
        data: {
            file_url: data.file_url,
            file_path: data.file_path,
            file_type: data.file_type || 'image', // Mặc định là 'image'
        },
    });
    return newMediaFile; // Trả về object media file vừa tạo (chứa cả id)
};