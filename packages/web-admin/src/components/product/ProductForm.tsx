// File: packages/web-admin/src/components/product/ProductForm.tsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, InputNumber, message, Upload } from "antd";
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { createProduct, updateProduct } from "@/api/productsApi";
import { getAllCategories } from "@/api/productCategoryApi";
import { storage } from "@/configs/client/Firebase"; // 👈 Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createMediaFile } from "@/api/mediaApi";

// Định nghĩa kiểu dữ liệu
interface Category {
  id: number;
  ten_danh_muc: string;
}

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onAdded?: () => void;
  product?: any; // Dữ liệu sản phẩm khi ở chế độ sửa
}

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onAdded, product }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 👇 3. Tải danh sách danh mục từ API khi form được mở
  useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        try {
          const response = await getAllCategories();
          setCategories(response);
        } catch (error) {
          message.error("Không thể tải danh sách danh mục!");
        }
      };
      fetchCategories();
    }
  }, [open]);

  // Tự động điền dữ liệu vào form khi ở chế độ sửa
  useEffect(() => {
    if (open && product) {
      form.setFieldsValue({
        ...product,
        danh_muc_id: product.danh_muc_san_pham?.id, // Lấy ID của danh mục
      });
    } else {
      form.resetFields();
    }
  }, [product, open, form]);

  // 👇 HÀM XỬ LÝ TẢI ẢNH LÊN FIREBASE
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const filePath = `products/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      // ✅ GỌI API BACKEND ĐỂ LƯU THÔNG TIN FILE
      const response = await createMediaFile({
        file_url: url,
        file_path: filePath,
        file_type: file.type,
      });

      // Lấy id của media file từ phản hồi của server
      const mediaFileId = response.data.id;

      // Gán ID này vào trường hinh_anh_id của form
      form.setFieldsValue({ hinh_anh_id: mediaFileId });
      setImageUrl(url);
      message.success("Tải ảnh lên và lưu thông tin thành công!");

    } catch (error) {
      message.error("Tải ảnh hoặc lưu thông tin thất bại!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      if (product?.id) {
        // Logic cho Sửa sản phẩm
        await updateProduct(product.id, values);
        message.success("Cập nhật sản phẩm thành công 🎉");
      } else {
        // Logic cho Thêm mới sản phẩm
        await createProduct(values);
        message.success("Thêm sản phẩm thành công 🎉");
      }

      console.log("✅ Product operation successful, calling onAdded");
      onAdded?.(); // Gọi hàm để tải lại danh sách
      onClose(); // Đóng form
    } catch (err: any) {
      console.error("Lỗi khi xử lý sản phẩm:", err);
      message.error(err.message || "Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={product ? "Sửa sản phẩm" : "Thêm sản phẩm"}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
      forceRender
    >
      <Form layout="vertical" form={form} name="product_form">
        {/* 👇 4. Sửa lại tên các trường cho khớp với CSDL */}
        <Form.Item
          label="Tên sản phẩm"
          name="ten_san_pham"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="danh_muc_id"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          {/* 👇 5. Dùng `danh_muc_id` làm value và `ten_danh_muc` làm tên hiển thị */}
          <Select placeholder="Chọn danh mục" loading={categories.length === 0}>
            {categories.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.ten_danh_muc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá (₫)"
          name="gia_ban"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập giá sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="mo_ta"
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả cho sản phẩm" />
        </Form.Item>
        <Form.Item label="Hình ảnh sản phẩm">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={(file) => {
              handleImageUpload(file);
              return false; // Ngăn Ant Design tự động tải lên
            }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="product" style={{ width: '100%' }} />
            ) : (
              <div>
                {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        {/* Trường ẩn để lưu hinh_anh_id */}
        <Form.Item name="hinh_anh_id" hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;