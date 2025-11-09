// packages/server/src/routes/blogComment.routes.ts
import { Router } from 'express';
import {
    handleGetComments,
    handleCreateComment,
    handleDeleteComment,
    handleUpdateComment // <-- THÊM IMPORT NÀY
} from '../controllers/blogComment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public route to get comments for a blog post
router.get('/blog/:blog_id', handleGetComments);

// Private route for creating a comment (requires login)
router.post('/', authenticateToken, handleCreateComment);

// Private route for updating a comment (requires login)
router.patch('/:id', authenticateToken, handleUpdateComment); // <-- THÊM DÒNG NÀY

// Private route for deleting a comment (requires login)
router.delete('/:id', authenticateToken, handleDeleteComment); // Đã sửa controller
// =============================

export default router;