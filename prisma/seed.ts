// File: prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`Bắt đầu seeding ...`);

    // Tạo các danh mục sản phẩm mặc định
    const categories = [
        { ten_danh_muc: 'Món chính' },
        { ten_danh_muc: 'Món khai vị' },
        { ten_danh_muc: 'Món tráng miệng' },
        { ten_danh_muc: 'Đồ uống' },
        { ten_danh_muc: 'Món gọi thêm' },
    ];

    for (const cat of categories) {
        await prisma.danh_muc_san_pham.upsert({
            where: { ten_danh_muc: cat.ten_danh_muc },
            update: {},
            create: cat,
        });
        console.log(`Đã tạo/cập nhật danh mục: ${cat.ten_danh_muc}`);
    }

    console.log(`Seeding hoàn tất.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });