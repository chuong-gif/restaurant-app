import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Switch, Space, Tag, Tooltip, App, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { setInventoryFilters } from '../../features/inventory/inventorySlice';
import {
    useGetSuppliersQuery,
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation
} from '../../features/inventory/inventoryApi';
import { Supplier } from '../../types/inventory';
import { useDebounce } from 'use-debounce';

const SupplierListPage: React.FC = () => {
    const { message, modal } = App.useApp();
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.inventoryFilters);
    const [debouncedSearch] = useDebounce(filters.searchName, 500);

    // API Hooks
    const { data, isLoading } = useGetSuppliersQuery({
        page: filters.page,
        limit: filters.limit,
        searchName: debouncedSearch,
    });
    const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation();
    const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();
    const [deleteSupplier] = useDeleteSupplierMutation();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [form] = Form.useForm();

    // Handlers
    const handleAddNew = () => {
        setEditingSupplier(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Supplier) => {
        setEditingSupplier(record);
        form.setFieldsValue({
            ten_nha_cung_cap: record.ten_nha_cung_cap,
            so_dien_thoai: record.so_dien_thoai,
            email: record.email,
            dia_chi: record.dia_chi,
            ghi_chu: record.ghi_chu,
            trang_thai: record.trang_thai
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa nhà cung cấp này? Nếu đã có phiếu nhập, bạn nên tắt hoạt động thay vì xóa.',
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteSupplier(id).unwrap();
                    message.success('Đã xóa thành công');
                } catch (err: any) {
                    message.error(err.data?.message || 'Lỗi khi xóa');
                }
            }
        });
    };

    const handleFormSubmit = async (values: any) => {
        try {
            if (editingSupplier) {
                await updateSupplier({ id: editingSupplier.id, data: values }).unwrap();
                message.success('Cập nhật thành công');
            } else {
                await createSupplier(values).unwrap();
                message.success('Thêm mới thành công');
            }
            setIsModalOpen(false);
        } catch (err: any) {
            message.error(err.data?.message || 'Có lỗi xảy ra');
        }
    };

    const columns = [
        {
            title: 'Tên nhà cung cấp',
            dataIndex: 'ten_nha_cung_cap',
            key: 'name',
            render: (text: string) => <span className="font-semibold text-blue-700">{text}</span>
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            render: (_: any, record: Supplier) => (
                <div className="flex flex-col text-sm text-gray-600">
                    {record.so_dien_thoai && <span><PhoneOutlined /> {record.so_dien_thoai}</span>}
                    {record.email && <span><MailOutlined /> {record.email}</span>}
                </div>
            )
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'dia_chi',
            key: 'address',
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'status',
            render: (status: boolean) => (
                <Tag color={status ? 'green' : 'red'}>
                    {status ? 'Hoạt động' : 'Ngừng hợp tác'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Supplier) => (
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
                    <h2 className="text-xl font-bold">Quản lý Nhà cung cấp</h2>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Thêm mới</Button>
                </div>

                <Row gutter={16} className="mb-4">
                    <Col span={8}>
                        <Input
                            placeholder="Tìm kiếm nhà cung cấp..."
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
                title={editingSupplier ? "Cập nhật Nhà cung cấp" : "Thêm mới Nhà cung cấp"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item name="ten_nha_cung_cap" label="Tên nhà cung cấp" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                        <Input />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="so_dien_thoai" label="Số điện thoại">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="dia_chi" label="Địa chỉ">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="ghi_chu" label="Ghi chú">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    {editingSupplier && (
                        <Form.Item name="trang_thai" label="Trạng thái" valuePropName="checked">
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng" />
                        </Form.Item>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                            {editingSupplier ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default SupplierListPage;