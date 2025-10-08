import prisma from '../models';

/**
 * Lấy tất cả các quyền hạn có sẵn trong hệ thống.
 * Dữ liệu được nhóm theo 'ten_nhom_quyen' để dễ hiển thị trên UI.
 */
export const getAllPermissions = async () => {
    const permissions = await prisma.quyen.findMany({
        orderBy: {
            ten_nhom_quyen: 'asc',
        },
    });

    // Nhóm các quyền lại theo ten_nhom_quyen
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const groupName = permission.ten_nhom_quyen || 'Khác';
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(permission);
        return acc;
    }, {} as Record<string, typeof permissions>);

    return groupedPermissions;
};
