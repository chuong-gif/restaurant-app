import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCustomers } from "../store/slices/customerSlice";
import { Table, Spin, Card, Typography } from "antd";

const { Title } = Typography;

// Định nghĩa các cột
const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Họ và Tên", dataIndex: "fullname", key: "fullname" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
];

export default function Customers() {
    const dispatch = useAppDispatch();
    const { allCustomers, loading } = useAppSelector((s) => s.customers);

    useEffect(() => {
        dispatch(fetchCustomers({}));
    }, [dispatch]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card
                className="shadow-md"
                bodyStyle={{ padding: "20px 24px" }}
            >
                <div className="flex justify-between items-center mb-4">
                    <Title level={3} className="!mb-0">
                        Quản lý khách hàng
                    </Title>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        + Thêm khách hàng
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        dataSource={allCustomers}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 8 }}
                    />
                )}
            </Card>
        </div>
    );
}
