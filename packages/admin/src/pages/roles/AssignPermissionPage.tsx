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
    // Lấy danh sách Vai trò cho dropdown (chỉ cần trang 1, lấy nhiều)
    const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({ page: 1, limit: 100 });

    // Lấy chi tiết Vai trò đang chọn (để biết quyền hiện tại)
    const { data: selectedRoleData, isLoading: isLoadingRoleDetail, isFetching: isFetchingRoleDetail } = useGetRoleByIdQuery(selectedRoleId!, {
        skip: !selectedRoleId, // Chỉ fetch khi có selectedRoleId
    });

    // Lấy tất cả quyền hạn (đã gom nhóm)
    const { data: groupedPermissions, isLoading: isLoadingPermissions, error: permissionsError } = useGetAllPermissionsQuery();

    // Mutation gán quyền
    const [assignPermissions, { isLoading: isAssigning }] = useAssignPermissionsMutation();


    // --- Effects ---
    // Cập nhật selectedPermissions khi vai trò được chọn thay đổi và có dữ liệu chi tiết
    useEffect(() => {
        if (selectedRoleData) {
            const currentPermissionIds = selectedRoleData.vai_tro_quyen.map(p => p.quyen_id);
            setSelectedPermissions(currentPermissionIds);
        } else {
            setSelectedPermissions([]); // Reset khi không có vai trò nào được chọn
        }
    }, [selectedRoleData]);

    // --- Handlers ---
    const handleRoleChange = (value: number | undefined) => {
        setSelectedRoleId(value);
    };

    // Xử lý khi check/uncheck một quyền
    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        setSelectedPermissions(prev =>
            checked ? [...prev, permissionId] : prev.filter(id => id !== permissionId)
        );
    };

    // Xử lý khi check/uncheck "Chọn tất cả" cho một nhóm
    const handleSelectAllGroup = (groupPermissions: Permission[], checked: boolean) => {
        const groupPermissionIds = groupPermissions.map(p => p.id);
        setSelectedPermissions(prev => {
            if (checked) {
                // Thêm tất cả ID của nhóm vào, tránh trùng lặp
                return [...new Set([...prev, ...groupPermissionIds])];
            } else {
                // Loại bỏ tất cả ID của nhóm khỏi danh sách
                return prev.filter(id => !groupPermissionIds.includes(id));
            }
        });
    };

    // Xử lý khi nhấn nút "Áp dụng"
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
    // Kiểm tra xem tất cả quyền trong nhóm có được chọn không
    const isGroupSelectedAll = (groupPermissions: Permission[]): boolean => {
        if (!groupPermissions || groupPermissions.length === 0) return false;
        return groupPermissions.every(p => selectedPermissions.includes(p.id));
    };

    // Kiểm tra xem có quyền nào trong nhóm được chọn không (nhưng không phải tất cả)
    const isGroupIndeterminate = (groupPermissions: Permission[]): boolean => {
        if (!groupPermissions || groupPermissions.length === 0) return false;
        const groupSelectedCount = groupPermissions.filter(p => selectedPermissions.includes(p.id)).length;
        return groupSelectedCount > 0 && groupSelectedCount < groupPermissions.length;
    };

    // --- Render ---
    const isLoading = isLoadingRoles || isLoadingPermissions || isFetchingRoleDetail;

    return (
        <div>
            <Title level={2} className="mb-4">Phân quyền vào vai trò</Title>

            <Row gutter={16} align="middle" className="mb-4">
                <Col>
                    <Text strong>Chọn vai trò:</Text>
                </Col>
                <Col flex="auto">
                    <Select<number>
                        placeholder="Chọn vai trò để phân quyền"
                        style={{ width: '100%', maxWidth: 300 }}
                        loading={isLoadingRoles}
                        value={selectedRoleId}
                        onChange={handleRoleChange}
                        allowClear
                        // Lọc bỏ vai trò Super Admin vì không cần phân quyền
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
                        disabled={!selectedRoleId || isLoading} // Disable nếu chưa chọn role hoặc đang tải
                    >
                        Áp dụng
                    </Button>
                </Col>
            </Row>

            <Divider />

            <Title level={4} className="mb-4">Quản lý phân quyền</Title>

            {isLoading && <Spin size="large" className="flex justify-center my-8" />}

            {permissionsError && <Alert message="Lỗi tải danh sách quyền" description="Không thể tải danh sách quyền hạn từ server." type="error" showIcon />}

            {!isLoading && !permissionsError && !selectedRoleId && (
                <Alert message="Vui lòng chọn một vai trò để xem và chỉnh sửa quyền hạn." type="info" showIcon />
            )}

            {!isLoading && !permissionsError && selectedRoleId && groupedPermissions && (
                <Row gutter={[16, 24]}>
                    {Object.entries(groupedPermissions).map(([groupName, permissions]) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={groupName}>
                            <Card size="small" title={groupName} className="h-full">
                                <Checkbox
                                    indeterminate={isGroupIndeterminate(permissions)}
                                    checked={isGroupSelectedAll(permissions)}
                                    onChange={(e) => handleSelectAllGroup(permissions, e.target.checked)}
                                    className="mb-2 font-semibold"
                                >
                                    Chọn tất cả
                                </Checkbox>
                                <Divider className="my-2" />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {permissions.map(permission => (
                                        <Checkbox
                                            key={permission.id}
                                            checked={selectedPermissions.includes(permission.id)}
                                            onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                        >
                                            {permission.ten_chuc_nang}
                                        </Checkbox>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

        </div>
    );
};

export default AssignPermissionPage;