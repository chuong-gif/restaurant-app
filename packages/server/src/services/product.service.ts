// packages/server/src/services/product.service.ts
import prisma from '../models';
import { Prisma } from '@prisma/client';

/* ===================================================================
 🧭 SERVICE: LẤY DANH SÁCH SẢN PHẨM
===================================================================
*/
export const getProducts = async (
    searchName: string = '',
    page: number = 1,
    pageSize: number = 10,
    danh_muc_id?: number,
    trang_thai?: boolean
) => {
    const whereCondition: Prisma.san_phamWhereInput = {};
    if (searchName) whereCondition.ten_san_pham = { contains: searchName };
    if (danh_muc_id) whereCondition.danh_muc_id = danh_muc_id;
    if (trang_thai !== undefined) whereCondition.trang_thai = trang_thai;

    const [products, totalCount] = await prisma.$transaction([
        prisma.san_pham.findMany({
            where: whereCondition,
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                danh_muc_san_pham: true,
                media_files: true,
                // Không cần include công thức ở danh sách cho nhẹ
            },
        }),
        prisma.san_pham.count({ where: whereCondition }),
    ]);

    return { data: products, total: totalCount, totalPages: Math.ceil(totalCount / pageSize), currentPage: page };
};

/* ===============================
 🆔 SERVICE: LẤY 1 SẢN PHẨM
===============================
*/
export const getProductById = async (id: number) => {
    const product = await prisma.san_pham.findUnique({
        where: { id },
        include: {
            danh_muc_san_pham: true,
            media_files: true,
            // === INCLUDE CÔNG THỨC ===
            cong_thuc: {
                include: {
                    nguyen_lieu: { select: { ten_nguyen_lieu: true, don_vi_tinh: true } }
                }
            }
        },
    });
    if (!product) throw new Error('Sản phẩm không tồn tại');
    return product;
};

/* ===========================================
 🆕 SERVICE: LẤY DANH SÁCH SẢN PHẨM MỚI NHẤT
===========================================
*/
export const getNewestProducts = async (limit: number = 8) => {
    return await prisma.san_pham.findMany({
        where: { trang_thai: true },
        orderBy: { created_at: 'desc' },
        take: limit,
        include: { media_files: true },
    });
};

/*
===================================================
 ➕ SERVICE: TẠO MỚI SẢN PHẨM
===================================================
*/
export const createProduct = async (productData: any) => {
    const { cong_thuc, ...data } = productData; // Tách công thức ra

    // Tạo sản phẩm
    const newProduct = await prisma.san_pham.create({
        data: {
            ma_san_pham: data.ma_san_pham || `HS-${Date.now().toString().slice(-6)}`,
            ten_san_pham: data.ten_san_pham,
            gia_ban: parseInt(data.gia_ban, 10),
            mo_ta: data.mo_ta,
            danh_muc_id: parseInt(data.danh_muc_id, 10),
            gia_khuyen_mai: data.gia_khuyen_mai ? parseInt(data.gia_khuyen_mai, 10) : 0,
            trang_thai: data.trang_thai,
            hinh_anh_id: data.hinh_anh_id ? parseInt(data.hinh_anh_id, 10) : null,
        }
    });

    // Nếu có công thức -> Lưu vào bảng cong_thuc
    if (cong_thuc && Array.isArray(cong_thuc) && cong_thuc.length > 0) {
        await prisma.cong_thuc.createMany({
            data: cong_thuc.map((ct: any) => ({
                san_pham_id: newProduct.id,
                nguyen_lieu_id: ct.nguyen_lieu_id,
                so_luong_can: parseFloat(ct.so_luong_can),
                don_vi_tinh: ct.don_vi_tinh // Đơn vị dùng trong công thức (VD: gram)
            }))
        });
    }

    return newProduct;
};

/*
=====================================================
 ✏️ SERVICE: CẬP NHẬT SẢN PHẨM (SỬA LỖI 1)
=====================================================
*/
export const updateProduct = async (id: number, productData: any) => {
    const { cong_thuc, ...data } = productData;

    const existing = await prisma.san_pham.findUnique({ where: { id } });
    if (!existing) throw new Error('Sản phẩm không tồn tại');

    // Cập nhật thông tin cơ bản (Logic cũ)
    const dataToUpdate: Prisma.san_phamUpdateInput = {};
    if (data.ten_san_pham !== undefined) dataToUpdate.ten_san_pham = data.ten_san_pham;
    if (data.gia_ban !== undefined) dataToUpdate.gia_ban = parseInt(data.gia_ban, 10);
    if (data.gia_khuyen_mai !== undefined) dataToUpdate.gia_khuyen_mai = parseInt(data.gia_khuyen_mai, 10);
    if (data.danh_muc_id !== undefined) (dataToUpdate as any).danh_muc_id = parseInt(data.danh_muc_id, 10);
    if (data.mo_ta !== undefined) dataToUpdate.mo_ta = data.mo_ta;
    if (data.trang_thai !== undefined) dataToUpdate.trang_thai = data.trang_thai;
    if (data.hinh_anh_id !== undefined) (dataToUpdate as any).hinh_anh_id = data.hinh_anh_id ? parseInt(data.hinh_anh_id, 10) : null;

    // Dùng transaction để đảm bảo toàn vẹn dữ liệu
    await prisma.$transaction(async (tx) => {
        // 1. Update sản phẩm
        await tx.san_pham.update({ where: { id }, data: dataToUpdate });

        // 2. Update công thức (Xóa cũ -> Thêm mới)
        if (cong_thuc !== undefined) { // Chỉ update nếu frontend có gửi trường cong_thuc lên
            // Xóa hết công thức cũ
            await tx.cong_thuc.deleteMany({ where: { san_pham_id: id } });

            // Thêm lại công thức mới
            if (Array.isArray(cong_thuc) && cong_thuc.length > 0) {
                await tx.cong_thuc.createMany({
                    data: cong_thuc.map((ct: any) => ({
                        san_pham_id: id,
                        nguyen_lieu_id: ct.nguyen_lieu_id,
                        so_luong_can: parseFloat(ct.so_luong_can),
                        don_vi_tinh: ct.don_vi_tinh
                    }))
                });
            }
        }
    });

    return { id, message: "Success" };
};

/*
=================================
 🗑️ SERVICE: XÓA (MỀM) SẢN PHẨM
=================================
*/
export const deleteProduct = async (id: number) => {
    const existing = await prisma.san_pham.findUnique({ where: { id } });
    if (!existing) {
        throw new Error('Sản phẩm không tồn tại');
    }
    const deletedProduct = await prisma.san_pham.update({
        where: { id },
        data: { trang_thai: false },
    });
    return deletedProduct;
};

/*
========================================
 🗑️ SERVICE: XÓA VĨNH VIỄN SP (SỬA LỖI 2)
========================================
*/
export const permanentlyDeleteProduct = async (id: number) => {
    const existing = await prisma.san_pham.findUnique({ where: { id } });
    if (!existing) {
        throw new Error('Sản phẩm không tồn tại');
    }
    // Lưu ý: Lô-gic này chưa xóa ảnh trên Firebase, chỉ xóa record trong CSDL.
    return prisma.san_pham.delete({
        where: { id },
    });
};


