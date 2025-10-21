import { useEffect, useState } from "react";
import { Table, Button, Card } from "antd";
import { getAllProducts } from "@/api/productsApi";
import { PlusOutlined } from "@ant-design/icons";

// 🟢 thêm: import ProductForm
import ProductForm from "@/components/product/ProductForm";

const Products = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // 🟢 thêm: state điều khiển mở/đóng form
    const [isFormOpen, setIsFormOpen] = useState(false);
    // 🟢 Sửa sản phẩm
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    const handleEdit = (record: any) => {
        setEditingProduct(record);
        setIsFormOpen(true);
    };


    const fetchProducts = async () => {
        console.log("🔁 fetchProducts called");
        setLoading(true);
        try {
            const response = await getAllProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const columns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Danh mục",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Giá (₫)",
            dataIndex: "price",
            key: "price",
            render: (value: number) => value.toLocaleString("vi-VN"),
        },

        {
            title: "Thao tác",
            key: "action",
            render: (_: any, record: any) => (
                <Button type="link" onClick={() => handleEdit(record)}>
                    Sửa
                </Button>
            ),
        },

    ];

    // // 🟢 Hàm xử lý xóa sản phẩm
    // const handleDelete = async (id: number) => {
    // Modal.confirm({
    // title: "Bạn có chắc muốn xóa sản phẩm này?",
    // okText: "Xóa",
    // okType: "danger",
    // cancelText: "Hủy",
    // onOk: async () => {
    //   try {
    //     await deleteProduct(id); // nếu bạn có API backend
    //     message.success("Đã xóa sản phẩm thành công!");
    //     fetchProducts(); // gọi lại để refresh bảng
    //         } catch (err) {
    //     console.error(err);
    //     message.error("Xóa sản phẩm thất bại!");
    //          }
    //         },
    //      });
    // };


    return (
        <Card
            title="Danh sách sản phẩm"
            extra={
                // 🟢 thêm: mở form khi nhấn nút
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsFormOpen(true)}
                >
                    + Thêm sản phẩm
                </Button>
            }
        >
            <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            {/* 🟢 thêm: hiển thị form thêm sản phẩm */}
            <ProductForm
                open={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingProduct(null);
                }}
                onAdded={fetchProducts}
                product={editingProduct} // 🟢 thêm dòng này
            />


        </Card>
    );
};

export default Products;
