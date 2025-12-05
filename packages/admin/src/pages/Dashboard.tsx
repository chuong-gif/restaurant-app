import React, { useState, useMemo } from 'react';
import { Row, Col, Select, DatePicker, Button, Spin, Alert, Table, Tag, Progress } from 'antd'; // Đã xóa Statistic
import {
    UserOutlined, ShopOutlined, FileTextOutlined, CalendarOutlined,
    RiseOutlined, FallOutlined, WarningOutlined, WalletOutlined, FireOutlined
} from '@ant-design/icons'; // Đã xóa DollarOutlined, ShoppingCartOutlined
import ReactEcharts from 'echarts-for-react';
// === THÊM IMPORT NÀY ĐỂ DÙNG MÀU GRADIENT ===
import * as echarts from 'echarts';
// ============================================
import {
    useGetOverviewStatsQuery,
    useGetMonthlyFinancialsQuery,
    useGetReservationStatusStatsQuery,
    useGetRevenueByDateRangeQuery,
    useGetInventoryStatsQuery,
    useGetLowStockAlertsQuery,
    useGetTopSellingProductsQuery
} from '../features/dashboard/dashboardApi';
import { formatCurrency } from '../utils/FormatCurrency';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

// Component thẻ nhỏ
const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] animate-slide-up">
        <div className="flex items-center">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white text-xl mr-4 shadow-lg`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
                <h4 className="text-2xl font-bold text-gray-800 m-0">{value || 0}</h4>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(CURRENT_MONTH);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [dateRangeQuery, setDateRangeQuery] = useState({
        startDate: dayjs().startOf('month').toISOString(),
        endDate: dayjs().endOf('month').toISOString(),
    });

    const { data: overviewStats, isLoading: load1 } = useGetOverviewStatsQuery();
    const { data: financials, isLoading: load2, error: errorFinancials } = useGetMonthlyFinancialsQuery({ year: selectedYear });
    const { data: statusStats, isLoading: load3, error: errorStatus } = useGetReservationStatusStatsQuery({ year: selectedYear, month: selectedMonth });
    const { data: rangeRevenue, isLoading: load4, error: errorRange } = useGetRevenueByDateRangeQuery(dateRangeQuery);

    const { data: inventoryStats, isLoading: load5 } = useGetInventoryStatsQuery();
    const { data: lowStockItems, isLoading: load6 } = useGetLowStockAlertsQuery();
    const { data: topProducts, isLoading: load7 } = useGetTopSellingProductsQuery();

    const isLoading = load1 || load2 || load3 || load4 || load5 || load6 || load7;

    const currentRevenue = rangeRevenue?.totalRevenue || 0;
    const currentCost = inventoryStats?.importCostThisMonth || 0;
    const estimatedProfit = currentRevenue - currentCost;

    const handleFetchRangeRevenue = () => {
        if (dateRange[0] && dateRange[1]) {
            setDateRangeQuery({
                startDate: dateRange[0].toISOString(),
                endDate: dateRange[1].toISOString(),
            });
        }
    };

    const revenueChartOption = useMemo(() => ({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'] },
        yAxis: { type: 'value' },
        series: [{
            name: 'Doanh thu', type: 'bar', data: financials?.revenue || [],
            itemStyle: { color: new Date().getFullYear() === selectedYear ? '#6366f1' : '#cbd5e1', borderRadius: [4, 4, 0, 0] }
        }],
    }), [financials, selectedYear]);

    // --- BIỂU ĐỒ TÀI CHÍNH (THU - CHI - LỢI NHUẬN) ---
    const financialChartOption = useMemo(() => ({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['Doanh thu', 'Chi phí nhập', 'Lợi nhuận gộp'], bottom: 0 },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', data: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'] },
        yAxis: { type: 'value' },
        series: [
            {
                name: 'Doanh thu', type: 'bar', data: financials?.revenue || [],
                itemStyle: { color: '#6366f1', borderRadius: [4, 4, 0, 0] }
            },
            {
                name: 'Chi phí nhập', type: 'bar', data: financials?.cost || [],
                itemStyle: { color: '#ef4444', borderRadius: [4, 4, 0, 0] }
            },
            {
                name: 'Lợi nhuận gộp', type: 'line', data: financials?.profit || [],
                itemStyle: { color: '#10b981' }, smooth: true, symbolSize: 8
            }
        ],
    }), [financials]);

    // --- BIỂU ĐỒ TOP SẢN PHẨM ---
    const topProductOption = useMemo(() => ({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'value', boundaryGap: [0, 0.01] },
        yAxis: { type: 'category', data: topProducts?.map(p => p.name).reverse() || [] },
        series: [{
            name: 'Số lượng bán', type: 'bar',
            data: topProducts?.map(p => p.value).reverse() || [],
            itemStyle: {
                // === SỬA LỖI TẠI ĐÂY: Dùng echarts.graphic thay vì ReactEcharts.graphic ===
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#8b5cf6' }, { offset: 1, color: '#ec4899' }]),
                borderRadius: [0, 20, 20, 0]
            },
            label: { show: true, position: 'right' }
        }]
    }), [topProducts]);

    const statusChartOption = useMemo(() => ({
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center' },
        series: [{
            type: 'pie', radius: ['40%', '70%'], center: ['50%', '60%'],
            itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
            data: statusStats ? Object.entries(statusStats).map(([name, value]) => ({ value, name })) : []
        }]
    }), [statusStats]);

    const lowStockColumns = [
        { title: 'Nguyên liệu', dataIndex: 'ten_nguyen_lieu', key: 'name', render: (text: string) => <span className="font-medium text-gray-700">{text}</span> },
        { title: 'Tồn kho', dataIndex: 'so_luong_ton', key: 'stock', render: (stock: number, record: any) => <span className="text-red-600 font-bold">{stock} / {record.muc_canh_bao} {record.don_vi_tinh}</span> },
        { title: 'TT', key: 'status', render: () => <Tag color="red" icon={<WarningOutlined />}>!</Tag> }
    ];

    return (
        <Spin spinning={isLoading} tip="Đang tải dữ liệu thống kê...">
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Dashboard Analytics
                        </h2>
                        <p className="text-gray-500">Tổng quan tình hình kinh doanh</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
                        <CalendarOutlined className="text-blue-500" /> <span className="font-medium text-gray-700">{dayjs().format('DD/MM/YYYY')}</span>
                    </div>
                </div>

                {/* 1. TỔNG QUAN */}
                <Row gutter={[20, 20]} className="mb-8">
                    <Col xs={24} sm={12} lg={6}><StatCard title="Khách hàng" value={overviewStats?.userCount} icon={<UserOutlined />} color="bg-blue-500" /></Col>
                    <Col xs={24} sm={12} lg={6}><StatCard title="Sản phẩm" value={overviewStats?.productCount} icon={<ShopOutlined />} color="bg-purple-500" /></Col>
                    <Col xs={24} sm={12} lg={6}><StatCard title="Bài viết" value={overviewStats?.blogCount} icon={<FileTextOutlined />} color="bg-green-500" /></Col>
                    <Col xs={24} sm={12} lg={6}><StatCard title="Đơn đặt bàn" value={overviewStats?.reservationCount} icon={<CalendarOutlined />} color="bg-orange-500" /></Col>
                </Row>

                {/* 2. TÀI CHÍNH & KHO (MỚI) */}
                <h3 className="text-xl font-bold text-gray-700 mb-4">Tài chính & Kho (Tháng {CURRENT_MONTH})</h3>
                <Row gutter={[20, 20]} className="mb-8">
                    <Col xs={24} md={8}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div><p className="text-gray-500 text-sm">Doanh thu tạm tính</p><h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(currentRevenue)}</h3></div>
                                <div className="p-3 bg-green-50 rounded-xl"><RiseOutlined className="text-green-500 text-xl" /></div>
                            </div>
                            <Progress percent={70} showInfo={false} strokeColor="#10B981" trailColor="#ECFDF5" />
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div><p className="text-gray-500 text-sm">Chi phí Nhập hàng</p><h3 className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(currentCost)}</h3></div>
                                <div className="p-3 bg-red-50 rounded-xl"><FallOutlined className="text-red-500 text-xl" /></div>
                            </div>
                            <Progress percent={45} showInfo={false} strokeColor="#EF4444" trailColor="#FEF2F2" />
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg h-full text-white">
                            <div className="flex justify-between items-start mb-4">
                                <div><p className="text-indigo-100 text-sm">Lợi nhuận ước tính</p><h3 className="text-3xl font-bold mt-1">{formatCurrency(estimatedProfit)}</h3></div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><WalletOutlined className="text-white text-xl" /></div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20"><p className="text-sm text-indigo-100">Giá trị tồn kho: {formatCurrency(inventoryStats?.currentInventoryValue || 0)}</p></div>
                        </div>
                    </Col>
                </Row>

                {/* 3. BIỂU ĐỒ CHÍNH */}
                <Row gutter={[24, 24]} className="mb-8">
                    <Col xs={24} lg={16}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-700">Tình hình Tài chính (Năm {selectedYear})</h3>
                                <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 100 }}>
                                    {[CURRENT_YEAR, CURRENT_YEAR - 1].map(y => <Option key={y} value={y}>{y}</Option>)}
                                </Select>
                            </div>
                            {errorFinancials ? <Alert message="Lỗi tải dữ liệu" type="error" /> : <ReactEcharts option={financialChartOption} style={{ height: '350px' }} />}
                        </div>
                    </Col>

                    <Col xs={24} lg={8}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-700">Trạng thái Đơn hàng</h3>
                                <Select value={selectedMonth} onChange={setSelectedMonth} style={{ width: 120 }} placeholder="Cả năm" allowClear>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <Option key={m} value={m}>Tháng {m}</Option>)}
                                </Select>
                            </div>
                            {errorStatus ? <Alert message="Lỗi tải dữ liệu" type="error" /> : <ReactEcharts option={statusChartOption} style={{ height: '350px' }} />}
                        </div>
                    </Col>
                </Row>

                {/* 4. TOP SẢN PHẨM & CẢNH BÁO KHO */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                            <div className="flex items-center gap-2 mb-6">
                                <FireOutlined className="text-orange-500 text-xl" />
                                <h3 className="text-lg font-bold text-gray-700 m-0">Top 5 Món Bán Chạy Nhất</h3>
                            </div>
                            <ReactEcharts option={topProductOption} style={{ height: '300px' }} />
                        </div>
                    </Col>

                    <Col xs={24} lg={12}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <WarningOutlined className="text-red-500 text-xl" />
                                <h3 className="text-lg font-bold text-gray-700 m-0">Cảnh báo Nguyên liệu Sắp hết</h3>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <Table
                                    dataSource={lowStockItems || []}
                                    columns={lowStockColumns}
                                    pagination={false}
                                    size="small"
                                    rowKey="id"
                                    locale={{ emptyText: 'Kho hàng ổn định' }}
                                />
                            </div>
                            {lowStockItems && lowStockItems.length > 0 && (
                                <Button type="primary" danger block className="mt-4" href="/inventory/materials">Nhập kho ngay</Button>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* 5. BỘ LỌC CHI TIẾT */}
                <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Bộ lọc doanh thu chi tiết</h3>
                    <Row gutter={16} align="middle">
                        <Col flex="auto"><RangePicker size="large" style={{ width: '100%' }} value={dateRange} onChange={setDateRange as any} /></Col>
                        <Col><Button type="primary" size="large" onClick={handleFetchRangeRevenue} icon={<CalendarOutlined />}>Xem kết quả</Button></Col>
                    </Row>
                    {!errorRange && (
                        <Row gutter={[16, 16]} className="mt-6">
                            <Col xs={24} md={12}>
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 text-sm">Tổng Doanh thu (Range)</p>
                                        <h4 className="text-2xl font-bold text-blue-700 m-0">{formatCurrency(rangeRevenue?.totalRevenue || 0)}</h4>
                                    </div>
                                    <div className="bg-blue-200 p-2 rounded-lg text-blue-600"><WalletOutlined /></div>
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 text-sm">Số lượng Đơn hàng</p>
                                        <h4 className="text-2xl font-bold text-green-700 m-0">{rangeRevenue?.orderCount || 0}</h4>
                                    </div>
                                    <div className="bg-green-200 p-2 rounded-lg text-green-600"><ShopOutlined /></div>
                                </div>
                            </Col>
                        </Row>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.6s ease-out; }
            `}</style>
        </Spin>
    );
};

export default Dashboard;