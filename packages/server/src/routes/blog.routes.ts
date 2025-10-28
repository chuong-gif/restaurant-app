import { Router } from 'express';
import {
    handleGetBlogsAdmin,
    handleCreateBlog,
    handleGetBlogById,
    handleGetBlogBySlug,
    handleUpdateBlog,
    handleDeleteBlog
} from '../controllers/blog.controller';

const router = Router();

// Routes for admin panel
router.get('/', handleGetBlogsAdmin);
router.post('/', handleCreateBlog);
router.get('/:id', handleGetBlogById);
router.put('/:id', handleUpdateBlog);
router.patch('/:id', handleUpdateBlog);
router.delete('/:id', handleDeleteBlog);

// Public route for client website
router.get('/slug/:slug', handleGetBlogBySlug);

export default router;
