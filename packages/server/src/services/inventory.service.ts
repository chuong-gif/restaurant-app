// packages/server/src/services/inventory.service.ts
import prisma from '../models';
import { Prisma } from '@prisma/client';

// ================= NHÀ CUNG CẤP (SUPPLIERS) =================

export const getSuppliers = async (filters: any) => {
    const { page, pageSize, searchName, status } = filters;
    const where: Prisma.nha_cung_capWhereInput = {
        ten_nha_cung_cap: { contains: searchName },
    };

    // Lọc theo trạng thái (nếu có)
    if (status !== undefined && status !== null && status !== '') {
        where.trang_thai = status === 'true' || status === true;
    }

    const [suppliers, total] = await prisma.$transaction([
        prisma.nha_cung_cap.findMany({
            where,
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.nha_cung_cap.count({ where }),
    ]);

    return { data: suppliers, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

export const createSupplier = async (data: any) => {
    return prisma.nha_cung_cap.create({
        data: {
            ten_nha_cung_cap: data.name,
            so_dien_thoai: data.phone || null,
            email: data.email || null,
            dia_chi: data.address || null,
            ghi_chu: data.note || null,
            trang_thai: true,
        }
    });
};

export const updateSupplier = async (id: number, data: any) => {
    return prisma.nha_cung_cap.update({
        where: { id },
        data: {
            ten_nha_cung_cap: data.name,
            so_dien_thoai: data.phone,
            email: data.email,
            dia_chi: data.address,
            ghi_chu: data.note,
            trang_thai: data.status !== undefined ? Boolean(data.status) : undefined,
        }
    });
};

export const deleteSupplier = async (id: number) => {
    // Kiểm tra xem nhà cung cấp đã có phiếu nhập chưa
    const hasImports = await prisma.phieu_nhap.findFirst({
        where: { nha_cung_cap_id: id }
    });

    if (hasImports) {
        throw new Error('Không thể xóa nhà cung cấp đã có lịch sử nhập hàng. Hãy tắt trạng thái hoạt động thay vì xóa.');
    }

    return prisma.nha_cung_cap.delete({ where: { id } });
};

// ================= NGUYÊN LIỆU (MATERIALS) =================

export const getMaterials = async (filters: any) => {
    const { page, pageSize, searchName, status } = filters;
    const where: Prisma.nguyen_lieuWhereInput = {
        ten_nguyen_lieu: { contains: searchName },
    };

    if (status !== undefined && status !== null && status !== '') {
        where.trang_thai = status === 'true' || status === true;
    }

    const [materials, total] = await prisma.$transaction([
        prisma.nguyen_lieu.findMany({
            where,
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.nguyen_lieu.count({ where }),
    ]);

    return { data: materials, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

export const createMaterial = async (data: any) => {
    // Kiểm tra trùng tên
    const exists = await prisma.nguyen_lieu.findFirst({
        where: { ten_nguyen_lieu: data.name }
    });
    if (exists) throw new Error('Tên nguyên liệu đã tồn tại.');

    return prisma.nguyen_lieu.create({
        data: {
            ten_nguyen_lieu: data.name,
            don_vi_tinh: data.unit, // kg, g, lit, chai...
            so_luong_ton: 0, // Mới tạo thì tồn = 0
            muc_canh_bao: data.warning_limit ? parseFloat(data.warning_limit) : 0,
            ghi_chu: data.note || null,
            trang_thai: true,
        }
    });
};

export const updateMaterial = async (id: number, data: any) => {
    return prisma.nguyen_lieu.update({
        where: { id },
        data: {
            ten_nguyen_lieu: data.name,
            don_vi_tinh: data.unit,
            muc_canh_bao: data.warning_limit !== undefined ? parseFloat(data.warning_limit) : undefined,
            ghi_chu: data.note,
            trang_thai: data.status !== undefined ? Boolean(data.status) : undefined,
        }
    });
};

export const deleteMaterial = async (id: number) => {
    // 1. Kiểm tra trong phiếu nhập
    const inImport = await prisma.chi_tiet_phieu_nhap.findFirst({ where: { nguyen_lieu_id: id } });
    if (inImport) throw new Error('Nguyên liệu đã từng được nhập kho, không thể xóa.');

    // 2. Kiểm tra trong công thức món ăn
    const inRecipe = await prisma.cong_thuc.findFirst({ where: { nguyen_lieu_id: id } });
    if (inRecipe) throw new Error('Nguyên liệu đang được sử dụng trong công thức món ăn.');

    return prisma.nguyen_lieu.delete({ where: { id } });
};

// ================= NHẬP KHO (IMPORT) =================

export const createImportReceipt = async (data: any, userId: number) => {
    const { supplier_id, note, details } = data; // details: [{ material_id, quantity, price }]

    // Validate
    if (!details || details.length === 0) throw new Error('Phiếu nhập phải có ít nhất một nguyên liệu.');

    return prisma.$transaction(async (tx) => {
        // 1. Tạo Phiếu nhập (Header)
        const receipt = await tx.phieu_nhap.create({
            data: {
                ma_phieu: `PN-${Date.now()}`,
                nha_cung_cap_id: parseInt(supplier_id),
                nguoi_nhap_id: userId,
                ghi_chu: note,
                tong_tien: details.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0),
                ngay_nhap: new Date(),
            }
        });

        // 2. Tạo Chi tiết & Cập nhật kho (Loop)
        for (const item of details) {
            // Lưu chi tiết phiếu
            await tx.chi_tiet_phieu_nhap.create({
                data: {
                    phieu_nhap_id: receipt.id,
                    nguyen_lieu_id: item.material_id,
                    so_luong: parseFloat(item.quantity),
                    don_gia: parseInt(item.price),
                    thanh_tien: parseFloat(item.quantity) * parseInt(item.price)
                }
            });

            // CẬP NHẬT KHO: Cộng số lượng + Cập nhật giá nhập mới nhất
            await tx.nguyen_lieu.update({
                where: { id: item.material_id },
                data: {
                    so_luong_ton: { increment: parseFloat(item.quantity) },
                    gia_nhap_cuoi: parseInt(item.price) // Cập nhật giá để tính cost sau này
                }
            });
        }

        return receipt;
    });
};