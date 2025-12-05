// packages/server/src/routes/statistical.routes.ts
import { Router } from 'express';
import {
    handleGetOverviewStats,
    handleGetMonthlyFinancials,
    handleGetReservationStatusStats,
    handleGetRevenueByDateRange,
    handleGetInventoryStats,
    handleGetLowStockAlerts,
    handleGetTopSellingProducts
} from '../controllers/statistical.controller';

const router = Router();

// GET /api/v1/admin/statistical/overview
router.get('/overview', handleGetOverviewStats);

// GET /api/v1/admin/statistical/monthly-revenue?year=2025
router.get('/financials', handleGetMonthlyFinancials);

// GET /api/v1/admin/statistical/status-stats?year=2025&month=11
router.get('/status-stats', handleGetReservationStatusStats);

// GET /api/v1/admin/statistical/revenue-range?startDate=...&endDate=...
router.get('/revenue-range', handleGetRevenueByDateRange);

// === THÊM 2 ROUTE NÀY ===
// GET /api/v1/admin/statistical/inventory-stats
router.get('/inventory-stats', handleGetInventoryStats);

// GET /api/v1/admin/statistical/low-stock
router.get('/low-stock', handleGetLowStockAlerts);
// =====================
router.get('/top-products', handleGetTopSellingProducts);

export default router;