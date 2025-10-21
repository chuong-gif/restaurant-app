import React, { useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import { useAppDispatch } from "../../store/hooks";
import { createCustomer, updateCustomer } from "../../store/slices/customerSlice";
import type { Customer } from "../../types/customer";

interface CustomerFormProps {
    open: boolean;
    onClose: () => void;
    editingCustomer?: Customer | null;
    onCancel?: () => void; // ✅ giờ là tùy chọn, không bắt buộc
    refreshList?: () => Promise<void>;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
    open,
    onClose,
    editingCustomer,
    onCancel,
    refreshList,
}) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    // ✅ helper đóng form (hỗ trợ cả onClose và onCancel)
    const closeForm = () => {
        if (onClose) onClose();
        else if (onCancel) onCancel();
    };

    useEffect(() => {
        if (editingCustomer) {
            form.setFieldsValue(editingCustomer);
        } else {
            form.resetFields();
        }
    }, [editingCustomer, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingCustomer) {
                await dispatch(updateCustomer({ id: editingCustomer.id, data: values })).unwrap();
                message.success("Cập nhật khách hàng thành công");
            } else {
                await dispatch(createCustomer(values)).unwrap();
                message.success("Thêm khách hàng thành công");
            }

            if (refreshList) await refreshList();
            form.resetFields();
            closeForm(); // ✅ đóng modal
        } catch (error: any) {
            message.error(error?.message || "Đã xảy ra lỗi");
        }
    };

    return (
        <Modal
            open={open}
            title={editingCustomer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
            okText={editingCustomer ? "Cập nhật" : "Thêm mới"}
            cancelText="Hủy"
            onCancel={closeForm} // ✅ dùng helper
            onOk={handleSubmit}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên khách hàng"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại" },
                        { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Email" name="email">
                    <Input type="email" />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address">
                    <Input.TextArea rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CustomerForm;
