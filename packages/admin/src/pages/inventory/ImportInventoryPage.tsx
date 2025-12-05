import React, { useState } from 'react';
import { Form, Select, Button, Table, InputNumber, Input, Card, Row, Col, App, Divider, Statistic } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useGetSuppliersQuery, useGetMaterialsQuery, useImportInventoryMutation } from '../../features/inventory/inventoryApi';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ImportInventoryPage: React.FC = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Data
    const { data: suppliers } = useGetSuppliersQuery({ page: 1, limit: 100, status: 'true' });
    const { data: materials } = useGetMaterialsQuery({ page: 1, limit: 1000, status: 'true' });
    const [importInventory, { isLoading }] = useImportInventoryMutation();

    // Local state cho danh sách chi tiết
    const [details, setDetails] = useState<any[]>([]);

    // Thêm dòng mới
    const handleAddItem = () => {
        setDetails([...details, { key: Date.now(), material_id: null, quantity: 1, price: 0 }]);
    };

    // Xóa dòng
    const handleRemoveItem = (key: number) => {
        setDetails(details.filter(item => item.key !== key));
    };

    // Cập nhật giá trị trên dòng
    const handleUpdateItem = (key: number, field: string, value: any) => {
        const newDetails = details.map(item => {
            if (item.key === key) {
                const updatedItem = { ...item, [field]: value };
                // Nếu thay đổi nguyên liệu -> Tự động lấy giá nhập cuối làm gợi ý (Optional)
                if (field === 'material_id') {
                    const mat = materials?.data.find(m => m.id === value);
                    if (mat && mat.gia_nhap_cuoi) updatedItem.price = mat.gia_nhap_cuoi;
                }
                return updatedItem;
            }
            return item;
        });
        setDetails(newDetails);
    };

    // Tính tổng tiền
    const totalAmount = details.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    const onFinish = async (values: any) => {
        if (details.length === 0) {
            message.error('Vui lòng thêm ít nhất một nguyên liệu');
            return;
        }
        // Validate chi tiết
        for (const item of details) {
            if (!item.material_id || item.quantity <= 0 || item.price < 0) {
                message.error('Dữ liệu chi tiết không hợp lệ (Kiểm tra tên, số lượng, đơn giá)');
                return;
            }
        }

        try {
            const payload = {
                supplier_id: values.supplier_id,
                note: values.note,
                details: details.map(d => ({
                    material_id: d.material_id,
                    quantity: d.quantity,
                    price: d.price
                }))
            };
            await importInventory(payload).unwrap();
            message.success('Nhập kho thành công!');
            navigate('/inventory/materials'); // Quay về trang nguyên liệu để xem kết quả
        } catch (err) {
            message.error('Lỗi khi nhập kho');
        }
    };

    const columns = [
        {
            title: 'Nguyên liệu',
            dataIndex: 'material_id',
            render: (value: any, record: any) => (
                <Select
                    showSearch
                    style={{ width: 250 }}
                    placeholder="Chọn nguyên liệu"
                    optionFilterProp="children"
                    value={value}
                    onChange={(val) => handleUpdateItem(record.key, 'material_id', val)}
                >
                    {materials?.data.map(m => (
                        <Option key={m.id} value={m.id}>
                            {m.ten_nguyen_lieu} ({m.don_vi_tinh})
                        </Option>
                    ))}
                </Select>
            )
        },
        {
            title: 'Số lượng nhập',
            dataIndex: 'quantity',
            render: (value: any, record: any) => (
                <InputNumber min={0.1} value={value} onChange={(val) => handleUpdateItem(record.key, 'quantity', val)} />
            )
        },
        {
            title: 'Đơn giá nhập (VNĐ)',
            dataIndex: 'price',
            render: (value: any, record: any) => (
                <InputNumber
                    min={0}
                    style={{ width: 150 }}
                    value={value}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => Number(value?.replace(/\$\s?|(,*)/g, '') || 0)}
                    onChange={(val) => handleUpdateItem(record.key, 'price', val)}
                />
            )
        },
        {
            title: 'Thành tiền',
            render: (_: any, record: any) => (
                <span className="font-semibold">{(record.quantity * record.price).toLocaleString()} đ</span>
            )
        },
        {
            title: '',
            render: (_: any, record: any) => (
                <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveItem(record.key)} />
            )
        }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center mb-4">
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/inventory/materials')} className="mr-4">Quay lại</Button>
                    <h2 className="text-2xl font-bold text-blue-700 m-0">Tạo Phiếu Nhập Kho</h2>
                </div>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={24}>
                        <Col span={16}>
                            <Card title="Chi tiết nhập hàng" className="shadow-sm rounded-xl">
                                <Table
                                    dataSource={details}
                                    columns={columns}
                                    pagination={false}
                                    rowKey="key"
                                    footer={() => (
                                        <Button type="dashed" onClick={handleAddItem} icon={<PlusOutlined />} block>
                                            Thêm dòng nguyên liệu
                                        </Button>
                                    )}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Thông tin phiếu" className="shadow-sm rounded-xl mb-4">
                                <Form.Item name="supplier_id" label="Nhà cung cấp" rules={[{ required: true, message: 'Chọn nhà cung cấp' }]}>
                                    <Select placeholder="Chọn NCC" loading={!suppliers}>
                                        {suppliers?.data.map(s => (
                                            <Option key={s.id} value={s.id}>{s.ten_nha_cung_cap}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="note" label="Ghi chú">
                                    <Input.TextArea rows={3} placeholder="VD: Nhập hàng đợt 1 tháng 12..." />
                                </Form.Item>
                                <Divider />
                                <div className="text-right">
                                    <Statistic title="Tổng tiền thanh toán" value={totalAmount} suffix="đ" valueStyle={{ color: '#cf1322', fontWeight: 'bold' }} />
                                </div>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" block className="mt-4" loading={isLoading}>
                                    HOÀN TẤT NHẬP KHO
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default ImportInventoryPage;