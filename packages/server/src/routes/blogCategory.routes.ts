import { Router } from 'express';
import {
    handleGetCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
} from '../controllers/blogCategory.controller';

const router = Router();

router.get('/', handleGetCategories);
router.post('/', handleCreateCategory);
router.patch('/:id', handleUpdateCategory); // Sử dụng PATCH cho cập nhật từng phần
router.delete('/:id', handleDeleteCategory);

export default router;
