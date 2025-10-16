import prisma from '../models';
import { Prisma } from '@prisma/client';

/**
 * 📋 Lấy danh sách vai trò (Role) có phân trang và tìm kiếm
 */
export const getRoles = async (search: string, page: number, pageSize: number) => {
    // 🔍 Điều kiện tìm kiếm theo tên vai trò
    const where: Prisma.vai_troWhereInput = {
        ten_vai_tro: { contains: search },
    };

    // ⚡ Dùng transaction để lấy song song: danh sách + tổng số lượng
    const [roles, total] = await prisma.$transaction([
        prisma.vai_tro.findMany({
            where,
            orderBy: { id: 'desc' }, // ⬇️ Sắp xếp theo ID giảm dần (mới nhất trước)
            skip: (page - 1) * pageSize, // ⏭️ Bỏ qua số bản ghi tương ứng trang
            take: pageSize,              // 📦 Giới hạn số bản ghi mỗi trang
        }),
        prisma.vai_tro.count({ where }), // 🔢 Đếm tổng số vai trò khớp điều kiện
    ]);

    // 📤 Trả về dữ liệu kèm thông tin phân trang
    return { data: roles, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

/**
 * 🔍 Lấy chi tiết một vai trò, bao gồm các quyền được gán
 */
export const getRoleById = async (id: number) => {
    const role = await prisma.vai_tro.findUnique({
        where: { id },
        include: {
            vai_tro_quyen: { // 🔗 Lấy danh sách quyền của vai trò
                select: { quyen_id: true },
            },
        },
    });

    if (!role) throw new Error('Vai trò không tồn tại.');
    return role;
};

/**
 * ✨ Tạo vai trò mới
 */
export const createRole = async (data: { name: string, description?: string }) => {
    return prisma.vai_tro.create({
        data: {
            ten_vai_tro: data.name,     // 🏷️ Tên vai trò
            mo_ta: data.description,    // 📝 Mô tả vai trò (nếu có)
        },
    });
};

/**
 * 🛠️ Cập nhật thông tin vai trò
 */
export const updateRole = async (id: number, data: { name: string, description?: string }) => {
    // ⚠️ Không cho sửa 2 vai trò đặc biệt
    const role = await prisma.vai_tro.findUnique({ where: { id } });
    if (role?.ten_vai_tro === 'Chưa phân loại' || role?.ten_vai_tro === 'Super Admin') {
        throw new Error(`Không thể chỉnh sửa vai trò "${role.ten_vai_tro}".`);
    }

    // 💾 Cập nhật tên và mô tả
    return prisma.vai_tro.update({
        where: { id },
        data: {
            ten_vai_tro: data.name,
            mo_ta: data.description,
        },
    });
};

/**
 * ❌ Xóa vai trò (và chuyển người dùng sang vai trò mặc định)
 */
export const deleteRole = async (id: number) => {
    return prisma.$transaction(async (tx) => {
        // 🧱 1. Kiểm tra vai trò có hợp lệ để xóa không
        const roleToDelete = await tx.vai_tro.findUnique({ where: { id } });
        if (!roleToDelete || roleToDelete.ten_vai_tro === 'Chưa phân loại' || roleToDelete.ten_vai_tro === 'Super Admin') {
            throw new Error('Không thể xóa vai trò này.');
        }

        // 🔎 2. Tìm vai trò mặc định “Chưa phân loại”
        const defaultRole = await tx.vai_tro.findFirst({ where: { ten_vai_tro: 'Chưa phân loại' } });
        if (!defaultRole) {
            throw new Error('Không tìm thấy vai trò mặc định "Chưa phân loại". Vui lòng tạo trước.');
        }

        // 👥 3. Cập nhật người dùng thuộc vai trò bị xóa -> sang vai trò mặc định
        await tx.nguoi_dung.updateMany({
            where: { vai_tro_id: id },
            data: { vai_tro_id: defaultRole.id },
        });

        // 🗑️ 4. Xóa vai trò
        return tx.vai_tro.delete({ where: { id } });
    });
};

/**
 * 🔗 Gán quyền (permissions) cho vai trò
 * 🧹 Xóa quyền cũ -> thêm quyền mới
 */
export const assignPermissionsToRole = async (roleId: number, permissionIds: number[]) => {
    return prisma.$transaction(async (tx) => {
        // 🧽 1. Xóa toàn bộ quyền hiện tại của vai trò
        await tx.vai_tro_quyen.deleteMany({
            where: { vai_tro_id: roleId },
        });

        // ➕ 2. Thêm lại các quyền mới nếu có
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
