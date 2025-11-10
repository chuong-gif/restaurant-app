// packages/admin/src/pages/roles/AssignPermissionPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Select, Checkbox, Button, Spin, Alert, Card, Row, Col, Typography, App, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useGetRolesQuery, useGetRoleByIdQuery, useAssignPermissionsMutation } from '../../features/roles/roleApi';
import { useGetAllPermissionsQuery } from '../../features/permissions/permissionApi';
import { Role, Permission } from '../../types/user';

const { Option } = Select;
const { Title, Text } = Typography;

const AssignPermissionPage: React.FC = () => {
    const { message } = App.useApp();
    const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>(undefined);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    // --- RTK Query Hooks ---
    const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({ page: 1, limit: 100 });
    const { data: selectedRoleData, isLoading: isLoadingRoleDetail, isFetching: isFetchingRoleDetail } = useGetRoleByIdQuery(selectedRoleId!, {
        skip: !selectedRoleId,
    });
    const { data: groupedPermissions, isLoading: isLoadingPermissions, error: permissionsError } = useGetAllPermissionsQuery();
    const [assignPermissions, { isLoading: isAssigning }] = useAssignPermissionsMutation();

    // --- Effects ---
    useEffect(() => {
        if (selectedRoleData) {
            const currentPermissionIds = selectedRoleData.vai_tro_quyen.map(p => p.quyen_id);
            setSelectedPermissions(currentPermissionIds);
        } else {
            setSelectedPermissions([]);
        }
    }, [selectedRoleData]);

    // --- Handlers ---
    const handleRoleChange = (value: number | undefined) => {
        setSelectedRoleId(value);
    };

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        setSelectedPermissions(prev =>
            checked ? [...prev, permissionId] : prev.filter(id => id !== permissionId)
        );
    };

    const handleSelectAllGroup = (groupPermissions: Permission[], checked: boolean) => {
        const groupPermissionIds = groupPermissions.map(p => p.id);
        setSelectedPermissions(prev => {
            if (checked) {
                return [...new Set([...prev, ...groupPermissionIds])];
            } else {
                return prev.filter(id => !groupPermissionIds.includes(id));
            }
        });
    };

    const handleSaveChanges = async () => {
        if (!selectedRoleId) {
            message.warning('Vui lòng chọn một vai trò trước.');
            return;
        }
        try {
            await assignPermissions({ roleId: selectedRoleId, permissionIds: selectedPermissions }).unwrap();
            message.success('Phân quyền thành công!');
        } catch (error: any) {
            message.error(error.data?.message || 'Phân quyền thất bại.');
        }
    };

    // --- Helper Functions ---
    const isGroupSelectedAll = (groupPermissions: Permission[]): boolean => {
        if (!groupPermissions || groupPermissions.length === 0) return false;
        return groupPermissions.every(p => selectedPermissions.includes(p.id));
    };

    const isGroupIndeterminate = (groupPermissions: Permission[]): boolean => {
        if (!groupPermissions || groupPermissions.length === 0) return false;
        const groupSelectedCount = groupPermissions.filter(p => selectedPermissions.includes(p.id)).length;
        return groupSelectedCount > 0 && groupSelectedCount < groupPermissions.length;
    };

    // --- Render ---
    const isLoading = isLoadingRoles || isLoadingPermissions || isFetchingRoleDetail;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="animate-fade-in">
                <div className="glass-card rounded-3xl p-8 mb-8 shadow-soft">
                    <Title level={2} className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Phân quyền vào vai trò
                    </Title>
                    <p className="text-gray-600 mb-6">Chọn vai trò và cấp quyền hạn phù hợp cho từng chức năng hệ thống</p>

                    <Row gutter={16} align="middle" className="mb-4">
                        <Col>
                            <Text strong className="text-gray-700">Chọn vai trò:</Text>
                        </Col>
                        <Col flex="auto">
                            <Select<number>
                                placeholder="Chọn vai trò để phân quyền"
                                className="glass-select rounded-xl"
                                style={{ width: '100%', maxWidth: 300 }}
                                loading={isLoadingRoles}
                                value={selectedRoleId}
                                onChange={handleRoleChange}
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {rolesData?.data?.filter(role => role.ten_vai_tro !== 'Super Admin').map(role => (
                                    <Option key={role.id} value={role.id}>{role.ten_vai_tro}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSaveChanges}
                                loading={isAssigning}
                                disabled={!selectedRoleId || isLoading}
                                className="glass-button-primary rounded-xl shadow-soft hover:shadow-float transition-all duration-300"
                            >
                                Áp dụng
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Divider className="my-8" />

                <div className="glass-card rounded-3xl p-8 shadow-soft">
                    <Title level={4} className="mb-6 text-gray-700">Quản lý phân quyền</Title>

                    {isLoading && (
                        <div className="flex justify-center my-12">
                            <div className="glass-card rounded-2xl p-6">
                                <Spin size="large" />
                            </div>
                        </div>
                    )}

                    {permissionsError && (
                        <div className="animate-slide-up">
                            <Alert message="Lỗi tải danh sách quyền" description="Không thể tải danh sách quyền hạn từ server." type="error" showIcon className="rounded-2xl" />
                        </div>
                    )}

                    {!isLoading && !permissionsError && !selectedRoleId && (
                        <div className="animate-slide-up">
                            <Alert message="Vui lòng chọn một vai trò để xem và chỉnh sửa quyền hạn." type="info" showIcon className="rounded-2xl" />
                        </div>
                    )}

                    {!isLoading && !permissionsError && selectedRoleId && groupedPermissions && (
                        <Row gutter={[16, 24]}>
                            {Object.entries(groupedPermissions).map(([groupName, permissions]) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={groupName}>
                                    <div className="animate-float hover:animate-float-hover transition-all duration-300">
                                        <Card
                                            size="small"
                                            title={
                                                <span className="text-blue-700 font-medium">{groupName}</span>
                                            }
                                            className="glass-card-permission h-full rounded-2xl shadow-soft border-0 hover:shadow-float transition-all duration-300"
                                            bodyStyle={{ padding: '16px' }}
                                        >
                                            <Checkbox
                                                indeterminate={isGroupIndeterminate(permissions)}
                                                checked={isGroupSelectedAll(permissions)}
                                                onChange={(e) => handleSelectAllGroup(permissions, e.target.checked)}
                                                className="mb-3 font-semibold text-gray-700"
                                            >
                                                Chọn tất cả
                                            </Checkbox>
                                            <Divider className="my-3 opacity-30" />
                                            <div className="space-y-2">
                                                {permissions.map(permission => (
                                                    <Checkbox
                                                        key={permission.id}
                                                        checked={selectedPermissions.includes(permission.id)}
                                                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                        className="text-gray-600 hover:text-gray-800 transition-colors"
                                                    >
                                                        {permission.ten_chuc_nang}
                                                    </Checkbox>
                                                ))}
                                            </div>
                                        </Card>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </div>

            <style >{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                }

                .glass-card-permission {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                }

                .glass-select {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(10px);
                }

                .glass-button-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    box-shadow: 0 4px 15px 0 rgba(116, 75, 162, 0.3);
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

                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }

                .animate-slide-up {
                    animation: slide-up 0.5s ease-out;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .hover\:animate-float-hover:hover {
                    animation: float 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default AssignPermissionPage;