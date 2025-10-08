import { Router } from 'express';
import {
    handleGetComments,
    handleCreateComment,
    handleDeleteComment
} from '../controllers/blogComment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public route to get comments for a blog post
router.get('/blog/:blog_id', handleGetComments);

// Private route for creating a comment (requires login)
router.post('/', authenticateToken, handleCreateComment);

// Private route for admin to delete a comment
router.delete('/:id', authenticateToken, handleDeleteComment);

export default router;
