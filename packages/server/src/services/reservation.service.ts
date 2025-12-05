// packages/server/src/services/reservation.service.ts
import prisma from '../models';
import { Prisma } from '@prisma/client';

// Định nghĩa mã trạng thái để dễ quản lý
export const ReservationStatus = {
    CANCELLED: 0,
    PENDING_CONFIRMATION: 1, // Chờ xác nhận / Chờ cọc
    CONFIRMED_DEPOSIT_PAID: 2, // Đã xác nhận / Đã cọc
    CHECKED_IN: 3, // Khách đang ăn
    PENDING_PAYMENT: 4, // Chờ thanh toán đủ
    COMPLETED: 5,
    NO_SHOW: 6,
} as const;



/**
 * ✅ [Helper] Kiểm tra một (hoặc nhiều) bàn cụ thể có trống không
 * (ĐÃ SỬA: Chấp nhận mảng IDs)
 */
const checkTablesAvailability = async (tableIds: number[], reservationDate: Date, partySize: number) => {
    const tables = await prisma.ban_an.findMany({
        where: { id: { in: tableIds } }
    });

    if (tables.length !== tableIds.length) {
        throw new Error('Một số bàn được chọn không tồn tại.');
    }

    let totalCapacity = 0;
    for (const table of tables) {
        if (!table.trang_thai) {
            throw new Error(`Bàn ${table.so_ban} hiện không khả dụng (đang bảo trì).`);
        }
        totalCapacity += table.suc_chua;
    }

    // Kiểm tra tổng sức chứa
    if (totalCapacity < partySize) {
        throw new Error(`Tổng sức chứa của các bàn đã chọn (${totalCapacity}) không đủ cho số lượng khách (${partySize}).`);
    }

    // Kiểm tra giờ
    const startTime = new Date(reservationDate.getTime() - 2 * 60 * 60 * 1000);
    const endTime = new Date(reservationDate.getTime() + 2 * 60 * 60 * 1000);

    const conflictingReservation = await prisma.dat_ban.findFirst({
        where: {
            ngay_dat_ban: { gte: startTime, lte: endTime },
            trang_thai: { notIn: [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED] },
            ban_an: { // Kiểm tra quan hệ N-N
                some: {
                    id: { in: tableIds }
                }
            }
        },
        include: { ban_an: { select: { so_ban: true } } }
    });

    if (conflictingReservation) {
        const bookedTables = conflictingReservation.ban_an.map(b => b.so_ban).join(', ');
        throw new Error(`Rất tiếc, bàn số ${bookedTables} đã được đặt trong khung giờ này.`);
    }

    return true; // Bàn hợp lệ
};


/**
 * 🧾 Tạo mới một đơn đặt bàn (ĐÃ SỬA: Hỗ trợ mảng ban_an_ids)
 */
