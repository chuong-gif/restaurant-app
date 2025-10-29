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


export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Lấy 4 số liệu tổng quan
        getOverviewStats: builder.query<OverviewStats, void>({
            query: () => '/admin/statistical/overview',
            transformResponse: (response: { message: string, data: OverviewStats }) => response.data,
            providesTags: ['Reservation', 'User', 'Product', 'BlogPost'], // Refresh khi các mục này thay đổi
        }),

        // 2. Lấy doanh thu theo tháng (cả năm)
        getMonthlyRevenue: builder.query<MonthlyRevenue, { year: number }>({
            query: ({ year }) => ({
                url: '/admin/statistical/monthly-revenue',
                params: { year },
            }),
            transformResponse: (response: { message: string, data: MonthlyRevenue }) => response.data,
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

    }),
});

export const {
    useGetOverviewStatsQuery,
    useGetMonthlyRevenueQuery,
    useGetReservationStatusStatsQuery,
    useGetRevenueByDateRangeQuery,
} = dashboardApi;