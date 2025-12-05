// packages/admin/src/features/dashboard/dashboardApi.ts
import { baseApi } from '../../services/baseApi';

// Kiểu dữ liệu cho 4 ô
interface OverviewStats {
    userCount: number;
    productCount: number;
    blogCount: number;
    reservationCount: number;
}
// Kiểu dữ liệu cho doanh thu 12 tháng
type MonthlyRevenue = number[];

// Kiểu dữ liệu cho trạng thái đơn hàng (VD: { "Hoàn thành": 5, "Đã hủy": 2 })
type ReservationStatusStats = Record<string, number>;

// Kiểu dữ liệu cho doanh thu theo khoảng ngày
interface DateRangeRevenue {
    totalRevenue: number;
    orderCount: number;
}
interface InventoryStats {
    currentInventoryValue: number;
    importCostThisMonth: number;
}

interface LowStockItem {
    id: number;
    ten_nguyen_lieu: string;
    so_luong_ton: number;
    muc_canh_bao: number;
    don_vi_tinh: string;
}
interface MonthlyFinancials {
    revenue: number[];
    cost: number[];
    profit: number[];
}

interface TopProduct {
    name: string;
    value: number;
}

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Lấy 4 số liệu tổng quan
        getOverviewStats: builder.query<OverviewStats, void>({
            query: () => '/admin/statistical/overview',
            transformResponse: (response: { message: string, data: OverviewStats }) => response.data,
            providesTags: ['Reservation', 'User', 'Product', 'BlogPost'], // Refresh khi các mục này thay đổi
        }),

        // 2. Lấy doanh thu theo tháng (cả năm)
        getMonthlyFinancials: builder.query<MonthlyFinancials, { year: number }>({
            query: ({ year }) => ({
                url: '/admin/statistical/financials',
                params: { year },
            }),
            transformResponse: (response: { data: MonthlyFinancials }) => response.data,
            providesTags: ['Reservation', 'Supplier'], // Refresh khi có đơn hoặc nhập kho
        }),

        getTopSellingProducts: builder.query<TopProduct[], void>({
            query: () => '/admin/statistical/top-products',
            transformResponse: (response: { data: TopProduct[] }) => response.data,
            providesTags: ['Reservation'],
        }),

        // 3. Lấy thống kê trạng thái đơn hàng
        getReservationStatusStats: builder.query<ReservationStatusStats, { year: number, month?: number }>({
            query: ({ year, month }) => ({
                url: '/admin/statistical/status-stats',
                params: { year, month },
            }),
            transformResponse: (response: { message: string, data: ReservationStatusStats }) => response.data,
            providesTags: ['Reservation'],
        }),

        // 4. Lấy doanh thu theo khoảng ngày (cho phần chọn ngày)
        getRevenueByDateRange: builder.query<DateRangeRevenue, { startDate: string, endDate: string }>({
            query: ({ startDate, endDate }) => ({
                url: '/admin/statistical/revenue-range',
                params: { startDate, endDate },
            }),
            transformResponse: (response: { message: string, data: DateRangeRevenue }) => response.data,
            providesTags: ['Reservation'],
        }),
        // 5. Thống kê kho (Chi phí, Giá trị)
        getInventoryStats: builder.query<InventoryStats, void>({
            query: () => '/admin/statistical/inventory-stats',
            transformResponse: (response: { data: InventoryStats }) => response.data,
            providesTags: ['Material', 'Supplier'], // Refresh khi nhập kho
        }),

        // 6. Cảnh báo tồn kho
        getLowStockAlerts: builder.query<LowStockItem[], void>({
            query: () => '/admin/statistical/low-stock',
            transformResponse: (response: { data: LowStockItem[] }) => response.data,
            providesTags: ['Material'],
        }),

    }),
});

export const {
    useGetOverviewStatsQuery,
    useGetMonthlyFinancialsQuery,
    useGetTopSellingProductsQuery,
    useGetReservationStatusStatsQuery,
    useGetRevenueByDateRangeQuery,
    useGetInventoryStatsQuery,
    useGetLowStockAlertsQuery,
} = dashboardApi;