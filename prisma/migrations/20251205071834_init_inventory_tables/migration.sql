-- CreateTable
CREATE TABLE `nha_cung_cap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_nha_cung_cap` VARCHAR(255) NOT NULL,
    `so_dien_thoai` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `dia_chi` TEXT NULL,
    `ghi_chu` TEXT NULL,
    `trang_thai` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nguyen_lieu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_nguyen_lieu` VARCHAR(255) NOT NULL,
    `don_vi_tinh` VARCHAR(50) NOT NULL,
    `so_luong_ton` DOUBLE NOT NULL DEFAULT 0,
    `muc_canh_bao` DOUBLE NOT NULL DEFAULT 0,
    `gia_nhap_cuoi` INTEGER NULL,
    `trang_thai` BOOLEAN NOT NULL DEFAULT true,
    `ghi_chu` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phieu_nhap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_phieu` VARCHAR(50) NOT NULL,
    `nha_cung_cap_id` INTEGER NOT NULL,
    `nguoi_nhap_id` INTEGER NOT NULL,
    `tong_tien` INTEGER NOT NULL,
    `ghi_chu` TEXT NULL,
    `ngay_nhap` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `phieu_nhap_ma_phieu_key`(`ma_phieu`),
    INDEX `phieu_nhap_nha_cung_cap_id_idx`(`nha_cung_cap_id`),
    INDEX `phieu_nhap_nguoi_nhap_id_idx`(`nguoi_nhap_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chi_tiet_phieu_nhap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phieu_nhap_id` INTEGER NOT NULL,
    `nguyen_lieu_id` INTEGER NOT NULL,
    `so_luong` DOUBLE NOT NULL,
    `don_gia` INTEGER NOT NULL,
    `thanh_tien` INTEGER NOT NULL,
    `han_su_dung` DATE NULL,

    INDEX `chi_tiet_phieu_nhap_phieu_nhap_id_idx`(`phieu_nhap_id`),
    INDEX `chi_tiet_phieu_nhap_nguyen_lieu_id_idx`(`nguyen_lieu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cong_thuc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `san_pham_id` INTEGER NOT NULL,
    `nguyen_lieu_id` INTEGER NOT NULL,
    `so_luong_can` DOUBLE NOT NULL,
    `don_vi_tinh` VARCHAR(50) NOT NULL,

    INDEX `cong_thuc_san_pham_id_idx`(`san_pham_id`),
    INDEX `cong_thuc_nguyen_lieu_id_idx`(`nguyen_lieu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `phieu_nhap` ADD CONSTRAINT `phieu_nhap_nha_cung_cap_id_fkey` FOREIGN KEY (`nha_cung_cap_id`) REFERENCES `nha_cung_cap`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phieu_nhap` ADD CONSTRAINT `phieu_nhap_nguoi_nhap_id_fkey` FOREIGN KEY (`nguoi_nhap_id`) REFERENCES `nguoi_dung`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_phieu_nhap` ADD CONSTRAINT `chi_tiet_phieu_nhap_phieu_nhap_id_fkey` FOREIGN KEY (`phieu_nhap_id`) REFERENCES `phieu_nhap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_phieu_nhap` ADD CONSTRAINT `chi_tiet_phieu_nhap_nguyen_lieu_id_fkey` FOREIGN KEY (`nguyen_lieu_id`) REFERENCES `nguyen_lieu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cong_thuc` ADD CONSTRAINT `cong_thuc_san_pham_id_fkey` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cong_thuc` ADD CONSTRAINT `cong_thuc_nguyen_lieu_id_fkey` FOREIGN KEY (`nguyen_lieu_id`) REFERENCES `nguyen_lieu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
