import prisma from '../models';
import { Prisma } from '@prisma/client';

/**
 * Lấy danh sách vai trò với phân trang và tìm kiếm
 */
export const getRoles = async (search: string, page: number, pageSize: number) => {
    const where: Prisma.vai_troWhereInput = {
        ten_vai_tro: { contains: search },
    };

    const [roles, total] = await prisma.$transaction([
        prisma.vai_tro.findMany({
            where,
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.vai_tro.count({ where }),
    ]);

    return { data: roles, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

/**
 * Lấy thông tin chi tiết một vai trò, bao gồm các quyền đã được gán
 */
export const getRoleById = async (id: number) => {
    const role = await prisma.vai_tro.findUnique({
        where: { id },
        include: {
            vai_tro_quyen: { // Lấy các quyền liên quan
                select: {
                    quyen_id: true,
                },
            },
        },
    });
    if (!role) throw new Error('Vai trò không tồn tại.');
    return role;
};

/**
 * Tạo vai trò mới
 */
export const createRole = async (data: { name: string, description?: string }) => {
    return prisma.vai_tro.create({
        data: {
            ten_vai_tro: data.name,
            mo_ta: data.description,
        },
    });
};

/**
 * Cập nhật vai trò
 */
export const updateRole = async (id: number, data: { name: string, description?: string }) => {
    // Ngăn chặn việc sửa vai trò đặc biệt
    const role = await prisma.vai_tro.findUnique({ where: { id } });
    if (role?.ten_vai_tro === 'Chưa phân loại' || role?.ten_vai_tro === 'Super Admin') {
        throw new Error(`Không thể chỉnh sửa vai trò "${role.ten_vai_tro}".`);
    }

    return prisma.vai_tro.update({
        where: { id },
        data: {
            ten_vai_tro: data.name,
            mo_ta: data.description,
        },
    });
};

/**
 * Xóa một vai trò và chuyển người dùng sang vai trò mặc định
 */
export const deleteRole = async (id: number) => {
    return prisma.$transaction(async (tx) => {
        // 1. Kiểm tra vai trò sắp xóa có phải là vai trò đặc biệt không
        const roleToDelete = await tx.vai_tro.findUnique({ where: { id } });
        if (!roleToDelete || roleToDelete.ten_vai_tro === 'Chưa phân loại' || roleToDelete.ten_vai_tro === 'Super Admin') {
            throw new Error('Không thể xóa vai trò này.');
        }

        // 2. Tìm ID của vai trò mặc định "Chưa phân loại"
        const defaultRole = await tx.vai_tro.findFirst({ where: { ten_vai_tro: 'Chưa phân loại' } });
        if (!defaultRole) {
            throw new Error('Không tìm thấy vai trò mặc định "Chưa phân loại". Vui lòng tạo trước.');
        }

        // 3. Cập nhật tất cả người dùng đang có vai trò sắp xóa sang vai trò mặc định
        await tx.nguoi_dung.updateMany({
            where: { vai_tro_id: id },
            data: { vai_tro_id: defaultRole.id },
        });

        // 4. Xóa vai trò
        return tx.vai_tro.delete({ where: { id } });
    });
};

/**
 * Gán (đồng bộ) quyền cho vai trò.
 * Xóa hết quyền cũ và thêm lại quyền mới.
 */
export const assignPermissionsToRole = async (roleId: number, permissionIds: number[]) => {
    return prisma.$transaction(async (tx) => {
        // 1. Xóa tất cả các quyền hiện có của vai trò này
        await tx.vai_tro_quyen.deleteMany({
            where: { vai_tro_id: roleId },
        });

        // 2. Thêm các quyền mới
        if (permissionIds.length > 0) {
            await tx.vai_tro_quyen.createMany({
                data: permissionIds.map(pid => ({
                    vai_tro_id: roleId,
                    quyen_id: pid,
                })),
            });
        }
    });
};
