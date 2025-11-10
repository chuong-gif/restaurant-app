// packages/admin/src/pages/Dashboard.tsx
import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Statistic, Select, DatePicker, Button, Spin, Alert } from 'antd';
import { UserOutlined, ShopOutlined, FileTextOutlined, CalendarOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
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

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

const Dashboard: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(CURRENT_MONTH);
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
        }
    };

    // --- Cấu hình Biểu đồ ---
    const revenueChartOption = useMemo(() => ({
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(148, 148, 255, 0.3)',
            textStyle: { color: '#333' }
        },
        legend: {
            data: ['Doanh thu'],
            textStyle: { color: '#666' }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            axisLine: { lineStyle: { color: 'rgba(148, 148, 255, 0.3)' } }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: (value: number) => formatCurrency(value),
                color: '#666'
            }
        },
        series: [{
            name: 'Doanh thu',
            type: 'bar',
            data: monthlyRevenue || Array(12).fill(0),
            itemStyle: {
                color: 'rgba(148, 148, 255, 0.8)',
                borderColor: 'rgba(148, 148, 255, 0.3)',
                borderWidth: 2,
                borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(148, 148, 255, 0.5)'
                }
            }
        }],
    }), [monthlyRevenue]);

    const statusChartOption = useMemo(() => {
        const chartData = statusStats
            ? Object.entries(statusStats).map(([name, value]) => ({ value, name }))
            : [];

        return {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(148, 148, 255, 0.3)',
                textStyle: { color: '#333' }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: chartData.map(d => d.name),
                textStyle: { color: '#666' }
            },
            series: [{
                name: 'Trạng thái Đơn hàng',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: chartData,
                itemStyle: {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 2
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(148, 148, 255, 0.5)'
                    }
                }
            }]
        };
    }, [statusStats]);

    const isLoading = isLoadingStats || isLoadingMonthly || isLoadingStatus || isLoadingRange;

    return (
        <Spin spinning={isLoading} tip="Đang tải dữ liệu thống kê...">
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-fade-in">
                    Dashboard Analytics
                </h2>

                {/* 4 Ô Thống kê */}
                <Row gutter={[24, 24]} className="mb-8">
                    {[
                        { title: "Tổng Khách hàng", value: overviewStats?.userCount, icon: UserOutlined, color: "from-blue-400 to-cyan-400" },
                        { title: "Tổng Sản phẩm", value: overviewStats?.productCount, icon: ShopOutlined, color: "from-purple-400 to-pink-400" },
                        { title: "Tổng Bài viết", value: overviewStats?.blogCount, icon: FileTextOutlined, color: "from-green-400 to-teal-400" },
                        { title: "Tổng Đặt bàn", value: overviewStats?.reservationCount, icon: CalendarOutlined, color: "from-orange-400 to-red-400" }
                    ].map((item, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <item.icon className="text-white text-xl" />
                                </div>
                                <Statistic
                                    title={<span className="text-gray-600">{item.title}</span>}
                                    value={item.value || 0}
                                    valueStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                                    className="font-bold"
                                />
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* Doanh thu theo khoảng ngày */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 animate-fade-in">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Thống kê Doanh thu Tùy chọn</h3>
                    <p className="text-gray-500 text-sm mb-6">Chọn khoảng thời gian để xem báo cáo doanh thu chi tiết</p>

                    <Row gutter={[16, 16]} align="bottom">
                        <Col xs={24} md={10}>
                            <label className="block text-gray-600 mb-2">Chọn khoảng ngày:</label>
                            <RangePicker
                                style={{ width: '100%' }}
                                value={dateRange}
                                onChange={setDateRange as any}
                                className="rounded-xl border-white/30"
                            />
                        </Col>
                        <Col xs={24} md={4}>
                            <Button
                                type="primary"
                                onClick={handleFetchRangeRevenue}
                                loading={isLoadingRange}
                                style={{ width: '100%' }}
                                className="h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-lg hover:shadow-xl transition-all"
                            >
                                Thống kê
                            </Button>
                        </Col>
                    </Row>

                    {errorRange && (
                        <Alert message="Lỗi tải dữ liệu doanh thu" type="error" className="mt-4 rounded-xl" />
                    )}

                    {!errorRange && (
                        <Row gutter={[16, 16]} className="mt-6">
                            <Col xs={24} md={12}>
                                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-lg transition-all hover:shadow-xl">
                                    <Statistic
                                        title="Tổng Doanh thu (Đã hoàn thành)"
                                        value={rangeRevenue?.totalRevenue || 0}
                                        formatter={formatCurrency}
                                        prefix={<DollarOutlined className="text-green-500" />}
                                        valueStyle={{ color: '#10B981' }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-lg transition-all hover:shadow-xl">
                                    <Statistic
                                        title="Số lượng Đơn (Đã hoàn thành)"
                                        value={rangeRevenue?.orderCount || 0}
                                        prefix={<ShoppingCartOutlined className="text-blue-500" />}
                                        valueStyle={{ color: '#3B82F6' }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    )}
                </div>

                {/* Biểu đồ */}
                <Row gutter={[24, 24]}>
                    {/* Biểu đồ Doanh thu năm */}
                    <Col xs={24} lg={12}>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl animate-slide-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-700">
                                    Doanh thu theo tháng (Năm {selectedYear})
                                </h3>
                                <Select
                                    value={selectedYear}
                                    onChange={setSelectedYear}
                                    style={{ width: 120 }}
                                    className="rounded-xl"
                                >
                                    {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map(year => (
                                        <Option key={year} value={year}>{year}</Option>
                                    ))}
                                </Select>
                            </div>
                            {errorMonthly ? (
                                <Alert message="Lỗi tải dữ liệu" type="error" className="rounded-xl" />
                            ) : (
                                <ReactEcharts
                                    option={revenueChartOption}
                                    style={{ height: '400px' }}
                                />
                            )}
                        </div>
                    </Col>

                    {/* Biểu đồ Trạng thái Đơn hàng */}
                    <Col xs={24} lg={12}>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl animate-slide-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-700">
                                    Thống kê Trạng thái Đơn hàng
                                </h3>
                                <Select
                                    value={selectedMonth}
                                    onChange={setSelectedMonth}
                                    style={{ width: 140 }}
                                    placeholder="Cả năm"
                                    allowClear
                                    className="rounded-xl"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                        <Option key={month} value={month}>{`Tháng ${month}`}</Option>
                                    ))}
                                </Select>
                            </div>
                            {errorStatus ? (
                                <Alert message="Lỗi tải dữ liệu" type="error" className="rounded-xl" />
                            ) : (
                                <ReactEcharts
                                    option={statusChartOption}
                                    style={{ height: '400px' }}
                                />
                            )}
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Thêm CSS cho animations */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out; }
                .animate-slide-up { animation: slide-up 0.6s ease-out; }
            `}</style>
        </Spin>
    );
};

export default Dashboard;