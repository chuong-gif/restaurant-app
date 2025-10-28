// packages/admin/src/pages/reservations/ReservationListPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Table, Button, Input, Select, Tag, Space, Row, Col, App, Tooltip } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined, PhoneOutlined, UserOutlined, NumberOutlined, RestOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';

import { useGetAdminReservationsQuery, useSoftDeleteReservationMutation } from '../../features/reservations/reservationApi';
import { setReservationFilters, setReservationPage } from '../../features/reservations/reservationSlice';
import { RootState } from '../../app/store';
import { Reservation } from '../../types/reservation';
import ChangeStatusSelect, { statusMap } from '../../components/reservations/ChangeStatusSelect'; // Import component
import { formatDateTime } from '../../utils/FormatDateTime'; // Giả sử có hàm này
import { formatCurrency } from '../../utils/FormatCurrency'; // Giả sử có hàm này

import { Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ReservationAddForm from '../../components/reservations/ReservationAddForm';


const { Search } = Input;
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
    const [isCreating, setIsCreating] = useState(false); // để loading nút tạo


    // --- RTK Query ---
    const { data: reservationsData, isLoading, isFetching } = useGetAdminReservationsQuery({
        ...filters,
        limit: filters.limit || 10, // Đảm bảo limit có giá trị
        searchName: debouncedName,
        searchPhone: debouncedPhone,
        reservation_code: debouncedCode,
        status: filters.status, // Giữ nguyên string hoặc undefined
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
        { title: 'Mã ĐB', dataIndex: 'ma_dat_ban', key: 'code', width: 120 },
        { title: 'Tên KH', dataIndex: 'ho_ten_khach', key: 'name', width: 180 },
        { title: 'Điện thoại', dataIndex: 'dien_thoai', key: 'phone', width: 120 },
        {
            title: 'Ngày đặt', dataIndex: 'ngay_dat_ban', key: 'date', width: 160,
            render: (date: string) => formatDateTime(date), // Format lại ngày giờ
            sorter: (a: Reservation, b: Reservation) => new Date(a.ngay_dat_ban).getTime() - new Date(b.ngay_dat_ban).getTime(),
            defaultSortOrder: 'descend' as const,
        },
        { title: 'Số khách', dataIndex: 'so_luong_khach', key: 'guests', align: 'center' as const, width: 80 },
        { title: 'Số bàn', dataIndex: ['ban_an', 'so_ban'], key: 'table', align: 'center' as const, width: 80, render: (so_ban: number) => so_ban || '-' },
        {
            title: 'Tổng tiền', dataIndex: 'tong_tien', key: 'total', align: 'right' as const, width: 130,
            render: (total?: number) => formatCurrency(total || 0), // Format tiền tệ
        },
        {
            title: 'Trạng thái', dataIndex: 'trang_thai', key: 'status', width: 170,
            render: (status: number, record: Reservation) => (
                <ChangeStatusSelect reservationId={record.id} currentStatus={status} />
            ),
        },
        {
            title: 'Thao tác', key: 'action', align: 'center' as const, fixed: 'right' as const, width: 150,
            render: (_: any, record: Reservation) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button type="primary" shape="circle" icon={<EyeOutlined />} onClick={() => handleViewDetail(record.id)} />
                    </Tooltip>
                    {/* Chỉ cho hủy đơn chưa hoàn thành */}
                    {record.trang_thai !== 5 && record.trang_thai !== 0 && (
                        <Tooltip title="Hủy đơn">
                            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ], [handleViewDetail, handleDelete]);


    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý Đặt bàn</h2>

            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} lg={6}>
                    <Input prefix={<NumberOutlined />} placeholder="Tìm theo mã ĐB..."
                        value={codeSearch} onChange={e => setCodeSearch(e.target.value)} allowClear />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Input prefix={<UserOutlined />} placeholder="Tìm theo tên KH..."
                        value={nameSearch} onChange={e => setNameSearch(e.target.value)} allowClear />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Input prefix={<PhoneOutlined />} placeholder="Tìm theo SĐT..."
                        value={phoneSearch} onChange={e => setPhoneSearch(e.target.value)} allowClear />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Select placeholder="Lọc theo trạng thái" style={{ width: '100%' }}
                        value={filters.status || ''} // Dùng '' cho "Tất cả"
                        onChange={value => handleFilterChange({ status: value })} allowClear>
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
                    >
                        Thêm Đặt Bàn
                    </Button>

                    <Button
                        type="default"
                        icon={<RestOutlined />}
                        onClick={() => navigate('/reservations/trash')}
                    >
                        Đơn đã hủy
                    </Button>
                </Col>

            </Row>

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
                }}
                scroll={{ x: 1300 }} // Đảm bảo cuộn ngang nếu cần
            />

            {/* === MODAL TẠO ĐẶT BÀN MỚI === */}
            <Modal
                title="Tạo Đặt Bàn Mới (Admin/NV)"
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                footer={null} // Footer do form xử lý
                width={1000}
                destroyOnClose
            >
                <ReservationAddForm
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        // Tự động refresh danh sách nếu cần
                    }}
                    onCancel={() => setIsAddModalOpen(false)}
                />


                <div className="flex justify-end mt-4">
                    <Button onClick={() => setIsAddModalOpen(false)} style={{ marginRight: 8 }}>
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        form="reservation-add-form" // ✅ ID form bên trong
                        loading={isCreating}
                    >
                        Tạo Đặt Bàn
                    </Button>
                </div>
            </Modal>
            {/* =========================== */}

        </div>
    );
};

export default ReservationListPage;