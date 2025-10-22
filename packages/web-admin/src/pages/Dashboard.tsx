import { Card, Row, Col, Statistic } from "antd";
import {
    UserOutlined,
    ShoppingOutlined,
    TableOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    const stats = [
        {
            title: "Khách hàng",
            value: 124,
            icon: <UserOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
            color: "#e6f7ff",
            link: "/admin/customers",
        },
        {
            title: "Sản phẩm",
            value: 58,
            icon: <ShoppingOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
            color: "#f6ffed",
            link: "/admin/products",
        },
        {
            title: "Đặt bàn",
            value: 32,
            icon: <TableOutlined style={{ fontSize: 32, color: "#faad14" }} />,
            color: "#fffbe6",
            link: "/admin/tables",
        },
        {
            title: "Doanh thu (tháng)",
            value: "45,200,000₫",
            icon: <DollarOutlined style={{ fontSize: 32, color: "#eb2f96" }} />,
            color: "#fff0f6",
            link: "/admin/reports",
        },
    ];

    return (
        <div
            style={{
                padding: "40px 20px",
                background: "#f0f2f5",
                minHeight: "100vh",
            }}
        >
            <h1
                style={{
                    color: "#001529",
                    fontWeight: 700,
                    marginBottom: 30,
                    textAlign: "center",
                }}
            >
                Tổng quan hệ thống
            </h1>

            <Row gutter={[24, 24]}>
                {stats.map((item) => (
                    <Col xs={24} sm={12} md={12} lg={6} key={item.title}>
                        <Card
                            hoverable
                            onClick={() => navigate(item.link)}
                            style={{
                                borderRadius: 16,
                                background: item.color,
                                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Statistic
                                    title={item.title}
                                    value={item.value}
                                    valueStyle={{
                                        fontSize: 22,
                                        fontWeight: "bold",
                                        color: "#333",
                                    }}
                                />
                                {item.icon}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
