// packages/admin/src/pages/Dashboard.tsx
import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Statistic, Select, DatePicker, Button, Spin, Alert } from 'antd';
import { UserOutlined, ShopOutlined, FileTextOutlined, CalendarOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react'; // Đảm bảo đã cài
import {
    useGetOverviewStatsQuery,
    useGetMonthlyRevenueQuery,
    useGetReservationStatusStatsQuery,
    useGetRevenueByDateRangeQuery,
} from '../features/dashboard/dashboardApi';
import { formatCurrency } from '../utils/FormatCurrency';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Lấy năm hiện tại
const CURRENT_YEAR = new Date().getFullYear();
// Lấy tháng hiện tại (1-12)
const CURRENT_MONTH = new Date().getMonth() + 1;

const Dashboard: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(CURRENT_MONTH); // Lọc biểu đồ tròn
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [dateRangeQuery, setDateRangeQuery] = useState({
        startDate: dayjs().startOf('month').toISOString(),
        endDate: dayjs().endOf('month').toISOString(),
    });

    // --- RTK Query Hooks ---
    const { data: overviewStats, isLoading: isLoadingStats, error: errorStats } = useGetOverviewStatsQuery();
    const { data: monthlyRevenue, isLoading: isLoadingMonthly, error: errorMonthly } = useGetMonthlyRevenueQuery({ year: selectedYear });
    const { data: statusStats, isLoading: isLoadingStatus, error: errorStatus } = useGetReservationStatusStatsQuery({ year: selectedYear, month: selectedMonth });
    const { data: rangeRevenue, isLoading: isLoadingRange, error: errorRange, refetch: refetchRangeRevenue } = useGetRevenueByDateRangeQuery(dateRangeQuery);

    // --- Xử lý sự kiện ---
    const handleFetchRangeRevenue = () => {
        if (dateRange[0] && dateRange[1]) {
            setDateRangeQuery({
                startDate: dateRange[0].toISOString(),
                endDate: dateRange[1].toISOString(),
            });
            // refetchRangeRevenue(); // RTK Query sẽ tự refetch khi dateRangeQuery thay đổi
        }
    };

    // --- Cấu hình Biểu đồ ---
    const revenueChartOption = useMemo(() => ({
        tooltip: { trigger: 'axis' },
        legend: { data: ['Doanh thu'] },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        },
        yAxis: { type: 'value', axisLabel: { formatter: (value: number) => formatCurrency(value) } },
        series: [{
            name: 'Doanh thu',
            type: 'bar',
            data: monthlyRevenue || Array(12).fill(0),
            itemStyle: { color: '#5470C6' }
        }],
    }), [monthlyRevenue]);

    const statusChartOption = useMemo(() => {
        const chartData = statusStats
            ? Object.entries(statusStats).map(([name, value]) => ({ value, name }))
            : [];

        return {
            tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
            legend: { orient: 'vertical', left: 'left', data: chartData.map(d => d.name) },
            series: [{
                name: 'Trạng thái Đơn hàng',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: chartData,
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
            }]
        };
    }, [statusStats]);

    const isLoading = isLoadingStats || isLoadingMonthly || isLoadingStatus || isLoadingRange;

    return (
        <Spin spinning={isLoading} tip="Đang tải dữ liệu thống kê...">
            <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

            {/* 4 Ô Thống kê */}
            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Tổng Khách hàng" value={overviewStats?.userCount || 0} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Tổng Sản phẩm" value={overviewStats?.productCount || 0} prefix={<ShopOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Tổng Bài viết" value={overviewStats?.blogCount || 0} prefix={<FileTextOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Tổng Đặt bàn" value={overviewStats?.reservationCount || 0} prefix={<CalendarOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Doanh thu theo khoảng ngày */}
            <Card title="Thống kê Doanh thu Tùy chọn" className="mb-4">
                <Row gutter={[16, 16]} align="bottom">
                    <Col xs={24} md={10}>
                        <label>Chọn khoảng ngày:</label>
                        <RangePicker style={{ width: '100%' }} value={dateRange} onChange={setDateRange as any} />
                    </Col>
                    <Col xs={24} md={4}>
                        <Button type="primary" onClick={handleFetchRangeRevenue} loading={isLoadingRange} style={{ width: '100%' }}>Thống kê</Button>
                    </Col>
                </Row>
                {errorRange && <Alert message="Lỗi tải dữ liệu doanh thu" type="error" className="mt-4" />}
                {!errorRange && (
                    <Row gutter={[16, 16]} className="mt-4">
                        <Col xs={24} md={12}>
                            <Card size="small">
                                <Statistic title="Tổng Doanh thu (Đã hoàn thành)" value={rangeRevenue?.totalRevenue || 0} formatter={formatCurrency} prefix={<DollarOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card size="small">
                                <Statistic title="Số lượng Đơn (Đã hoàn thành)" value={rangeRevenue?.orderCount || 0} prefix={<ShoppingCartOutlined />} />
                            </Card>
                        </Col>
                    </Row>
                )}
            </Card>

            {/* Biểu đồ */}
            <Row gutter={[16, 16]}>
                {/* Biểu đồ Doanh thu năm */}
                <Col xs={24} lg={12}>
                    <Card title={`Doanh thu theo tháng (Năm ${selectedYear})`}
                        extra={
                            <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 120 }}>
                                {/* Cho phép chọn 3 năm gần nhất */}
                                {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map(year => (
                                    <Option key={year} value={year}>{year}</Option>
                                ))}
                            </Select>
                        }>
                        {errorMonthly ? <Alert message="Lỗi tải dữ liệu" type="error" /> : <ReactEcharts option={revenueChartOption} style={{ height: '400px' }} />}
                    </Card>
                </Col>

                {/* Biểu đồ Trạng thái Đơn hàng */}
                <Col xs={24} lg={12}>
                    <Card title="Thống kê Trạng thái Đơn hàng"
                        extra={
                            <Select value={selectedMonth} onChange={setSelectedMonth} style={{ width: 140 }} placeholder="Cả năm" allowClear>
                                {/* Cho phép chọn theo tháng */}
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                    <Option key={month} value={month}>{`Tháng ${month}`}</Option>
                                ))}
                            </Select>
                        }>
                        {errorStatus ? <Alert message="Lỗi tải dữ liệu" type="error" /> : <ReactEcharts option={statusChartOption} style={{ height: '400px' }} />}
                    </Card>
                </Col>
            </Row>

        </Spin>
    );
};

export default Dashboard;