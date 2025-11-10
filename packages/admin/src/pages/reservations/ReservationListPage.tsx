// ReservationListPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Table, Button, Input, Select, Space, Row, Col, App, Tooltip, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, PhoneOutlined, UserOutlined, NumberOutlined, RestOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';

import { useGetAdminReservationsQuery, useSoftDeleteReservationMutation } from '../../features/reservations/reservationApi';
import { setReservationFilters, setReservationPage } from '../../features/reservations/reservationSlice';
import { RootState } from '../../app/store';
import { Reservation } from '../../types/reservation';
import { Table as RestaurantTable } from '../../types/product';
import ChangeStatusSelect, { statusMap } from '../../components/reservations/ChangeStatusSelect';
import { formatDateTime } from '../../utils/FormatDateTime';
import { formatCurrency } from '../../utils/FormatCurrency';
import ReservationAddForm from '../../components/reservations/ReservationAddForm';

const { Option } = Select;

const ReservationListPage: React.FC = () => {
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

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCreating] = useState(false);

    // --- RTK Query ---
    const { data: reservationsData, isLoading, isFetching } = useGetAdminReservationsQuery({
        ...filters,
        limit: filters.limit || 10,
        searchName: debouncedName,
        searchPhone: debouncedPhone,
        reservation_code: debouncedCode,
        status: filters.status,
    });

    const [softDeleteReservation, { isLoading: isDeleting }] = useSoftDeleteReservationMutation();

    // --- Handlers ---
    const handleFilterChange = useCallback((changedFilters: Partial<typeof filters>) => {
        dispatch(setReservationFilters({ ...changedFilters, page: 1 }));
    }, [dispatch]);

    const handlePageChange = useCallback((page: number) => {
        dispatch(setReservationPage(page));
    }, [dispatch]);

    const handleViewDetail = useCallback((id: number) => {
        navigate(`/reservations/${id}`);
    }, [navigate]);

    const handleDelete = useCallback((id: number) => {
        modal.confirm({
            title: 'Xác nhận hủy đơn',
            content: 'Bạn có chắc muốn hủy đơn đặt bàn này?',
            okText: 'Xác nhận hủy',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await softDeleteReservation(id).unwrap();
                    message.success('Hủy đơn đặt bàn thành công.');
                } catch (error: any) {
                    message.error(error.data?.message || 'Hủy đơn đặt bàn thất bại.');
                }
            },
        });
    }, [softDeleteReservation, message, modal]);

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
            defaultSortOrder: 'descend' as const,
        },
        {
            title: 'Số khách',
            dataIndex: 'so_luong_khach',
            key: 'guests',
            align: 'center' as const,
            width: 80,
            render: (text: number) => (
                <span className="text-gray-700">{text}</span>
            )
        },
        {
            title: 'Số bàn',
            dataIndex: 'ban_an',
            key: 'table',
            align: 'center' as const,
            width: 100,
            render: (ban_an_list: RestaurantTable[]) => (
                <span className="text-gray-600">
                    {(ban_an_list && ban_an_list.length > 0)
                        ? ban_an_list.map(table => table.so_ban).join(', ')
                        : '-'}
                </span>
            )
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'tong_tien',
            key: 'total',
            align: 'right' as const,
            width: 130,
            render: (total?: number) => (
                <span className="text-green-600 font-semibold">{formatCurrency(total || 0)}</span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'status',
            width: 170,
            render: (status: number, record: Reservation) => (
                <ChangeStatusSelect reservationId={record.id} currentStatus={status} />
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
            fixed: 'right' as const,
            width: 150,
            render: (_: any, record: Reservation) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record.id)}
                            className="bg-blue-500 hover:bg-blue-600 border-0 shadow-md hover:shadow-lg transition-all"
                        />
                    </Tooltip>
                    {record.trang_thai !== 5 && record.trang_thai !== 0 && (
                        <Tooltip title="Hủy đơn">
                            <Button
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record.id)}
                                className="shadow-md hover:shadow-lg transition-all"
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ], [handleViewDetail, handleDelete]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 transition-all duration-300 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Quản lý Đặt bàn
                </h2>

                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12} lg={6}>
                        <Input
                            prefix={<NumberOutlined />}
                            placeholder="Tìm theo mã ĐB..."
                            value={codeSearch}
                            onChange={e => setCodeSearch(e.target.value)}
                            allowClear
                            className="rounded-xl border-white/30 bg-white/50"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Tìm theo tên KH..."
                            value={nameSearch}
                            onChange={e => setNameSearch(e.target.value)}
                            allowClear
                            className="rounded-xl border-white/30 bg-white/50"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Tìm theo SĐT..."
                            value={phoneSearch}
                            onChange={e => setPhoneSearch(e.target.value)}
                            allowClear
                            className="rounded-xl border-white/30 bg-white/50"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            className="w-full rounded-xl border-white/30"
                            value={filters.status || ''}
                            onChange={value => handleFilterChange({ status: value })}
                            allowClear
                        >
                            <Option value="">Tất cả trạng thái</Option>
                            {Object.entries(statusMap).map(([value, { text }]) => (
                                <Option key={value} value={value}>{text}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} className="flex justify-end mt-2 gap-2">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsAddModalOpen(true)}
                            className="h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-lg hover:shadow-xl transition-all"
                        >
                            Thêm Đặt Bàn
                        </Button>

                        <Button
                            type="default"
                            icon={<RestOutlined />}
                            onClick={() => navigate('/reservations/trash')}
                            className="rounded-xl border-white/30 bg-white/20 hover:bg-white/30 transition-all"
                        >
                            Đơn đã hủy
                        </Button>
                    </Col>
                </Row>

                <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={reservationsData?.data || []}
                        rowKey="id"
                        loading={isLoading || isFetching || isDeleting}
                        pagination={{
                            current: reservationsData?.currentPage || 1,
                            pageSize: filters.limit || 10,
                            total: reservationsData?.total || 0,
                            onChange: handlePageChange,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đặt bàn`,
                            className: 'px-4 py-2'
                        }}
                        scroll={{ x: 1300 }}
                        className="custom-table"
                    />
                </div>

                {/* Modal Thêm Đặt Bàn */}
                <Modal
                    title="Tạo Đặt Bàn Mới (Admin/NV)"
                    open={isAddModalOpen}
                    onCancel={() => setIsAddModalOpen(false)}
                    footer={null}
                    width={1000}
                    destroyOnClose
                    className="rounded-2xl"
                    styles={{
                        body: {
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }
                    }}
                >
                    <ReservationAddForm
                        onSuccess={() => {
                            setIsAddModalOpen(false);
                        }}
                        onCancel={() => setIsAddModalOpen(false)}
                    />

                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={() => setIsAddModalOpen(false)}
                            style={{ marginRight: 8 }}
                            className="rounded-xl"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            form="reservation-add-form"
                            loading={isCreating}
                            className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 border-0"
                        >
                            Tạo Đặt Bàn
                        </Button>
                    </div>
                </Modal>
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

export default ReservationListPage;