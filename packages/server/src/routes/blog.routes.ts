import { Router } from 'express';
import {
    handleGetBlogs,
    handleCreateBlog,
    handleGetBlogById,
    handleGetBlogBySlug,
    handleUpdateBlog,
    handleDeleteBlog
} from '../controllers/blog.controller';

const router = Router();

// Routes for admin panel
router.get('/', handleGetBlogs);
router.post('/', handleCreateBlog);
router.get('/:id', handleGetBlogById);
router.put('/:id', handleUpdateBlog); // Dùng PUT cho cập nhật toàn bộ
router.patch('/:id', handleUpdateBlog); // Dùng PATCH cho cập nhật từng phần
router.delete('/:id', handleDeleteBlog);

// Public route for client website
router.get('/slug/:slug', handleGetBlogBySlug);

export default router;
