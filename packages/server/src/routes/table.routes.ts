import { Router } from 'express';
import {
    handleGetTablesAdmin,
    handleFilterByDate,
    handleCreateTable,
    handleUpdateTable,
    handleDeleteTable,
} from '../controllers/table.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// ===== Admin Routes (Protected) =====
router.get('/', authenticateToken, handleGetTablesAdmin);
router.post('/', authenticateToken, handleCreateTable);
router.put('/:id', authenticateToken, handleUpdateTable);
router.patch('/:id', authenticateToken, handleUpdateTable);
router.delete('/:id', authenticateToken, handleDeleteTable);

// ===== Public Routes (For Client) =====
router.get('/filter-by-date', handleFilterByDate);

export default router;