export const createReservation = async (data: any) => {
    // === SỬA DÒNG NÀY (Thêm 'status' vào destructuring để tách nó ra khỏi reservationData) ===
    const { products, ban_an_ids, fullname, tel, reservation_date, party_size, note, user_id, status, promo_code, ...reservationData } = data;

    const partySizeNum = parseInt(party_size, 10);
    const reservationDateObj = new Date(reservation_date);

    if (isNaN(partySizeNum) || partySizeNum <= 0) {
        throw new Error('Số lượng khách không hợp lệ.');
    }
    if (isNaN(reservationDateObj.getTime())) {
        throw new Error('Ngày đặt bàn không hợp lệ.');
    }

    // Yêu cầu client PHẢI gửi lên mảng ban_an_ids
    if (!ban_an_ids || !Array.isArray(ban_an_ids) || ban_an_ids.length === 0) {
        throw new Error('Vui lòng chọn ít nhất một bàn ăn.');
    }

    // Tính tiền (giữ nguyên logic cũ)
    let initialTotalAmount = 0;
    if (products && Array.isArray(products) && products.length > 0) {
        const productIds = products.map((p: any) => p.product_id);
        const dbProducts = await prisma.san_pham.findMany({
            where: { id: { in: productIds } },
            select: { id: true, gia_ban: true, gia_khuyen_mai: true },
        });
        const productPriceMap = new Map(
            dbProducts.map(p => [
                p.id,
                p.gia_khuyen_mai > 0 ? p.gia_khuyen_mai : p.gia_ban
            ])
        );
        initialTotalAmount = products.reduce((sum: number, p: any) => {
            const price = productPriceMap.get(p.product_id) || 0;
            return sum + (price * p.quantity);
        }, 0);
    }

    // Kiểm tra bàn trống
    await checkTablesAvailability(ban_an_ids, reservationDateObj, partySizeNum);

    const depositAmount = initialTotalAmount * 0.3;

    // === SỬA ĐOẠN NÀY: Ưu tiên lấy status từ Frontend gửi lên (cho POS), nếu không có thì mặc định là 1 (Web) ===
    const initialStatus = status ? parseInt(status) : ReservationStatus.PENDING_CONFIRMATION;

    // Xử lý sđt rỗng cho khách lẻ
    const finalPhone = tel ? tel : "";

    return prisma.$transaction(async (tx) => {
        const newReservation = await tx.dat_ban.create({
            data: {
                ...reservationData, // Lúc này reservationData KHÔNG còn chứa 'status' nữa -> Hết lỗi
                ho_ten_khach: fullname,
                dien_thoai: finalPhone,
                ghi_chu: note || null,
                khach_hang_id: user_id ? parseInt(user_id, 10) : null,
                ma_dat_ban: `DB-${Date.now()}`,
                ngay_dat_ban: reservationDateObj,
                so_luong_khach: partySizeNum,
                tong_tien: initialTotalAmount,
                tien_dat_coc: depositAmount,

                // Gán vào cột trang_thai
                trang_thai: initialStatus,

                khuyen_mai_id: reservationData.khuyen_mai_id ? parseInt(reservationData.khuyen_mai_id, 10) : null,

                ban_an: {
                    connect: ban_an_ids.map((id: number) => ({ id: id }))
                }
            },
        });

        // (Giữ nguyên logic thêm món ăn)
        if (products && Array.isArray(products) && products.length > 0) {
            const productPriceMap = new Map((await prisma.san_pham.findMany({
                where: { id: { in: products.map((p: any) => p.product_id) } },
                select: { id: true, gia_ban: true, gia_khuyen_mai: true }
            })).map(p => [p.id, p.gia_khuyen_mai > 0 ? p.gia_khuyen_mai : p.gia_ban]));

            await tx.chi_tiet_dat_ban.createMany({
                data: products.map((p: any) => ({
                    dat_ban_id: newReservation.id,
                    san_pham_id: p.product_id,
                    so_luong: p.quantity,
                    gia_tai_thoi_diem: productPriceMap.get(p.product_id) || 0,
                })),
            });
        }

        return newReservation;
    });
};

/**
 * 🧮 Lấy danh sách đặt bàn cho trang quản trị
 */
