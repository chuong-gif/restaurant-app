import prisma from '../models';

/**
 * ✅ Lấy danh sách tất cả các hạng thành viên có sẵn trong hệ thống
 */
export const getAllTiers = async () => {
    return prisma.hang_thanh_vien.findMany({
        orderBy: {
            diem_toi_thieu: 'asc', // sắp xếp theo điểm yêu cầu tăng dần (hạng thấp → cao)
        }
    });
};

/**
 * ✅ Lấy thông tin thẻ thành viên và hạng hiện tại của một người dùng cụ thể
 */
export const getUserMembership = async (userId: number) => {
    // 🟩 Bước 1: Lấy thông tin thẻ thành viên (the_thanh_vien) theo ID người dùng
    const membershipCard = await prisma.the_thanh_vien.findUnique({
        where: { khach_hang_id: userId }, // tìm theo ID khách hàng
        include: {
            nguoi_dung: { // lấy kèm thông tin người dùng (chỉ lấy họ tên)
                select: { ho_ten: true }
            }
        }
    });

    // Nếu người dùng chưa có thẻ thành viên thì báo lỗi
    if (!membershipCard) {
        throw new Error('Không tìm thấy thông tin thành viên cho người dùng này.');
    }

    // 🟩 Bước 2: Lấy danh sách tất cả các hạng thành viên, sắp xếp theo điểm yêu cầu giảm dần
    // (để dễ tìm hạng cao nhất mà người dùng đạt được)
    const allTiers = await prisma.hang_thanh_vien.findMany({
        orderBy: {
            diem_toi_thieu: 'desc', // hạng cao trước, thấp sau
        }
    });

    // 🟩 Bước 3: Tìm hạng hiện tại dựa trên số điểm tích lũy của người dùng
    // So sánh điểm của người dùng với điểm tối thiểu yêu cầu của từng hạng
    const currentTier = allTiers.find(
        (tier: { diem_toi_thieu: number; ten_hang?: string | null }) =>
            membershipCard.diem_tich_luy >= tier.diem_toi_thieu
    );

    // 🟩 Bước 4: Trả về thông tin thẻ + tên hạng hiện tại (nếu không có thì hiển thị "Chưa xác định")
    return {
        ...membershipCard,
        hang_hien_tai: currentTier?.ten_hang || 'Chưa xác định'
    };
};
