// packages/admin/src/pages/users/UserFormPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
    Form, Input, Button, Select, Spin, message, Row, Col, Switch, Card, App
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetUserByIdQuery, useCreateUserMutation, useUpdateUserMutation } from '../../features/users/userApi';
import { useGetRolesQuery } from '../../features/roles/roleApi';
import ImageUpload from '../../components/common/ImageUpload';
import { User, UserType, Role } from '../../types/user';

const { Option } = Select;
const { TextArea } = Input; // Mặc dù không dùng nhưng để đây nếu cần

// Kiểu dữ liệu cho form
type FormData = {
    ho_ten: string;
    email: string;
    dien_thoai?: string; // bỏ null
    dia_chi?: string; // bỏ null
    trang_thai: boolean;
    loai_nguoi_dung: UserType;
    vai_tro_id?: number; // bỏ null
    anh_dai_dien_id?: number;
    password?: string; // bỏ null
    confirmPassword?: string; // bỏ null
};


const UserFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const { message } = App.useApp();

    // --- RTK Query ---
    const { data: userData, isLoading: isLoadingUser, isFetching: isFetchingUser } = useGetUserByIdQuery(Number(id), {
        skip: !isEditMode,
    });
    const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery({ page: 1, limit: 100 }); // Lấy tất cả vai trò

    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    // --- React Hook Form ---
    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            ho_ten: '',
            email: '',
            dien_thoai: '', // đổi null → ''
            dia_chi: '', // đổi null → ''
            trang_thai: true,
            loai_nguoi_dung: UserType.KHACH_HANG,
            vai_tro_id: undefined,
            anh_dai_dien_id: undefined,
            password: '', // đổi null → ''
            confirmPassword: '', // đổi null → ''
        }

    });

    // Theo dõi loại người dùng để ẩn/hiện trường
    const selectedUserType = watch('loai_nguoi_dung');
    const passwordValue = watch('password');

    // --- Effects ---
    // Đổ dữ liệu vào form khi edit
    useEffect(() => {
        if (isEditMode && userData) {
            reset({
                ho_ten: userData.ho_ten || '',
                email: userData.email || '',
                dien_thoai: userData.dien_thoai || '',
                dia_chi: userData.dia_chi || '',
                trang_thai: userData.trang_thai,
                loai_nguoi_dung: userData.loai_nguoi_dung,
                vai_tro_id: userData.vai_tro_id || undefined,
                anh_dai_dien_id: userData.anh_dai_dien_id || undefined,
                password: '',
                confirmPassword: '',
            });

        }
    }, [userData, isEditMode, reset]);

    // Tự động set vai_tro_id về null nếu chọn Khách hàng
    useEffect(() => {
        if (selectedUserType === UserType.KHACH_HANG) {
            setValue('vai_tro_id', undefined);
        }
    }, [selectedUserType, setValue]);


    // --- Handlers ---
    const onSubmit = async (data: FormData) => {
        // Bỏ qua confirmPassword
        const { confirmPassword, ...submitData } = data;

        // Nếu là Nhân viên và đang tạo mới, mật khẩu là bắt buộc
        if (!isEditMode && submitData.loai_nguoi_dung === UserType.NHAN_VIEN && !submitData.password) {
            message.error('Mật khẩu là bắt buộc khi tạo Nhân viên.');
            return;
        }
        // Nếu là Nhân viên, vai trò là bắt buộc
        if (submitData.loai_nguoi_dung === UserType.NHAN_VIEN && !submitData.vai_tro_id) {
            message.error('Vai trò là bắt buộc đối với Nhân viên.');
            return;
        }
        // Nếu là Khách hàng, xoá vai trò id
        if (submitData.loai_nguoi_dung === UserType.KHACH_HANG) {
            setValue('vai_tro_id', undefined);

        }

        // Không gửi password nếu rỗng khi tạo hoặc khi sửa
        if (!submitData.password) {
            delete submitData.password;
        }

        try {
            if (isEditMode) {
                // Sửa: chỉ gửi các trường cần update, không gửi password
                await updateUser({ id: Number(id), data: submitData }).unwrap();
                message.success('Cập nhật người dùng thành công!');
            } else {
                // Thêm mới
                await createUser(submitData).unwrap();
                message.success('Thêm người dùng thành công!');
            }
            navigate('/users');
        } catch (err: any) {
            console.error('Lỗi khi lưu người dùng:', err);
            message.error(err.data?.message || 'Lưu người dùng thất bại.');
        }
    };

    // --- Render ---
    if (isLoadingUser || isFetchingUser) {
        return <Spin size="large" className="flex justify-center items-center h-full" />;
    }

    return (
        <Card>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/users')} className="mb-4">
                Quay lại danh sách
            </Button>
            <h2 className="text-2xl font-bold mb-4">
                {isEditMode ? 'Cập nhật Người dùng' : 'Thêm mới Người dùng'}
            </h2>
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={24}>
                    {/* Cột trái */}
                    <Col xs={24} md={16}>
                        <Form.Item label="Họ tên" required validateStatus={errors.ho_ten ? 'error' : ''} help={errors.ho_ten?.message}>
                            <Controller name="ho_ten" control={control} rules={{ required: 'Họ tên là bắt buộc' }}
                                render={({ field }) => <Input {...field} placeholder="Nhập họ tên" />} />
                        </Form.Item>
                        <Form.Item label="Email" required validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
                            <Controller name="email" control={control} rules={{
                                required: 'Email là bắt buộc',
                                pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' }
                            }}
                                render={({ field }) => <Input {...field} type="email" placeholder="Nhập email" />} />
                        </Form.Item>
                        <Form.Item label="Điện thoại" validateStatus={errors.dien_thoai ? 'error' : ''} help={errors.dien_thoai?.message}>
                            <Controller name="dien_thoai" control={control} rules={{
                                pattern: { value: /^[0-9]+$/, message: 'Số điện thoại chỉ chứa số' }
                            }}
                                render={({ field }) => <Input {...field} placeholder="Nhập số điện thoại" />} />
                        </Form.Item>
                        <Form.Item label="Địa chỉ">
                            <Controller name="dia_chi" control={control}
                                render={({ field }) => <Input {...field} placeholder="Nhập địa chỉ" />} />
                        </Form.Item>

                        {/* Chỉ hiện mật khẩu khi tạo mới */}
                        {!isEditMode && (
                            <>
                                <Form.Item label="Mật khẩu" required={selectedUserType === UserType.NHAN_VIEN} validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
                                    <Controller name="password" control={control} rules={{
                                        required: selectedUserType === UserType.NHAN_VIEN ? 'Mật khẩu là bắt buộc cho Nhân viên' : false,
                                        minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
                                    }}
                                        render={({ field }) => <Input.Password {...field} placeholder="Nhập mật khẩu (bỏ trống nếu là KH)" />} />
                                </Form.Item>
                                <Form.Item label="Xác nhận Mật khẩu" required={!!passwordValue} validateStatus={errors.confirmPassword ? 'error' : ''} help={errors.confirmPassword?.message}>
                                    <Controller name="confirmPassword" control={control} rules={{
                                        required: !!passwordValue ? 'Vui lòng xác nhận mật khẩu' : false,
                                        validate: value => value === passwordValue || 'Mật khẩu không khớp'
                                    }}
                                        render={({ field }) => <Input.Password {...field} placeholder="Nhập lại mật khẩu" />} />
                                </Form.Item>
                            </>
                        )}
                    </Col>

                    {/* Cột phải */}
                    <Col xs={24} md={8}>
                        <Form.Item label="Loại người dùng" required>
                            <Controller name="loai_nguoi_dung" control={control} rules={{ required: true }}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Chọn loại người dùng" disabled={isEditMode}> {/* Không cho đổi loại khi sửa */}
                                        <Option value={UserType.KHACH_HANG}>Khách Hàng</Option>
                                        <Option value={UserType.NHAN_VIEN}>Nhân Viên</Option>
                                    </Select>
                                )} />
                        </Form.Item>

                        {/* Chỉ hiện Vai trò nếu là Nhân viên */}
                        {selectedUserType === UserType.NHAN_VIEN && (
                            <Form.Item label="Vai trò" required validateStatus={errors.vai_tro_id ? 'error' : ''} help={errors.vai_tro_id?.message}>
                                <Controller name="vai_tro_id" control={control} rules={{ required: 'Vai trò là bắt buộc cho Nhân viên' }}
                                    render={({ field }) => (
                                        <Select {...field} placeholder="Chọn vai trò" loading={isLoadingRoles}>
                                            {roles?.map(role => (
                                                <Option key={role.id} value={role.id}>{role.ten_vai_tro}</Option>
                                            ))}
                                        </Select>
                                    )} />
                            </Form.Item>
                        )}

                        <Form.Item label="Trạng thái">
                            <Controller name="trang_thai" control={control}
                                render={({ field }) => <Switch {...field} checked={field.value} checkedChildren="Hoạt động" unCheckedChildren="Ngưng" />} />
                        </Form.Item>

                        <Form.Item label="Ảnh đại diện">
                            <Controller name="anh_dai_dien_id" control={control}
                                render={({ field }) => (
                                    <ImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        initialImageUrl={userData?.media_files?.file_url}
                                    />
                                )} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                        {isEditMode ? 'Cập nhật' : 'Lưu người dùng'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default UserFormPage;