export const getAdminReservations = async (filters: any) => {
    const { page, pageSize, searchName, searchPhone, status, reservation_code } = filters;
    const where: Prisma.dat_banWhereInput = {
        ho_ten_khach: { contains: searchName },
        dien_thoai: { contains: searchPhone },
        ma_dat_ban: { contains: reservation_code },
    };
    // Chuyển đổi status string sang number nếu có
    if (status !== undefined && status !== null && status !== '') {
        const statusNum = parseInt(status);
        if (!isNaN(statusNum)) {
            where.trang_thai = statusNum; // Dùng Int
        }
    }


    const [reservations, total] = await prisma.$transaction([
        prisma.dat_ban.findMany({
            where,
            include: {
                // ban_an: { select: { so_ban: true } }, // Dòng cũ (nếu có)
                ban_an: true, // <-- THÊM DÒNG NÀY ĐỂ LẤY MẢNG BÀN ĂN
                khuyen_mai: { select: { giam_gia: true, loai_giam_gia: true } },
            },
            orderBy: { ngay_dat_ban: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.dat_ban.count({ where }),
    ]);
    return { data: reservations, total, totalPages: Math.ceil(total / pageSize), currentPage: page };
};

// === THÊM MỚI HÀM NÀY ===
/**
 * 📄 Lấy chi tiết một đơn đặt bàn cho Admin
 */
export const getAdminReservationById = async (id: number) => {
    const reservation = await prisma.dat_ban.findUnique({
        where: { id },
        include: {
            ban_an: true, // Lấy đủ thông tin bàn
            khuyen_mai: true, // Lấy đủ thông tin KM
            nguoi_dung: { // Lấy thông tin khách hàng nếu có
                select: { id: true, ho_ten: true, email: true, dien_thoai: true }
            },
            chi_tiet_dat_ban: { // Lấy chi tiết món ăn
                include: {
                    san_pham: { // Lấy thông tin sản phẩm
                        select: { id: true, ten_san_pham: true, media_files: { select: { file_url: true } } }
                    }
                }
            }
        }
    });
    if (!reservation) {
        throw new Error('Không tìm thấy đơn đặt bàn.');
    }
    return reservation;
};
// =========================


/**
 * 🍛 Admin thay đổi danh sách món ăn (Sửa: Tự tính lại tiền)
 */
export const changeDishes = async (reservationId: number, dishes: any[]) => {

    // --- Sửa: Tính lại tổng tiền ---
    let newTotalAmount = 0;
    if (dishes && Array.isArray(dishes) && dishes.length > 0) {
        const productIds = dishes.map((d: any) => d.product_id);
        const dbProducts = await prisma.san_pham.findMany({
            where: { id: { in: productIds } },
            select: { id: true, gia_ban: true, gia_khuyen_mai: true },
        });
        const productPriceMap = new Map(dbProducts.map(p => [p.id, p.gia_khuyen_mai > 0 ? p.gia_khuyen_mai : p.gia_ban]));

        newTotalAmount = dishes.reduce((sum: number, d: any) => {
            const price = productPriceMap.get(d.product_id) || 0;
            return sum + (price * d.quantity);
        }, 0);
    }
    // ---------------------------

    return prisma.$transaction(async (tx) => {
        await tx.dat_ban.update({
            where: { id: reservationId },
            data: {
                tong_tien: newTotalAmount,
                so_lan_doi: { increment: 1 } // Giờ sẽ hoạt động vì so_lan_doi là Int
            }
        });

        await tx.chi_tiet_dat_ban.deleteMany({ where: { dat_ban_id: reservationId } });

        if (dishes && dishes.length > 0) {
            // Lấy lại giá để lưu vào chi tiết
            const productPriceMap = new Map((await prisma.san_pham.findMany({
                where: { id: { in: dishes.map(d => d.product_id) } },
                select: { id: true, gia_ban: true, gia_khuyen_mai: true }
            })).map(p => [p.id, p.gia_khuyen_mai > 0 ? p.gia_khuyen_mai : p.gia_ban]));

            await tx.chi_tiet_dat_ban.createMany({
                data: dishes.map((d: any) => ({
                    dat_ban_id: reservationId,
                    san_pham_id: d.product_id,
                    so_luong: d.quantity,
                    gia_tai_thoi_diem: productPriceMap.get(d.product_id) || 0, // Lưu giá lúc đổi
                }))
            });
        }
    });
};
/*
===========================================================================
 📉 LOGIC TRỪ KHO TỰ ĐỘNG (HELPER)
===========================================================================
*/
const deductInventory = async (reservationId: number, tx: Prisma.TransactionClient) => {
    // 1. Lấy chi tiết đơn hàng + Công thức của từng món
    const reservation = await tx.dat_ban.findUnique({
        where: { id: reservationId },
        include: {
            chi_tiet_dat_ban: {
                include: {
                    san_pham: {
                        include: {
                            cong_thuc: true // Lấy định lượng
                        }
                    }
                }
            }
        }
    });

    if (!reservation || !reservation.chi_tiet_dat_ban) return;

    // 2. Duyệt qua từng món ăn trong đơn
    for (const item of reservation.chi_tiet_dat_ban) {
        if (item.san_pham && item.san_pham.cong_thuc.length > 0) {
            // Duyệt qua từng nguyên liệu trong công thức của món đó
            for (const recipe of item.san_pham.cong_thuc) {
                // Tổng lượng cần trừ = Số lượng món khách gọi * Định lượng 1 món
                const quantityDeduct = item.so_luong * recipe.so_luong_can;

                // 3. Trừ trực tiếp vào kho
                await tx.nguyen_lieu.update({
                    where: { id: recipe.nguyen_lieu_id },
                    data: {
                        so_luong_ton: { decrement: quantityDeduct }
                    }
                });
            }
        }
    }
};

/*
===========================================================================
 🔄 CẬP NHẬT TRẠNG THÁI ĐẶT BÀN (CÓ TRỪ KHO)
===========================================================================
*/
export const updateReservationStatus = async (id: number, status: number) => {
    // Kiểm tra trạng thái hợp lệ
    // (Bạn có thể bỏ qua check này nếu tin tưởng frontend, hoặc giữ lại để an toàn)
    const validStatuses = Object.values(ReservationStatus) as number[];
    if (!validStatuses.includes(status)) {
        throw new Error('Mã trạng thái không hợp lệ.');
    }

    // Lấy trạng thái hiện tại để so sánh
    const currentReservation = await prisma.dat_ban.findUnique({
        where: { id },
        select: { trang_thai: true }
    });

    if (!currentReservation) throw new Error('Đơn đặt bàn không tồn tại.');

    // Dùng Transaction để đảm bảo: Cập nhật trạng thái + Trừ kho phải thành công cùng lúc
    return prisma.$transaction(async (tx) => {
        // 1. Cập nhật trạng thái đơn hàng
        const updatedReservation = await tx.dat_ban.update({
            where: { id },
            data: { trang_thai: status },
        });

        // 2. LOGIC KÍCH HOẠT TRỪ KHO
        // Nếu chuyển sang trạng thái COMPLETED (5) và trước đó chưa hoàn thành
        if (status === ReservationStatus.COMPLETED && currentReservation.trang_thai !== ReservationStatus.COMPLETED) {
            await deductInventory(id, tx);
        }

        // (Nâng cao: Nếu muốn làm chức năng "Hủy hoàn thành" để cộng lại kho thì viết thêm logic ở đây)

        return updatedReservation;
    });
};

// === THÊM MỚI HÀM NÀY ===
/**
 * 🗑️ Xóa Mềm Đặt Bàn (Cập nhật trạng thái thành CANCELLED)
 */
export const softDeleteReservation = async (id: number) => {
    return updateReservationStatus(id, ReservationStatus.CANCELLED); // Gọi hàm update status
};
// =========================

// === THÊM MỚI HÀM NÀY ===
/**
 * 🗑️🔥 Xóa Vĩnh Viễn Đặt Bàn (Nên cẩn thận khi dùng)
 */
export const permanentlyDeleteReservation = async (id: number) => {
    // Có thể thêm kiểm tra, ví dụ: chỉ cho xóa đơn đã hủy quá lâu
    const reservation = await prisma.dat_ban.findUnique({ where: { id } });
    if (!reservation) {
        throw new Error('Không tìm thấy đơn đặt bàn.');
    }
    // Chỉ cho xóa vĩnh viễn đơn đã hủy? (Tùy nghiệp vụ)
    // if (reservation.trang_thai !== ReservationStatus.CANCELLED) {
    //    throw new Error('Chỉ có thể xóa vĩnh viễn đơn đã hủy.');
    // }

    // Xóa chi tiết trước
    await prisma.chi_tiet_dat_ban.deleteMany({ where: { dat_ban_id: id } });
    // Xóa đặt bàn
    return prisma.dat_ban.delete({ where: { id } });
};
// =========================


/**
 * 🙋 Lấy danh sách đặt bàn của một người dùng cụ thể
 */
export const getBookingsByUserId = async (userId: number) => {
    return prisma.dat_ban.findMany({
        where: { khach_hang_id: userId },
        include: { ban_an: { select: { so_ban: true } } },
        orderBy: { ngay_dat_ban: 'desc' }
    });
};

/**
 * 📄 Lấy chi tiết một đơn đặt bàn, đảm bảo đúng là của người dùng đó
 */
export const getBookingDetailForUser = async (reservationId: number, userId: number) => {
    const reservation = await prisma.dat_ban.findFirst({
        where: { id: reservationId, khach_hang_id: userId },
        include: {
            chi_tiet_dat_ban: {
                include: { san_pham: { select: { ten_san_pham: true, media_files: { select: { file_url: true } } } } } // Lấy ảnh sản phẩm
            },
            ban_an: true, // Lấy đủ thông tin bàn
            khuyen_mai: true // Lấy thông tin KM
        }
    });

    if (!reservation) {
        throw new Error('Không tìm thấy đơn đặt bàn hoặc bạn không có quyền truy cập.');
    }
    return reservation;
};

// /**
//  * ✨ Admin tạo mới một đơn đặt bàn (Linh hoạt hơn createReservation)
//  */
// export const createAdminReservation = async (data: any) => {
//     const { products, ban_an_id, ...reservationData } = data; // Tách ban_an_id nếu admin chọn sẵn
//     const partySize = parseInt(reservationData.party_size || reservationData.partySize, 10);
//     const reservationDate = new Date(reservationData.reservation_date);

//     if (isNaN(partySize) || partySize <= 0) {
//         throw new Error('Số lượng khách không hợp lệ.');
//     }
//     if (isNaN(reservationDate.getTime())) {
//         throw new Error('Ngày đặt bàn không hợp lệ.');
//     }

//     let tableId: number;
//     // Nếu admin đã chọn bàn cụ thể
//     if (ban_an_id) {
//         // Có thể thêm kiểm tra xem bàn đó có trống vào giờ đó không (nếu muốn chặt chẽ hơn)
//         const chosenTable = await prisma.ban_an.findUnique({ where: { id: parseInt(ban_an_id, 10) } });
//         if (!chosenTable) throw new Error('Bàn được chọn không tồn tại.');
//         if (chosenTable.suc_chua < partySize) throw new Error(`Bàn ${chosenTable.so_ban} không đủ sức chứa.`);
//         // (Thêm kiểm tra giờ nếu cần)
//         tableId = parseInt(ban_an_id, 10);
//     } else {
//         // Nếu admin không chọn bàn, để hệ thống tự tìm
//         tableId = await findAvailableTable(reservationDate, partySize);
//     }


//     // Tính tổng tiền món ăn ban đầu (giống createReservation)
//     let initialTotalAmount = 0;
//     if (products && Array.isArray(products) && products.length > 0) {
//         const productIds = products.map((p: any) => p.product_id);
//         const dbProducts = await prisma.san_pham.findMany({
//             where: { id: { in: productIds } },
//             select: { id: true, gia_ban: true, gia_khuyen_mai: true },
//         });
//         const productPriceMap = new Map(dbProducts.map(p => [p.id, p.gia_khuyen_mai > 0 ? p.gia_khuyen_mai : p.gia_ban]));
//         initialTotalAmount = products.reduce((sum: number, p: any) => {
//             const price = productPriceMap.get(p.product_id) || 0;
//             return sum + (price * p.quantity);
//         }, 0);
//     }

//     // Tiền cọc và Trạng thái có thể khác với client đặt (VD: admin tạo thì auto xác nhận?)
//     // Ở đây tạm giữ logic cọc 30%, trạng thái chờ (1)
//     const depositAmount = initialTotalAmount * 0.3;
//     const initialStatus = reservationData.status ? parseInt(reservationData.status) : ReservationStatus.PENDING_CONFIRMATION; // Cho phép admin set status ban đầu? Hoặc mặc định

//     return prisma.$transaction(async (tx) => {
//         const newReservation = await tx.dat_ban.create({
//             data: {
//                 ma_dat_ban: reservationData.reservation_code || `DB-${Date.now()}`,
//                 khach_hang_id: reservationData.user_id ? parseInt(reservationData.user_id, 10) : null,
//                 ho_ten_khach: reservationData.fullname,
//                 dien_thoai: reservationData.tel,
//                 email: reservationData.email,
//                 ngay_dat_ban: reservationDate,
//                 so_luong_khach: partySize,
//                 ghi_chu: reservationData.note || reservationData.notes,
//                 tong_tien: initialTotalAmount,
//                 tien_dat_coc: depositAmount,
//                 trang_thai: initialStatus,
//                 ban_an_id: tableId, // Gán bàn đã tìm/chọn
//                 khuyen_mai_id: reservationData.promotion_id ? parseInt(reservationData.promotion_id, 10) : null,
//                 so_lan_doi: 0, // Mới tạo = 0 lần đổi
//             },
//         });

//         if (products && Array.isArray(products) && products.length > 0) {
//             const productPriceMap = new Map((await prisma.san_pham.findMany({
//                 where: { id: { in: products.map(p => p.product_id) } },
//                 select: { id: true, gia_ban: true, gia_khuyen_mai: true }
//             })).map(p => [p.id, p.gia_khuyen_mai > 0 ? p.gia_khuyen_mai : p.gia_ban]));

//             await tx.chi_tiet_dat_ban.createMany({
//                 data: products.map((p: any) => ({
//                     dat_ban_id: newReservation.id,
//                     san_pham_id: p.product_id,
//                     so_luong: p.quantity,
//                     gia_tai_thoi_diem: productPriceMap.get(p.product_id) || 0,
//                 })),
//             });
//         }

//         // Không cần xử lý trừ KM ở đây nếu admin tự nhập KM ID

//         return newReservation;
//     });
// };
// // =====================================