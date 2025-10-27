// packages/server/src/routes/table.routes.ts
import { Router } from 'express';
import {
    handleGetTablesAdmin,
    handleCreateTable,
    handleUpdateTable,
    handleDeleteTable,
    handleGetAvailableTablesByDate // Giữ lại route này cho public nếu cần
} from '../controllers/table.controller';
import { authenticateToken } from '../middlewares/auth.middleware'; // Import middleware

const router = Router();

// === Admin Routes (Yêu cầu xác thực) ===
const adminRouter = Router();
adminRouter.use(authenticateToken); // Áp dụng middleware cho tất cả route admin bàn ăn

// GET /api/v1/admin/tables -> Lấy danh sách bàn (có lọc)
adminRouter.get('/', handleGetTablesAdmin);

// POST /api/v1/admin/tables -> Tạo bàn mới
adminRouter.post('/', handleCreateTable);

// PATCH /api/v1/admin/tables/:id -> Cập nhật bàn
adminRouter.patch('/:id', handleUpdateTable);

// DELETE /api/v1/admin/tables/:id -> Xóa bàn
adminRouter.delete('/:id', handleDeleteTable);


// === Public Routes (Không yêu cầu xác thực) ===
const publicRouter = Router();

// GET /api/v1/public/tables/available?date=...&partySize=... -> Lấy bàn trống theo ngày, sức chứa
publicRouter.get('/available', handleGetAvailableTablesByDate);


// === Gắn router con vào router chính ===
// Gắn router admin vào /admin/tables
router.use('/admin/tables', adminRouter);
// Gắn router public vào /public/tables
router.use('/public/tables', publicRouter);


export default router; // Export router chính đã bao gồm cả admin và public