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
    const whereCondition: Prisma.san_phamWhereInput = {
        ten_san_pham: {
            contains: searchName,
        },
    };
    if (danh_muc_id) {
        whereCondition.danh_muc_id = danh_muc_id;
    }
    if (trang_thai !== undefined) {
        whereCondition.trang_thai = trang_thai;
    }

    const [products, totalCount] = await prisma.$transaction([
        prisma.san_pham.findMany({
            where: whereCondition,
            orderBy: { id: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                danh_muc_san_pham: true,
                media_files: true,
            },
        }),
        prisma.san_pham.count({ where: whereCondition }),
    ]);

    return {
        data: products,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: page,
    };
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
        },
    });

    if (!product) {
        throw new Error('Sản phẩm không tồn tại');
    }
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
    const newProduct = await prisma.san_pham.create({
        data: {
            ma_san_pham: productData.ma_san_pham || `HS-${Date.now().toString().slice(-6)}`,
            ten_san_pham: productData.ten_san_pham,
            gia_ban: parseInt(productData.gia_ban, 10),
            mo_ta: productData.mo_ta,
            danh_muc_id: parseInt(productData.danh_muc_id, 10),
            gia_khuyen_mai: productData.gia_khuyen_mai ? parseInt(productData.gia_khuyen_mai, 10) : 0,
            trang_thai: productData.trang_thai,
            hinh_anh_id: productData.hinh_anh_id ? parseInt(productData.hinh_anh_id, 10) : null,
        }
    });
    return newProduct;
};

/*
=====================================================
 ✏️ SERVICE: CẬP NHẬT SẢN PHẨM (SỬA LỖI 1)
=====================================================
*/
export const updateProduct = async (id: number, productData: any) => {
    const existing = await prisma.san_pham.findUnique({ where: { id } });
    if (!existing) {
        throw new Error('Sản phẩm không tồn tại');
    }

    // --- SỬA LỖI: Tạo đối tượng data linh hoạt ---
    // Điều này cho phép chúng ta chỉ gửi 1 trường (ví dụ: trang_thai) mà không làm hỏng các trường khác
    const dataToUpdate: Prisma.san_phamUpdateInput = {};

    if (productData.ten_san_pham !== undefined) {
        dataToUpdate.ten_san_pham = productData.ten_san_pham;
    }
    if (productData.gia_ban !== undefined) {
        dataToUpdate.gia_ban = parseInt(productData.gia_ban, 10);
    }
    if (productData.gia_khuyen_mai !== undefined) {
        dataToUpdate.gia_khuyen_mai = parseInt(productData.gia_khuyen_mai, 10);
    }
    if (productData.danh_muc_id !== undefined) {
        // Prisma's generated UpdateInput may not expose the scalar FK field directly on the type,
        // so cast to any to assign the parsed value without a type error.
        (dataToUpdate as any).danh_muc_id = parseInt(productData.danh_muc_id, 10);
    }
    if (productData.mo_ta !== undefined) {
        dataToUpdate.mo_ta = productData.mo_ta;
    }
    if (productData.trang_thai !== undefined) {
        dataToUpdate.trang_thai = productData.trang_thai;
    }
    if (productData.hinh_anh_id !== undefined) {
        (dataToUpdate as any).hinh_anh_id = productData.hinh_anh_id ? parseInt(productData.hinh_anh_id, 10) : null;
    }
    // --- KẾT THÚC SỬA LỖI ---

    const updatedProduct = await prisma.san_pham.update({
        where: { id },
        data: dataToUpdate, // Sử dụng đối tượng data linh hoạt
    });

    return updatedProduct;
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