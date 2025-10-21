import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Tag,
    Modal,
    Form,
    Input,
    message,
    Checkbox,
    Button,
    Select,
    Statistic,
    DatePicker,
    Descriptions,
} from "antd";
import dayjs from "dayjs";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const { Option } = Select;

interface Table {
    id: number;
    name: string;
    area: string;
    capacity: number;
    status: "available" | "booked";
    customer?: {
        name: string;
        phone: string;
        time: string;
        note?: string;
    };
}

const COLORS = ["#52c41a", "#ff4d4f"];

const TableMapPage: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedTables, setSelectedTables] = useState<number[]>([]);
    const [currentArea, setCurrentArea] = useState<string>("A");
    const [viewCustomer, setViewCustomer] = useState<Table | null>(null);

    // 🟢 Khởi tạo bàn mặc định
    const generateDefaultTables = (): Table[] => {
        const result: Table[] = [];
        let id = 1;
        const areas = ["A", "B", "C", "D"];
        const tableConfigs = [
            [2, 4, 4, 6, 6, 8],
            [2, 2, 4, 4, 6, 8],
            [4, 4, 6, 6, 8, 8],
            [2, 2, 4, 6, 6, 8],
        ];

        areas.forEach((area, index) => {
            tableConfigs[index].forEach((capacity, i) => {
                result.push({
                    id: id++,
                    name: `Bàn ${i + 1}`,
                    area,
                    capacity,
                    status: "available",
                });
            });
        });

        return result;
    };

    useEffect(() => {
        const saved = localStorage.getItem("restaurant_tables");
        if (saved) {
            setTables(JSON.parse(saved));
        } else {
            const defaults = generateDefaultTables();
            setTables(defaults);
            localStorage.setItem("restaurant_tables", JSON.stringify(defaults));
        }
    }, []);

    useEffect(() => {
        if (tables.length > 0)
            localStorage.setItem("restaurant_tables", JSON.stringify(tables));
    }, [tables]);

    const getImageForTable = (capacity: number) => {
        switch (capacity) {
            case 2:
                return "/images/table_2_people.png";
            case 4:
                return "/images/table_4_people.png";
            case 6:
                return "/images/table_6_people.png";
            case 8:
                return "/images/table_8_people.png";
            default:
                return "/images/table_2_people.png";
        }
    };

    const handleToggle = (id: number) => {
        const table = tables.find((t) => t.id === id);
        if (!table) return;

        if (table.status === "booked" && table.customer) {
            setViewCustomer(table);
            return;
        }

        if (table.status === "available") {
            setSelectedTable(table);
            setIsModalVisible(true);
        }
    };

    const handleMergeTables = () => {
        const selected = tables.filter(
            (t) => selectedTables.includes(t.id) && t.area === currentArea
        );
        if (selected.length < 2) {
            message.warning("Vui lòng chọn ít nhất 2 bàn để gộp!");
            return;
        }

        const totalSeats = selected.reduce((sum, t) => sum + t.capacity, 0);
        const bookedTable = selected.find((t) => t.status === "booked");

        const newTable: Table = {
            id: Math.max(...tables.map((t) => t.id)) + 1,
            name: `Gộp (${selected.map((t) => t.name).join(" + ")})`,
            area: currentArea,
            capacity: totalSeats,
            status: bookedTable ? "booked" : "available",
            customer: bookedTable?.customer,
        };

        setTables((prev) => [
            ...prev.filter((t) => !selectedTables.includes(t.id)),
            newTable,
        ]);
        setSelectedTables([]);
        message.success(`Đã gộp ${selected.length} bàn trong khu ${currentArea}`);
    };

    const handleSplitTable = (table: Table) => {
        if (!table.name.startsWith("Gộp (")) {
            message.info("Bàn này không phải bàn gộp!");
            return;
        }

        const match = /Gộp\s*\((.*?)\)/.exec(table.name);
        if (!match) return;

        const originalNames = match[1].split("+").map((s) => s.trim());

        const newTables = originalNames.map((name, i) => ({
            id: Math.max(...tables.map((t) => t.id)) + i + 1,
            name,
            area: table.area,
            capacity: 4,
            status: "available" as const,
        }));

        setTables((prev) => [
            ...prev.filter((t) => t.id !== table.id),
            ...newTables,
        ]);
        message.success(`Đã tách ${originalNames.length} bàn`);
    };

    const areaTables = tables.filter((t) => t.area === currentArea);
    const availableCount = areaTables.filter(
        (t) => t.status === "available"
    ).length;
    const bookedCount = areaTables.filter((t) => t.status === "booked").length;

    const pieData = [
        { name: "Bàn trống", value: availableCount },
        { name: "Đã đặt", value: bookedCount },
    ];

    return (
        <Card title="Sơ đồ đặt bàn" style={{ background: "#fafafa" }}>
            {/* Khu vực chọn */}
            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                <Select
                    value={currentArea}
                    onChange={(v) => setCurrentArea(v)}
                    style={{ width: 150 }}
                >
                    <Option value="A">Khu A</Option>
                    <Option value="B">Khu B</Option>
                    <Option value="C">Khu C</Option>
                    <Option value="D">Khu D</Option>
                </Select>

                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                    <Statistic title="Tổng bàn" value={areaTables.length} />
                    <Statistic title="Trống" value={availableCount} />
                    <Statistic title="Đã đặt" value={bookedCount} />
                    <PieChart width={180} height={160}>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={60}
                            label
                        >
                            {pieData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>

                <Button
                    type="primary"
                    disabled={selectedTables.length < 2}
                    onClick={handleMergeTables}
                >
                    Gộp bàn
                </Button>
            </div>

            {/* Hiển thị bàn */}
            <Row gutter={[16, 16]}>
                {areaTables.map((table) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={table.id}>
                        <div
                            onClick={() => handleToggle(table.id)}
                            style={{
                                cursor: "pointer",
                                textAlign: "center",
                                backgroundColor:
                                    table.status === "booked"
                                        ? "rgba(255, 200, 200, 0.9)"
                                        : "rgba(240, 240, 240, 0.9)",
                                borderRadius: 12,
                                padding: 10,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                transition: "0.3s",
                            }}
                        >
                            <Checkbox
                                checked={selectedTables.includes(table.id)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    if (e.target.checked)
                                        setSelectedTables((prev) => [...prev, table.id]);
                                    else
                                        setSelectedTables((prev) =>
                                            prev.filter((id) => id !== table.id)
                                        );
                                }}
                            >
                                Chọn
                            </Checkbox>

                            <img
                                src={getImageForTable(table.capacity)}
                                alt={table.name}
                                style={{
                                    width: "100%",
                                    filter:
                                        table.status === "available"
                                            ? "brightness(0.6)"
                                            : "brightness(1.1)",
                                }}
                            />
                            <h4>{table.name}</h4>
                            <Tag color={table.status === "available" ? "green" : "red"}>
                                {table.status === "available" ? "Bàn trống" : "Đã đặt"}
                            </Tag>

                            {table.name.startsWith("Gộp (") && (
                                <Button
                                    size="small"
                                    type="dashed"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSplitTable(table);
                                    }}
                                    style={{ marginTop: 8 }}
                                >
                                    Tách bàn
                                </Button>
                            )}
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Modal đặt bàn */}
            <Modal
                title={`Đặt ${selectedTable?.name}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            message.success(`Đã đặt ${selectedTable?.name}`);
                            setTables((prev) =>
                                prev.map((t) =>
                                    t.id === selectedTable?.id
                                        ? {
                                            ...t,
                                            status: "booked",
                                            customer: {
                                                name: values.name,
                                                phone: values.phone,
                                                time: values.time.format("DD/MM/YYYY HH:mm"),
                                                note: values.note,
                                            },
                                        }
                                        : t
                                )
                            );
                            setIsModalVisible(false);
                            form.resetFields();
                        })
                        .catch(() => { });
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên khách hàng"
                        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                    >
                        <Input placeholder="Nguyễn Văn A" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}
                    >
                        <Input placeholder="0123 456 789" />
                    </Form.Item>

                    {/* 🕒 Thêm thời gian đặt */}
                    <Form.Item
                        name="time"
                        label="Thời gian đặt bàn"
                        rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
                    >
                        <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            style={{ width: "100%" }}
                            defaultValue={dayjs()}
                        />
                    </Form.Item>

                    <Form.Item name="note" label="Ghi chú">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal xem khách hàng */}
            <Modal
                title={`Thông tin khách hàng (${viewCustomer?.name})`}
                open={!!viewCustomer}
                onCancel={() => setViewCustomer(null)}
                footer={null}
            >
                {viewCustomer?.customer ? (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Tên khách hàng">
                            {viewCustomer.customer.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {viewCustomer.customer.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian đặt bàn">
                            {viewCustomer.customer.time}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">
                            {viewCustomer.customer.note || "Không có"}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <p>Không có thông tin khách hàng</p>
                )}
            </Modal>
        </Card>
    );
};

export default TableMapPage;
