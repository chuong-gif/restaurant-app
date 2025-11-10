// ReservationTrashPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Table, Button, Input, Select, Tag, Space, Row, Col, App, Tooltip } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, WarningOutlined, PhoneOutlined, UserOutlined, NumberOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';

import { useGetAdminReservationsQuery, usePermanentlyDeleteReservationMutation } from '../../features/reservations/reservationApi';
import { setReservationFilters, setReservationPage } from '../../features/reservations/reservationSlice';
import { RootState } from '../../app/store';
import { Reservation } from '../../types/reservation';
import { statusMap } from '../../components/reservations/ChangeStatusSelect';
import { formatDateTime } from '../../utils/FormatDateTime';
import { formatCurrency } from '../../utils/FormatCurrency';

const { Option } = Select;

const ReservationTrashPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message, modal } = App.useApp();

    const filters = useSelector((state: RootState) => state.reservationFilters);

    // States cho input tìm kiếm
    const [nameSearch, setNameSearch] = useState(filters.searchName);
    const [phoneSearch, setPhoneSearch] = useState(filters.searchPhone);
    const [codeSearch, setCodeSearch] = useState(filters.reservation_code);

    const [debouncedName] = useDebounce(nameSearch, 500);
    const [debouncedPhone] = useDebounce(phoneSearch, 500);
    const [debouncedCode] = useDebounce(codeSearch, 500);

    // --- RTK Query ---
    const { data: reservationsData, isLoading, isFetching } = useGetAdminReservationsQuery({
        ...filters,
        limit: filters.limit || 10,
        searchName: debouncedName,
        searchPhone: debouncedPhone,
        reservation_code: debouncedCode,
        status: '0',
    });

    const [permanentlyDeleteReservation, { isLoading: isHardDeleting }] = usePermanentlyDeleteReservationMutation();

    // --- Handlers ---
    const handleFilterChange = useCallback((changedFilters: Partial<typeof filters>) => {
        dispatch(setReservationFilters({ ...changedFilters, page: 1 }));
    }, [dispatch]);

    const handlePageChange = useCallback((page: number) => {
        dispatch(setReservationPage(page));
    }, [dispatch]);

    const handlePermanentDelete = useCallback((id: number) => {
        modal.confirm({
            title: 'XÁC NHẬN XÓA VĨNH VIỄN',
            icon: <WarningOutlined style={{ color: 'red' }} />,
            content: 'Hành động này không thể hoàn tác! Bạn có chắc muốn XÓA VĨNH VIỄN đơn đặt bàn này?',
            okText: 'Xóa vĩnh viễn',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await permanentlyDeleteReservation(id).unwrap();
                    message.success('Xóa vĩnh viễn đặt bàn thành công.');
                } catch (error: any) {
                    message.error(error.data?.message || 'Xóa vĩnh viễn thất bại.');
                }
            },
        });
    }, [permanentlyDeleteReservation, message, modal]);

    // --- Table columns ---
    const columns = useMemo(() => [
        {
            title: 'Mã ĐB',
            dataIndex: 'ma_dat_ban',
            key: 'code',
            width: 120,
            render: (text: string) => (
                <span className="text-blue-600 font-semibold">{text}</span>
            )
        },
        {
            title: 'Tên KH',
            dataIndex: 'ho_ten_khach',
            key: 'name',
            width: 180,
            render: (text: string) => (
                <span className="text-gray-700">{text}</span>
            )
        },
        {
            title: 'Điện thoại',
            dataIndex: 'dien_thoai',
            key: 'phone',
            width: 120,
            render: (text: string) => (
                <span className="text-gray-600">{text}</span>
            )
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'ngay_dat_ban',
            key: 'date',
            width: 160,
            render: (date: string) => (
                <span className="text-gray-600 text-sm">{formatDateTime(date)}</span>
            ),
            sorter: (a: Reservation, b: Reservation) => new Date(a.ngay_dat_ban).getTime() - new Date(b.ngay_dat_ban).getTime(),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'status',
            width: 120,
            render: (status: number) => {
                const statusInfo = statusMap[status] || { text: 'Không xác định', color: 'default' };
                return (
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color === 'red' ? 'bg-red-100 text-red-800 border border-red-200' :
                            'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                        {statusInfo.text}
                    </div>
                );
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
            fixed: 'right' as const,
            width: 150,
            render: (_: any, record: Reservation) => (
                <Space size="small">
                    <Tooltip title="Xóa vĩnh viễn">
                        <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => handlePermanentDelete(record.id)}
                            className="shadow-md hover:shadow-lg transition-all"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ], [handlePermanentDelete]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transition-all duration-300 animate-fade-in">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/reservations')}
                    className="mb-6 rounded-xl border-white/30 bg-white/20 hover:bg-white/30 transition-all"
                >
                    Quay lại danh sách
                </Button>

                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Đặt bàn đã hủy (Thùng rác)
                </h2>

                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12} lg={8}>
                        <Input
                            prefix={<NumberOutlined />}
                            placeholder="Tìm theo mã ĐB..."
                            value={codeSearch}
                            onChange={e => setCodeSearch(e.target.value)}
                            allowClear
                            className="rounded-xl border-white/30 bg-white/50"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Tìm theo tên KH..."
                            value={nameSearch}
                            onChange={e => setNameSearch(e.target.value)}
                            allowClear
                            className="rounded-xl border-white/30 bg-white/50"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Tìm theo SĐT..."
                            value={phoneSearch}
                            onChange={e => setPhoneSearch(e.target.value)}
                            allowClear
                            className="rounded-xl border-white/30 bg-white/50"
                        />
                    </Col>
                </Row>

                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={reservationsData?.data || []}
                        rowKey="id"
                        loading={isLoading || isFetching || isHardDeleting}
                        pagination={{
                            current: reservationsData?.currentPage || 1,
                            pageSize: filters.limit || 10,
                            total: reservationsData?.total || 0,
                            onChange: handlePageChange,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đặt bàn đã hủy`,
                            className: 'px-4 py-2'
                        }}
                        scroll={{ x: 1000 }}
                        className="custom-table"
                    />
                </div>
            </div>

            <style>{`
                .custom-table .ant-table-thead > tr > th {
                    background: rgba(255, 255, 255, 0.3) !important;
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                    color: #4B5563;
                    font-weight: 600;
                }
                .custom-table .ant-table-tbody > tr > td {
                    background: rgba(255, 255, 255, 0.2) !important;
                    backdrop-filter: blur(5px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                }
                .custom-table .ant-table-tbody > tr:hover > td {
                    background: rgba(255, 255, 255, 0.3) !important;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out; }
            `}</style>
        </div>
    );
};

export default ReservationTrashPage;