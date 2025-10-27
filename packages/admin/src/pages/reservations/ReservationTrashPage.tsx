// packages/admin/src/pages/reservations/ReservationTrashPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Table, Button, Input, Select, Tag, Space, Row, Col, App, Tooltip } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, WarningOutlined, PhoneOutlined, UserOutlined, NumberOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';

import { useGetAdminReservationsQuery, usePermanentlyDeleteReservationMutation } from '../../features/reservations/reservationApi'; // Import hook xóa vĩnh viễn
import { setReservationFilters, setReservationPage } from '../../features/reservations/reservationSlice';
import { RootState } from '../../app/store';
import { Reservation } from '../../types/reservation';
import { statusMap } from '../../components/reservations/ChangeStatusSelect';
import { formatDateTime } from '../../utils/FormatDateTime';
import { formatCurrency } from '../../utils/FormatCurrency';

const { Search } = Input;
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
        status: '0', // <-- Chỉ lấy đơn đã hủy (trang_thai = 0)
    });

    const [permanentlyDeleteReservation, { isLoading: isHardDeleting }] = usePermanentlyDeleteReservationMutation();
    // Không cần restore mutation vì không khôi phục đơn đã hủy theo logic hiện tại

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
        { title: 'Mã ĐB', dataIndex: 'ma_dat_ban', key: 'code', width: 120 },
        { title: 'Tên KH', dataIndex: 'ho_ten_khach', key: 'name', width: 180 },
        { title: 'Điện thoại', dataIndex: 'dien_thoai', key: 'phone', width: 120 },
        {
            title: 'Ngày đặt', dataIndex: 'ngay_dat_ban', key: 'date', width: 160,
            render: (date: string) => formatDateTime(date),
            sorter: (a: Reservation, b: Reservation) => new Date(a.ngay_dat_ban).getTime() - new Date(b.ngay_dat_ban).getTime(),
        },
        {
            title: 'Trạng thái', dataIndex: 'trang_thai', key: 'status', width: 120,
            render: (status: number) => {
                const statusInfo = statusMap[status] || { text: 'Không xác định', color: 'default' };
                return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            }
        },
        {
            title: 'Thao tác', key: 'action', align: 'center' as const, fixed: 'right' as const, width: 150,
            render: (_: any, record: Reservation) => (
                <Space size="small">
                    {/* Có thể thêm nút xem chi tiết nếu muốn */}
                    {/* <Tooltip title="Xem chi tiết">
                         <Button type="default" shape="circle" icon={<EyeOutlined />} onClick={() => navigate(`/reservations/${record.id}`)} />
                    </Tooltip> */}
                    <Tooltip title="Xóa vĩnh viễn">
                        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => handlePermanentDelete(record.id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ], [handlePermanentDelete, navigate]);


    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/reservations')} className="mb-4">
                Quay lại danh sách
            </Button>
            <h2 className="text-2xl font-bold mb-4">Đặt bàn đã hủy (Thùng rác)</h2>

            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} lg={8}>
                    <Input prefix={<NumberOutlined />} placeholder="Tìm theo mã ĐB..."
                        value={codeSearch} onChange={e => setCodeSearch(e.target.value)} allowClear />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Input prefix={<UserOutlined />} placeholder="Tìm theo tên KH..."
                        value={nameSearch} onChange={e => setNameSearch(e.target.value)} allowClear />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Input prefix={<PhoneOutlined />} placeholder="Tìm theo SĐT..."
                        value={phoneSearch} onChange={e => setPhoneSearch(e.target.value)} allowClear />
                </Col>
                {/* Không cần lọc trạng thái ở thùng rác */}
            </Row>

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
                }}
                scroll={{ x: 1000 }}
            />
        </div>
    );
};

export default ReservationTrashPage;