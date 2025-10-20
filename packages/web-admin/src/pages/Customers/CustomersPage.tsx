import React, { useEffect } from "react";
import { Table, Button, Space, Typography, Popconfirm, message } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCustomers, deleteCustomer } from "@/store/slices/customerSlice";
import type { Customer } from "@/types/customer";
import type { RootState } from "@/store";

const { Title } = Typography;


const CustomersPage: React.FC = () => {
    const dispatch = useAppDispatch();
    // CustomersPage.tsx
    const { allCustomers: customers, loading } = useAppSelector(
        (state: RootState) => state.customers
    );



    useEffect(() => {
        // gọi với {} nếu thunk yêu cầu param, hoặc fetchCustomers() nếu cho phép undefined
        dispatch(fetchCustomers({}));
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteCustomer(id)).unwrap();
            message.success("Xóa khách hàng thành công");
        } catch {
            message.error("Xóa thất bại");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", width: 80 },
        { title: "Họ tên", dataIndex: "fullname", key: "fullname" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "SĐT", dataIndex: "phone", key: "phone" },
        { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", render: (d: string) => new Date(d).toLocaleDateString() },
        {
            title: "Thao tác",
            key: "action",
            render: (_: any, record: Customer) => (
                <Space>
                    <Button type="link">Sửa</Button>
                    <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                        <Button danger type="link">Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <Title level={4}>Danh sách khách hàng</Title>
                <Button type="primary">+ Thêm</Button>
            </div>
            <Table rowKey="id" columns={columns} dataSource={customers || []} loading={loading} pagination={{ pageSize: 10 }} />
        </div>
    );
};

export default CustomersPage;
