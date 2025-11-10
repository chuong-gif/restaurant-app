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

type FormData = {
    ho_ten: string;
    email: string;
    dien_thoai?: string;
    dia_chi?: string;
    trang_thai: boolean;
    loai_nguoi_dung: UserType;
    vai_tro_id?: number;
    anh_dai_dien_id?: number;
    password?: string;
    confirmPassword?: string;
};

const UserFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const { message } = App.useApp();

    const { data: userData, isLoading: isLoadingUser, isFetching: isFetchingUser } = useGetUserByIdQuery(Number(id), {
        skip: !isEditMode,
    });
    const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery({ page: 1, limit: 100 });

    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            ho_ten: '',
            email: '',
            dien_thoai: '',
            dia_chi: '',
            trang_thai: true,
            loai_nguoi_dung: UserType.KHACH_HANG,
            vai_tro_id: undefined,
            anh_dai_dien_id: undefined,
            password: '',
            confirmPassword: '',
        }
    });

    const selectedUserType = watch('loai_nguoi_dung');
    const passwordValue = watch('password');

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

    useEffect(() => {
        if (selectedUserType === UserType.KHACH_HANG) {
            setValue('vai_tro_id', undefined);
        }
    }, [selectedUserType, setValue]);

    const onSubmit = async (data: FormData) => {
        const { confirmPassword, ...submitData } = data;

        if (!isEditMode && submitData.loai_nguoi_dung === UserType.NHAN_VIEN && !submitData.password) {
            message.error('Mật khẩu là bắt buộc khi tạo Nhân viên.');
            return;
        }
        if (submitData.loai_nguoi_dung === UserType.NHAN_VIEN && !submitData.vai_tro_id) {
            message.error('Vai trò là bắt buộc đối với Nhân viên.');
            return;
        }
        if (submitData.loai_nguoi_dung === UserType.KHACH_HANG) {
            setValue('vai_tro_id', undefined);
        }

        if (!submitData.password) {
            delete submitData.password;
        }

        try {
            const payload = { ...submitData, permissions: (submitData as any).permissions ?? [] };
            if (isEditMode) {
                await updateUser({ id: Number(id), data: payload }).unwrap();
                message.success('Cập nhật người dùng thành công!');
            } else {
                await createUser(payload).unwrap();
                message.success('Thêm người dùng thành công!');
            }
            navigate('/users');
        } catch (err: any) {
            console.error('Lỗi khi lưu người dùng:', err);
            message.error(err.data?.message || 'Lưu người dùng thất bại.');
        }
    };

    if (isLoadingUser || isFetchingUser) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="glass-card rounded-2xl p-8">
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="animate-fade-in">
                <div className="glass-card rounded-3xl p-8 shadow-soft">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/users')}
                        className="glass-button-back rounded-xl mb-6 shadow-soft hover:shadow-float transition-all"
                    >
                        Quay lại danh sách
                    </Button>

                    <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        {isEditMode ? 'Cập nhật Người dùng' : 'Thêm mới Người dùng'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {isEditMode ? 'Cập nhật thông tin người dùng hiện có' : 'Thêm người dùng mới vào hệ thống'}
                    </p>

                    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                        <Row gutter={24}>
                            <Col xs={24} md={16}>
                                <div className="glass-form-section rounded-2xl p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin cơ bản</h3>
                                    <div className="space-y-4">
                                        <Form.Item label="Họ tên" required validateStatus={errors.ho_ten ? 'error' : ''} help={errors.ho_ten?.message}>
                                            <Controller name="ho_ten" control={control} rules={{ required: 'Họ tên là bắt buộc' }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập họ tên"
                                                        className="glass-input rounded-xl"
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Email" required validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
                                            <Controller name="email" control={control} rules={{
                                                required: 'Email là bắt buộc',
                                                pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' }
                                            }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="Nhập email"
                                                        className="glass-input rounded-xl"
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Điện thoại" validateStatus={errors.dien_thoai ? 'error' : ''} help={errors.dien_thoai?.message}>
                                            <Controller name="dien_thoai" control={control} rules={{
                                                pattern: { value: /^[0-9]+$/, message: 'Số điện thoại chỉ chứa số' }
                                            }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập số điện thoại"
                                                        className="glass-input rounded-xl"
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Địa chỉ">
                                            <Controller name="dia_chi" control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập địa chỉ"
                                                        className="glass-input rounded-xl"
                                                    />
                                                )}
                                            />
                                        </Form.Item>

                                        {!isEditMode && (
                                            <div className="glass-password-section rounded-2xl p-4 mt-4">
                                                <h4 className="font-medium text-gray-700 mb-3">Thiết lập mật khẩu</h4>
                                                <div className="space-y-4">
                                                    <Form.Item label="Mật khẩu" required={selectedUserType === UserType.NHAN_VIEN} validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
                                                        <Controller name="password" control={control} rules={{
                                                            required: selectedUserType === UserType.NHAN_VIEN ? 'Mật khẩu là bắt buộc cho Nhân viên' : false,
                                                            minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
                                                        }}
                                                            render={({ field }) => (
                                                                <Input.Password
                                                                    {...field}
                                                                    placeholder="Nhập mật khẩu (bỏ trống nếu là KH)"
                                                                    className="glass-input rounded-xl"
                                                                />
                                                            )}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item label="Xác nhận Mật khẩu" required={!!passwordValue} validateStatus={errors.confirmPassword ? 'error' : ''} help={errors.confirmPassword?.message}>
                                                        <Controller name="confirmPassword" control={control} rules={{
                                                            required: !!passwordValue ? 'Vui lòng xác nhận mật khẩu' : false,
                                                            validate: value => value === passwordValue || 'Mật khẩu không khớp'
                                                        }}
                                                            render={({ field }) => (
                                                                <Input.Password
                                                                    {...field}
                                                                    placeholder="Nhập lại mật khẩu"
                                                                    className="glass-input rounded-xl"
                                                                />
                                                            )}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Col>

                            <Col xs={24} md={8}>
                                <div className="glass-sidebar rounded-2xl p-6 space-y-6">
                                    <Form.Item label="Loại người dùng" required>
                                        <Controller name="loai_nguoi_dung" control={control} rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    placeholder="Chọn loại người dùng"
                                                    disabled={isEditMode}
                                                    className="glass-select rounded-xl w-full"
                                                >
                                                    <Option value={UserType.KHACH_HANG}>Khách Hàng</Option>
                                                    <Option value={UserType.NHAN_VIEN}>Nhân Viên</Option>
                                                </Select>
                                            )}
                                        />
                                    </Form.Item>

                                    {selectedUserType === UserType.NHAN_VIEN && (
                                        <Form.Item label="Vai trò" required validateStatus={errors.vai_tro_id ? 'error' : ''} help={errors.vai_tro_id?.message}>
                                            <Controller name="vai_tro_id" control={control} rules={{ required: 'Vai trò là bắt buộc cho Nhân viên' }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        placeholder="Chọn vai trò"
                                                        loading={isLoadingRoles}
                                                        className="glass-select rounded-xl w-full"
                                                    >
                                                        {roles?.data?.map((role) => (
                                                            <Option key={role.id} value={role.id}>{role.ten_vai_tro}</Option>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </Form.Item>
                                    )}

                                    <Form.Item label="Trạng thái">
                                        <div className="flex items-center justify-between glass-switch rounded-xl p-3">
                                            <span className="text-gray-700">Trạng thái tài khoản</span>
                                            <Controller name="trang_thai" control={control}
                                                render={({ field }) => (
                                                    <Switch
                                                        {...field}
                                                        checked={field.value}
                                                        checkedChildren="Hoạt động"
                                                        unCheckedChildren="Ngưng"
                                                        className="glass-switch-inner"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Form.Item>

                                    <Form.Item label="Ảnh đại diện">
                                        <div className="glass-upload rounded-2xl p-4">
                                            <Controller name="anh_dai_dien_id" control={control}
                                                render={({ field }) => (
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        initialImageUrl={userData?.media_files?.file_url}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                        <Form.Item className="mt-6">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isCreating || isUpdating}
                                className="glass-button-primary rounded-xl shadow-soft hover:shadow-float transition-all duration-300 px-8 py-4 h-auto text-lg font-medium"
                            >
                                {isEditMode ? 'Cập nhật' : 'Lưu người dùng'}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                }

                .glass-button-back {
                    background: rgba(255, 255, 255, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    color: #667eea;
                }

                .glass-button-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    box-shadow: 0 4px 15px 0 rgba(116, 75, 162, 0.3);
                }

                .glass-form-section {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                }

                .glass-sidebar {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                }

                .glass-password-section {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .glass-input :global(.ant-input),
                .glass-input :global(.ant-input-password),
                .glass-select :global(.ant-select-selector) {
                    background: rgba(255, 255, 255, 0.4) !important;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    border-radius: 12px !important;
                }

                .glass-upload {
                    background: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                }

                .glass-switch {
                    background: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                }

                .shadow-soft {
                    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.8) inset;
                }

                .shadow-float {
                    box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
};

export default UserFormPage;