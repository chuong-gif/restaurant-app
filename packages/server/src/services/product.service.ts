// packages/server/src/services/product.service.ts
import prisma from '../models';
import { Prisma } from '@prisma/client';

/* ===================================================================
 🧭 SERVICE: LẤY DANH SÁCH SẢN PHẨM (ĐÃ SỬA: Thêm lọc danh mục)
===================================================================
*/
export const getProducts = async (
    searchName: string = '',     // 🔍 Từ khóa tìm kiếm
    page: number = 1,            // 📄 Số trang
    pageSize: number = 10,       // 📦 Số lượng mỗi trang
    danh_muc_id?: number,    // 🏷️ LỌC THEO DANH MỤC (THÊM MỚI)
    trang_thai?: boolean         // ⚙️ LỌC THEO TRẠNG THÁI (THÊM MỚI)
) => {
    // 🧩 Tạo điều kiện tìm kiếm
    const whereCondition: Prisma.san_phamWhereInput = {
        ten_san_pham: {
            contains: searchName,
        },
    };

    // 🟢 Thêm điều kiện lọc DANH MỤC
    if (danh_muc_id) {
        whereCondition.danh_muc_id = danh_muc_id;
    }

    // 🟢 Thêm điều kiện lọc TRẠNG THÁI
    if (trang_thai !== undefined) {
        whereCondition.trang_thai = trang_thai;
    }

    // ⚡ Thực hiện 2 truy vấn song song
    const [products, totalCount] = await prisma.$transaction([
        prisma.san_pham.findMany({
            where: whereCondition,
            orderBy: {
                id: 'desc',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                danh_muc_san_pham: true, // Join thêm danh mục
                media_files: true,       // Join thêm ảnh
            },
        }),
        prisma.san_pham.count({ where: whereCondition }), // Đếm tổng số
    ]);

    // 📤 Trả về
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
        where: {
            trang_thai: true,
        },
        orderBy: {
            created_at: 'desc',
        },
        take: limit,
        include: {
            media_files: true,
        },
    });
};

/*
===================================================
 ➕ SERVICE: TẠO MỚI SẢN PHẨM (ĐÃ SỬA: Thêm trường)
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
            // === CÁC TRƯỜNG BỔ SUNG ===
            gia_khuyen_mai: productData.gia_khuyen_mai ? parseInt(productData.gia_khuyen_mai, 10) : 0,
            trang_thai: productData.trang_thai, // Gửi trực tiếp (true/false)
            hinh_anh_id: productData.hinh_anh_id ? parseInt(productData.hinh_anh_id, 10) : null,
        }
    });
    return newProduct;
};

/*
=====================================================
 ✏️ SERVICE: CẬP NHẬT SẢN PHẨM (ĐÃ SỬA: Thêm trường)
=====================================================
*/
export const updateProduct = async (id: number, productData: any) => {
    const existing = await prisma.san_pham.findUnique({ where: { id } });
    if (!existing) {
        throw new Error('Sản phẩm không tồn tại');
    }

    const updatedProduct = await prisma.san_pham.update({
        where: { id },
        data: {
            ten_san_pham: productData.ten_san_pham,
            gia_ban: parseInt(productData.gia_ban, 10),
            gia_khuyen_mai: productData.gia_khuyen_mai ? parseInt(productData.gia_khuyen_mai, 10) : 0,
            danh_muc_id: parseInt(productData.danh_muc_id, 10),
            mo_ta: productData.mo_ta,
            trang_thai: productData.trang_thai, // Gửi trực tiếp (true/false)
            // === TRƯỜNG BỔ SUNG ===
            hinh_anh_id: productData.hinh_anh_id ? parseInt(productData.hinh_anh_id, 10) : null,
        },
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

    // Xóa mềm
    const deletedProduct = await prisma.san_pham.update({
        where: { id },
        data: {
            trang_thai: false, // Ngưng hoạt động
        },
    });

    return deletedProduct;
};