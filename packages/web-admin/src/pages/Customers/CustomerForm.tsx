import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { useAppDispatch } from "@/store/hooks";
import { createCustomer } from "@/store/slices/customerSlice";
import type { Customer } from "@/types/customer";


interface CustomerFormProps {
    open: boolean;
    onClose: () => void;
    editingCustomer?: Customer | null; // nếu có khách hàng thì là sửa
}

const CustomerForm: React.FC<CustomerFormProps> = ({ open, onClose, editingCustomer }) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

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
            await dispatch(createCustomer(values)).unwrap();
            onClose();
        } catch (error) {
            console.error("Lỗi khi lưu khách hàng:", error);
        }
    };

    return (
        <Modal
            open={open}
            title={editingCustomer ? "Sửa khách hàng" : "Thêm khách hàng"}
            okText="Lưu"
            cancelText="Hủy"
            onCancel={onClose}
            onOk={handleSubmit}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Họ và tên"
                    name="fullname"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                >
                    <Input placeholder="Nhập họ tên" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                    ]}
                >
                    <Input placeholder="example@gmail.com" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CustomerForm;
