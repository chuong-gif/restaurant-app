// File: packages/server/src/controllers/media.controller.ts
import { Request, Response } from 'express';
import * as mediaService from '../services/media.service';

/**
 * 🎮 Controller để tạo mới một media file record
 */
export const handleCreateMediaFile = async (req: Request, res: Response) => {
    try {
        const { file_url, file_path, file_type } = req.body;

        if (!file_url || !file_path) {
            return res.status(400).json({ message: 'file_url và file_path là bắt buộc.' });
        }

        const newMediaFile = await mediaService.createMediaFile({ file_url, file_path, file_type });

        // Trả về status 201 và toàn bộ object media file vừa tạo
        res.status(201).json({ message: "Lưu thông tin file thành công", data: newMediaFile });

    } catch (error: any) {
        res.status(500).json({ message: "Lỗi server khi lưu file", error: error.message });
    }
};