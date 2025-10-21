import React, { useEffect, useState } from "react";
import { Table, Button, Card, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CustomerForm from "@/pages/Customers/CustomerForm";
import { getAllCustomers } from "@/api/customer.api";
import type { Customer } from "@/types/customer";

const { Title } = Typography;

const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    // 🟢 Lấy danh sách khách hàng
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const data = await getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khách hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // 🟢 Cột hiển thị bảng
    const columns = [
        {
            title: "Tên khách hàng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (d: string) => new Date(d).toLocaleDateString(),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_: any, record: Customer) => (
                <Space>
                    <Button
                        onClick={() => {
                            setEditingCustomer(record);
                            setIsFormOpen(true);
                        }}
                    >
                        Sửa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            {/* 🟢 Thanh tiêu đề + nút Thêm khách hàng */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <Title level={4}>Danh sách khách hàng</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingCustomer(null);
                        setIsFormOpen(true);
                    }}
                >
                    Thêm khách hàng
                </Button>
            </div>

            {/* 🟢 Bảng danh sách khách hàng */}
            <Table
                columns={columns}
                dataSource={customers}
                rowKey="_id"
                loading={loading}
            />

            {/* 🟢 Form thêm/sửa khách hàng */}
            <CustomerForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                editingCustomer={editingCustomer}
                refreshList={fetchCustomers}
            />
        </Card>
    );
};

export default CustomersPage;
