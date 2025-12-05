import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Modal, Form, Switch, Space, Tag, InputNumber, Select, App, Row, Col, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { setInventoryFilters } from '../../features/inventory/inventorySlice';
import {
    useGetMaterialsQuery,
    useCreateMaterialMutation,
    useUpdateMaterialMutation,
    useDeleteMaterialMutation
} from '../../features/inventory/inventoryApi';
import { Material } from '../../types/inventory';
import { useDebounce } from 'use-debounce';

const { Option } = Select;

const MaterialListPage: React.FC = () => {
    const navigate = useNavigate();
    const { message, modal } = App.useApp();
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.inventoryFilters);
    const [debouncedSearch] = useDebounce(filters.searchName, 500);

    // API Hooks
    const { data, isLoading } = useGetMaterialsQuery({
        page: filters.page,
        limit: filters.limit,
        searchName: debouncedSearch,
    });
    const [createMaterial, { isLoading: isCreating }] = useCreateMaterialMutation();
    const [updateMaterial, { isLoading: isUpdating }] = useUpdateMaterialMutation();
    const [deleteMaterial] = useDeleteMaterialMutation();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [form] = Form.useForm();

    const handleAddNew = () => {
        setEditingMaterial(null);
        form.resetFields();
        // Set giá trị mặc định
        form.setFieldsValue({ muc_canh_bao: 5, trang_thai: true });
        setIsModalOpen(true);
    };

    const handleEdit = (record: Material) => {
        setEditingMaterial(record);
        form.setFieldsValue({
            ten_nguyen_lieu: record.ten_nguyen_lieu,
            don_vi_tinh: record.don_vi_tinh,
            muc_canh_bao: record.muc_canh_bao,
            ghi_chu: record.ghi_chu,
            trang_thai: record.trang_thai
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa nguyên liệu này? Hành động này không thể hoàn tác nếu nguyên liệu đã có lịch sử nhập xuất.',
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteMaterial(id).unwrap();
                    message.success('Đã xóa thành công');
                } catch (err: any) {
                    message.error(err.data?.message || 'Không thể xóa nguyên liệu này');
                }
            }
        });
    };

    const handleFormSubmit = async (values: any) => {
        try {
            if (editingMaterial) {
                await updateMaterial({ id: editingMaterial.id, data: values }).unwrap();
                message.success('Cập nhật thành công');
            } else {
                await createMaterial(values).unwrap();
                message.success('Thêm mới thành công');
            }
            setIsModalOpen(false);
        } catch (err: any) {
            message.error(err.data?.message || 'Có lỗi xảy ra');
        }
    };

    const columns = [
        {
            title: 'Tên nguyên liệu',
            dataIndex: 'ten_nguyen_lieu',
            key: 'name',
            render: (text: string) => <span className="font-medium text-blue-800">{text}</span>
        },
        {
            title: 'Đơn vị',
            dataIndex: 'don_vi_tinh',
            key: 'unit',
            width: 100,
            render: (unit: string) => <Tag>{unit}</Tag>
        },
        {
            title: 'Tồn kho',
            dataIndex: 'so_luong_ton',
            key: 'stock',
            width: 120,
            render: (stock: number, record: Material) => {
                const isLow = stock <= record.muc_canh_bao;
                return (
                    <span className={`font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                        {stock} {isLow && <Tooltip title="Sắp hết hàng"><WarningOutlined /></Tooltip>}
                    </span>
                );
            }
        },
        {
            title: 'Mức cảnh báo',
            dataIndex: 'muc_canh_bao',
            key: 'warning',
            width: 120,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'status',
            width: 120,
            render: (status: boolean) => (
                <Tag color={status ? 'green' : 'default'}>
                    {status ? 'Đang dùng' : 'Ngừng'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            render: (_: any, record: Material) => (
                <Space>
                    <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Quản lý Nguyên liệu</h2>
                    <Space>
                        {/* Nút nhập kho mới */}
                        <Button type="default" icon={<PlusOutlined />} onClick={() => navigate('/inventory/import')}>
                            Nhập kho
                        </Button>

                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                            Thêm nguyên liệu mới
                        </Button>
                    </Space>
                </div>

                <Row gutter={16} className="mb-4">
                    <Col span={8}>
                        <Input
                            placeholder="Tìm nguyên liệu..."
                            prefix={<SearchOutlined />}
                            onChange={(e) => dispatch(setInventoryFilters({ searchName: e.target.value }))}
                        />
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={data?.data || []}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{
                        current: filters.page,
                        pageSize: filters.limit,
                        total: data?.total || 0,
                        onChange: (page, limit) => dispatch(setInventoryFilters({ page, limit }))
                    }}
                />
            </div>

            <Modal
                title={editingMaterial ? "Sửa Nguyên liệu" : "Thêm Nguyên liệu"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item name="ten_nguyen_lieu" label="Tên nguyên liệu" rules={[{ required: true, message: 'Nhập tên' }]}>
                        <Input placeholder="Ví dụ: Thịt bò, Trứng gà..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="don_vi_tinh" label="Đơn vị tính" rules={[{ required: true, message: 'Chọn đơn vị' }]}>
                                <Select placeholder="Chọn đơn vị">
                                    <Option value="kg">Kilogram (kg)</Option>
                                    <Option value="g">Gram (g)</Option>
                                    <Option value="lit">Lít (l)</Option>
                                    <Option value="ml">Milliliter (ml)</Option>
                                    <Option value="qua">Quả</Option>
                                    <Option value="chai">Chai</Option>
                                    <Option value="lon">Lon</Option>
                                    <Option value="goi">Gói</Option>
                                    <Option value="thung">Thùng</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="muc_canh_bao" label="Mức cảnh báo (Tồn tối thiểu)" rules={[{ required: true }]}>
                                <InputNumber min={0} className="w-full" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="ghi_chu" label="Ghi chú">
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    {editingMaterial && (
                        <Form.Item name="trang_thai" label="Trạng thái" valuePropName="checked">
                            <Switch checkedChildren="Đang dùng" unCheckedChildren="Ngừng" />
                        </Form.Item>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                            {editingMaterial ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default MaterialListPage;