import { useState, useEffect } from "react";
import type { ColumnsType } from "antd/es/table";
import { Table, Card, Typography, Button, Modal, Space } from "antd";
const { Title } = Typography;

// Định nghĩa "khuôn mẫu" cho một sản phẩm
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ SỬ DỤNG STATE: State để theo dõi sản phẩm nào đang được chọn để sửa/xóa
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Giả lập việc lấy dữ liệu từ API
    useEffect(() => {
        setTimeout(() => {
            setProducts([
                { id: 1, name: "Cà phê sữa đá", category: "Đồ uống", price: 25000 },
                { id: 2, name: "Trà đào cam sả", category: "Đồ uống", price: 30000 },
                { id: 3, name: "Mì Ý bò bằm", category: "Món chính", price: 75000 },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Hàm xử lý khi nhấn nút "Sửa"
    const handleEdit = (id: number) => {
        setEditingId(id);
        // Trong thực tế, bạn sẽ mở một form để sửa thông tin sản phẩm có id này
        console.log("Mở form sửa cho sản phẩm có ID =", id);
    };

    // Hàm xử lý khi nhấn nút "Xóa"
    const handleDelete = (id: number) => {
        // ✅ SỬ DỤNG STATE: Khi nhấn xóa, chúng ta lưu id vào state để mở Modal xác nhận
        setDeletingId(id);
    };

    // Hàm thực hiện xóa sau khi người dùng xác nhận trong Modal
    const handleConfirmDelete = () => {
        if (deletingId !== null) {
            setProducts((prev) => prev.filter((p) => p.id !== deletingId));
            console.log("Đã xóa sản phẩm có ID =", deletingId);
            setDeletingId(null); // Đóng Modal sau khi xóa
        }
    };

    // Định nghĩa các cột cho bảng Ant Design
    const columns: ColumnsType<Product> = [
        { title: "#", dataIndex: "id", key: "id", width: 70 },
        { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
        { title: "Danh mục", dataIndex: "category", key: "category" },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `${price.toLocaleString()}₫`,
            align: "right",
        },
        {
            title: "Thao tác",
            key: "actions",
            align: "center",
            render: (_: any, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record.id)}>
                        Sửa
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card className="shadow-md" bodyStyle={{ padding: "20px 24px" }}>
                <div className="flex justify-between items-center mb-4">
                    <Title level={3} className="!mb-0">
                        Danh sách sản phẩm
                    </Title>
                    <Button type="primary">+ Thêm sản phẩm</Button>
                </div>
                <Table
                    dataSource={products}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            {/* ✅ SỬ DỤNG STATE: Modal xác nhận xóa */}
            {/* Modal này chỉ hiển thị khi `deletingId` có giá trị (khác null) */}
            <Modal
                title="Xác nhận xóa"
                open={deletingId !== null}
                onOk={handleConfirmDelete}
                onCancel={() => setDeletingId(null)}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            </Modal>

            {/* (Tùy chọn) Modal để sửa sản phẩm */}
            <Modal
                title="Sửa sản phẩm"
                open={editingId !== null}
                onCancel={() => setEditingId(null)}
                footer={null} // Ẩn nút OK/Cancel mặc định
            >
                <p>Đây là nơi form sửa sản phẩm có ID: {editingId} sẽ xuất hiện.</p>
            </Modal>
        </div>
    );
}