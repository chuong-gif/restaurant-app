import prisma from '../models';

/**
 * Lấy tất cả các quyền hạn có sẵn trong hệ thống.
 * Dữ liệu được nhóm theo 'ten_nhom_quyen' để dễ hiển thị trên UI.
 */
export const getAllPermissions = async () => {
    // Lấy toàn bộ danh sách quyền từ bảng 'quyen', sắp xếp theo tên nhóm quyền
    const permissions = await prisma.quyen.findMany({
        orderBy: {
            ten_nhom_quyen: 'asc',
        },
    });

    // Duyệt qua danh sách quyền và gom nhóm lại theo 'ten_nhom_quyen'
    const groupedPermissions = permissions.reduce((acc, permission) => {
        // Nếu quyền không có nhóm, gán mặc định là 'Khác'
        const groupName = permission.ten_nhom_quyen || 'Khác';

        // Nếu nhóm chưa tồn tại trong accumulator → tạo mới mảng rỗng
        if (!acc[groupName]) {
            acc[groupName] = [];
        }

        // Thêm quyền hiện tại vào nhóm tương ứng
        acc[groupName].push(permission);

        return acc;
    }, {} as Record<string, typeof permissions>); // Kiểu dữ liệu của acc là một object có key là tên nhóm và value là mảng quyền

    // Trả về danh sách quyền đã được nhóm
    return groupedPermissions;
};
