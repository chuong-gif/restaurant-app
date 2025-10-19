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




// import { Table, Button, Space } from "antd";

// interface Customer {
//     id: number;
//     name: string;
//     email: string;
//     phone: string;
// }

// export default function Customers() {
//     const data: Customer[] = [
//         { id: 1, name: "Nguyen Van A", email: "a@gmail.com", phone: "0123456789" },
//         { id: 2, name: "Tran Thi B", email: "b@gmail.com", phone: "0987654321" },
//     ];

//     const columns = [
//         { title: "ID", dataIndex: "id", key: "id" },
//         { title: "Name", dataIndex: "name", key: "name" },
//         { title: "Phone", dataIndex: "phone", key: "phone" },
//         {
//             title: "Actions",
//             key: "actions",
//             render: () => (
//                 <Space>
//                     <Button type="link">Edit</Button>
//                     <Button danger type="link">
//                         Delete
//                     </Button>
//                 </Space>
//             ),
//         },
//     ];

//     return <Table dataSource={data} columns={columns} rowKey="id" />;
// }

