// packages/web-admin/src/components/product/ProductForm.tsx
import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, message } from "antd";
import { useAppDispatch } from "@/store/hooks";
import { createProduct } from "@/store/slices/productSlice";
import type { Product } from "@/types/product";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onAdded?: () => void;
  product?: any;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onAdded, product }) => {


  const [form] = Form.useForm<Product>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
    else {
      form.resetFields();
    }
  }, [product, form]);


  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // đảm bảo price là number trước khi gửi
      const payload: Product = {
        ...values,
        price: Number(String(values.price).replace(/[^\d]/g, "")) || 0,
      } as Product;

      if (product?.id) {
        // 🟢 Nếu đang sửa
        // (Bạn có thể thêm hàm updateProduct trong slice hoặc API riêng)
        await dispatch(createProduct({ ...payload, id: product.id })).unwrap();
        message.success("Cập nhật sản phẩm thành công 🎉");
      }
      else {
        await dispatch(createProduct(payload)).unwrap();
        message.success("Thêm sản phẩm thành công 🎉");
      }

      console.log("✅ Product created successfully, calling onAdded");
      if (onAdded) setTimeout(() => onAdded(), 300);
      form.resetFields();
      onClose();
    } catch (err: any) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      message.error(err?.message || "Không thể thêm sản phẩm");
    }
  };

  return (
    <Modal
      title="Thêm sản phẩm"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select placeholder="Chọn danh mục">
            <Select.Option value="Đồ uống">Đồ uống</Select.Option>
            <Select.Option value="Món chính">Món chính</Select.Option>
            <Select.Option value="Tráng miệng">Tráng miệng</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá (₫)"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          {/* chú ý: khai báo generic <number> để value là số */}
          <InputNumber<number>
            min={0}
            style={{ width: "100%" }}
            formatter={(v) =>
              `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "₫"
            }
            /* parser trả về number — nhưng để tránh lỗi type cứng của AntD trong môi trường TS
               ta convert về number và dùng `as any` để xóa kiểu gây vướng.
               Đây là cách an toàn vì trước khi dispatch mình vẫn convert giá về number. */
            parser={
              ((v?: string) => {
                const cleaned = v ? String(v).replace(/[₫,]/g, "") : "0";
                return Number(cleaned);
              }) as any
            }
            placeholder="Nhập giá sản phẩm"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
