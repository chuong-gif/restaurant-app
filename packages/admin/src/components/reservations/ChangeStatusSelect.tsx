// packages/admin/src/components/reservations/ChangeStatusSelect.tsx
import React from 'react';
import { Select, App } from 'antd';
import { useUpdateReservationStatusMutation } from '../../features/reservations/reservationApi';
import { ReservationStatus } from '../../types/reservation';

const { Option } = Select;

// Ánh xạ mã trạng thái sang text và màu (dựa trên đề xuất)
export const statusMap: { [key: number]: { text: string; color: string } } = {
    [ReservationStatus.CANCELLED]: { text: 'Đã hủy', color: 'red' },
    [ReservationStatus.PENDING_CONFIRMATION]: { text: 'Chờ xác nhận', color: 'orange' },
    [ReservationStatus.CONFIRMED_DEPOSIT_PAID]: { text: 'Đã cọc', color: 'blue' },
    [ReservationStatus.CHECKED_IN]: { text: 'Đang ăn', color: 'purple' },
    [ReservationStatus.PENDING_PAYMENT]: { text: 'Chờ thanh toán', color: 'cyan' },
    [ReservationStatus.COMPLETED]: { text: 'Hoàn thành', color: 'green' },
    [ReservationStatus.NO_SHOW]: { text: 'Không đến', color: 'grey' },
};

interface ChangeStatusSelectProps {
    reservationId: number;
    currentStatus: number;
}

const ChangeStatusSelect: React.FC<ChangeStatusSelectProps> = ({ reservationId, currentStatus }) => {
    const { message } = App.useApp();
    const [updateStatus, { isLoading }] = useUpdateReservationStatusMutation();

    const handleChange = async (newStatus: number) => {
        try {
            await updateStatus({ id: reservationId, status: newStatus }).unwrap();
            message.success('Cập nhật trạng thái thành công!');
        } catch (error: any) {
            message.error(error.data?.message || 'Cập nhật trạng thái thất bại.');
        }
    };

    // Chỉ hiển thị các lựa chọn hợp lệ (ví dụ không thể chuyển từ Hoàn thành về Chờ xác nhận)
    // Logic này có thể phức tạp hơn tùy quy trình nghiệp vụ
    const availableOptions = Object.entries(statusMap)
        .map(([value, { text }]) => ({ value: parseInt(value), text }))
        // .filter(option => /* logic lọc nếu cần */)
        ;


    return (
        <Select
            value={currentStatus}
            onChange={handleChange}
            loading={isLoading}
            style={{ minWidth: 150 }}
            disabled={currentStatus === ReservationStatus.COMPLETED || currentStatus === ReservationStatus.CANCELLED} // Không cho đổi nếu đã Hoàn thành/Hủy
        >
            {availableOptions.map(option => (
                <Option key={option.value} value={option.value}>
                    {option.text}
                </Option>
            ))}
        </Select>
    );
};

export default ChangeStatusSelect;