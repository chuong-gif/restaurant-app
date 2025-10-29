// packages/server/src/routes/statistical.routes.ts
import { Router } from 'express';
import {
    handleGetOverviewStats,
    handleGetMonthlyRevenue,
    handleGetReservationStatusStats,
    handleGetRevenueByDateRange
} from '../controllers/statistical.controller';
// Không cần authenticateToken vì các route này sẽ được gắn vào adminRouter

const router = Router();

// GET /api/v1/admin/statistical/overview
router.get('/overview', handleGetOverviewStats);

// GET /api/v1/admin/statistical/monthly-revenue?year=2025
router.get('/monthly-revenue', handleGetMonthlyRevenue);

// GET /api/v1/admin/statistical/status-stats?year=2025&month=11
router.get('/status-stats', handleGetReservationStatusStats);

// GET /api/v1/admin/statistical/revenue-range?startDate=...&endDate=...
router.get('/revenue-range', handleGetRevenueByDateRange);

export default router;