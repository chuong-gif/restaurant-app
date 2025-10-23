import { useEffect, useState } from "react";
import { Table, Button, Card } from "antd";
import { getAllProducts } from "@/api/productsApi";
import { PlusOutlined } from "@ant-design/icons";

// 🟢 thêm: import ProductForm
import ProductForm from "@/components/product/ProductForm";

interface DanhMuc {
    id: number;
    ten_danh_muc: string;
    // Thêm các thuộc tính khác nếu có
}
// Định nghĩa kiểu cho Product
interface Product {
    id: number;
    ten_san_pham: string;
    gia_ban: number;
    danh_muc_san_pham: DanhMuc; // Dùng lại interface DanhMuc ở đây
    // Thêm các thuộc tính khác của sản phẩm...
}

const Products = () => {

    const [products, setProducts] = useState<Product[]>([]);
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
            dataIndex: "ten_san_pham", // Sửa từ "name"
            key: "ten_san_pham",
        },
        {
            title: "Danh mục",
            dataIndex: "danh_muc_san_pham",
            key: "danh_muc_san_pham",
            // 👇 BƯỚC 2: THÊM KIỂU DỮ LIỆU CHO THAM SỐ `danh_muc`
            render: (danh_muc: DanhMuc) => danh_muc?.ten_danh_muc || 'Chưa phân loại',
        },
        {
            title: "Giá (₫)",
            dataIndex: "gia_ban", // Sửa từ "price"
            key: "gia_ban",
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
