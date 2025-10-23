// File: packages/server/src/routes/media.routes.ts
import { Router } from 'express';
import { handleCreateMediaFile } from '../controllers/media.controller';

const router = Router();

// Định nghĩa route POST để lưu thông tin file media
router.post('/', handleCreateMediaFile);

export default router;