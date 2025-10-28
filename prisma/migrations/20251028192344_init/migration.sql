-- CreateTable
CREATE TABLE `bai_viet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `anh_bia_id` INTEGER NULL,
    `tieu_de` VARCHAR(255) NOT NULL,
    `noi_dung` TEXT NOT NULL,
    `nguoi_dung_id` INTEGER NULL,
    `danh_muc_blog_id` INTEGER NULL,
    `slug` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `bai_viet_slug_key`(`slug`),
    INDEX `fk_baiviet_danhmuc`(`danh_muc_blog_id`),
    INDEX `fk_baiviet_media`(`anh_bia_id`),
    INDEX `bai_viet_nguoi_dung_id_idx`(`nguoi_dung_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ban_an` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `so_ban` INTEGER NOT NULL,
    `suc_chua` INTEGER NOT NULL,
    `trang_thai` BOOLEAN NOT NULL DEFAULT true,
    `anh_ban_id` INTEGER NULL,
    `video_ban_id` INTEGER NULL,
    `mo_ta_vi_tri` TEXT NULL,
    `tang` INTEGER NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `so_ban`(`so_ban`),
    INDEX `fk_banan_anh`(`anh_ban_id`),
    INDEX `fk_banan_video`(`video_ban_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `binh_luan_blog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bai_viet_id` INTEGER NOT NULL,
    `nguoi_dung_id` INTEGER NOT NULL,
    `noi_dung` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_binhluan_baiviet`(`bai_viet_id`),
    INDEX `fk_binhluan_nguoidung`(`nguoi_dung_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chi_tiet_dat_ban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dat_ban_id` INTEGER NOT NULL,
    `san_pham_id` INTEGER NOT NULL,
    `so_luong` INTEGER NOT NULL,
    `gia_tai_thoi_diem` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_chitietdatban_datban`(`dat_ban_id`),
    INDEX `fk_chitietdatban_sanpham`(`san_pham_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danh_muc_blog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_danh_muc` VARCHAR(255) NOT NULL,
    `trang_thai` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `ten_danh_muc`(`ten_danh_muc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danh_muc_san_pham` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_danh_muc` VARCHAR(255) NOT NULL,
    `trang_thai` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `ten_danh_muc`(`ten_danh_muc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dat_ban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_dat_ban` VARCHAR(50) NULL,
    `khach_hang_id` INTEGER NULL,
    `so_lan_doi` INTEGER NOT NULL DEFAULT 0,
    `ban_an_id` INTEGER NULL,
    `khuyen_mai_id` INTEGER NULL,
    `ho_ten_khach` VARCHAR(255) NOT NULL,
    `dien_thoai` VARCHAR(15) NOT NULL,
    `email` VARCHAR(60) NULL,
    `ngay_dat_ban` DATETIME(0) NOT NULL,
    `so_luong_khach` INTEGER NOT NULL,
    `ghi_chu` TEXT NULL,
    `tong_tien` INTEGER NULL,
    `tien_dat_coc` INTEGER NOT NULL DEFAULT 0,
    `trang_thai` INTEGER NOT NULL DEFAULT 1,
    `momo_order_id` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_datban_banan`(`ban_an_id`),
    INDEX `fk_datban_khachhang`(`khach_hang_id`),
    INDEX `fk_datban_khuyenmai`(`khuyen_mai_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hang_thanh_vien` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_hang` VARCHAR(50) NOT NULL,
    `diem_toi_thieu` INTEGER NOT NULL,
    `mo_ta_uu_dai` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `khuyen_mai` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_khuyen_mai` VARCHAR(255) NOT NULL,
    `giam_gia` INTEGER NOT NULL,
    `loai_giam_gia` BOOLEAN NOT NULL,
    `so_luong` INTEGER NOT NULL,
    `ngay_hieu_luc` DATETIME(0) NOT NULL,
    `ngay_ket_thuc` DATETIME(0) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_path` VARCHAR(255) NOT NULL,
    `file_url` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(50) NOT NULL,
    `storage_service` VARCHAR(50) NULL DEFAULT 'firebase',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nguoi_dung` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ho_ten` VARCHAR(255) NOT NULL,
    `tai_khoan` VARCHAR(255) NULL,
    `anh_dai_dien_id` INTEGER NULL,
    `email` VARCHAR(255) NOT NULL,
    `dien_thoai` VARCHAR(20) NULL,
    `dia_chi` VARCHAR(255) NULL,
    `mat_khau` VARCHAR(255) NOT NULL,
    `vai_tro_id` INTEGER NULL,
    `trang_thai` BOOLEAN NULL DEFAULT true,
    `loai_nguoi_dung` ENUM('Khách Hàng', 'Nhân Viên') NOT NULL,
    `luong` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `fk_nguoidung_media`(`anh_dai_dien_id`),
    INDEX `fk_nguoidung_vaitro`(`vai_tro_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phuong_thuc_thanh_toan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dat_ban_id` INTEGER NOT NULL,
    `nguoi_thanh_toan_id` INTEGER NOT NULL,
    `phuong_thuc` VARCHAR(50) NOT NULL,
    `so_tien` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_thanhtoan_datban`(`dat_ban_id`),
    INDEX `fk_thanhtoan_nguoidung`(`nguoi_thanh_toan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quyen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_nhom_quyen` VARCHAR(255) NULL,
    `ten_chuc_nang` VARCHAR(255) NOT NULL,
    `ma_quyen` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `ma_quyen`(`ma_quyen`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `san_pham` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_san_pham` VARCHAR(10) NOT NULL,
    `ten_san_pham` VARCHAR(255) NOT NULL,
    `gia_ban` INTEGER NOT NULL,
    `gia_khuyen_mai` INTEGER NOT NULL DEFAULT 0,
    `hinh_anh_id` INTEGER NULL,
    `mo_ta` TEXT NULL,
    `trang_thai` BOOLEAN NOT NULL DEFAULT true,
    `danh_muc_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `ma_san_pham`(`ma_san_pham`),
    INDEX `fk_sanpham_danhmuc`(`danh_muc_id`),
    INDEX `fk_sanpham_media`(`hinh_anh_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thay_doi_mon_an` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dat_ban_id` INTEGER NOT NULL,
    `san_pham_id` INTEGER NOT NULL,
    `so_luong` INTEGER NOT NULL,
    `gia_tai_thoi_diem` INTEGER NOT NULL,
    `loai_thay_doi` BOOLEAN NOT NULL,
    `ghi_chu` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_thaydoi_datban`(`dat_ban_id`),
    INDEX `fk_thaydoi_sanpham`(`san_pham_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `the_thanh_vien` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `khach_hang_id` INTEGER NOT NULL,
    `hang_thanh_vien_id` INTEGER NOT NULL,
    `diem_tich_luy` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `khach_hang_id`(`khach_hang_id`),
    INDEX `fk_thethanhvien_hang`(`hang_thanh_vien_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vai_tro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_vai_tro` VARCHAR(255) NOT NULL,
    `mo_ta` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `ten_vai_tro`(`ten_vai_tro`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vai_tro_quyen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vai_tro_id` INTEGER NOT NULL,
    `quyen_id` INTEGER NOT NULL,

    INDEX `fk_vaitroquyen_quyen`(`quyen_id`),
    INDEX `fk_vaitroquyen_vaitro`(`vai_tro_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bai_viet` ADD CONSTRAINT `fk_baiviet_danhmucblog` FOREIGN KEY (`danh_muc_blog_id`) REFERENCES `danh_muc_blog`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bai_viet` ADD CONSTRAINT `fk_baiviet_media` FOREIGN KEY (`anh_bia_id`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bai_viet` ADD CONSTRAINT `bai_viet_nguoi_dung_id_fkey` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ban_an` ADD CONSTRAINT `fk_banan_anh` FOREIGN KEY (`anh_ban_id`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ban_an` ADD CONSTRAINT `fk_banan_video` FOREIGN KEY (`video_ban_id`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `binh_luan_blog` ADD CONSTRAINT `fk_binhluan_baiviet` FOREIGN KEY (`bai_viet_id`) REFERENCES `bai_viet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `binh_luan_blog` ADD CONSTRAINT `fk_binhluan_nguoidung` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_dat_ban` ADD CONSTRAINT `fk_chitietdatban_datban` FOREIGN KEY (`dat_ban_id`) REFERENCES `dat_ban`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_dat_ban` ADD CONSTRAINT `fk_chitietdatban_sanpham` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_ban` ADD CONSTRAINT `fk_datban_banan` FOREIGN KEY (`ban_an_id`) REFERENCES `ban_an`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_ban` ADD CONSTRAINT `fk_datban_khachhang` FOREIGN KEY (`khach_hang_id`) REFERENCES `nguoi_dung`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_ban` ADD CONSTRAINT `fk_datban_khuyenmai` FOREIGN KEY (`khuyen_mai_id`) REFERENCES `khuyen_mai`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nguoi_dung` ADD CONSTRAINT `fk_nguoidung_media` FOREIGN KEY (`anh_dai_dien_id`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nguoi_dung` ADD CONSTRAINT `fk_nguoidung_vaitro` FOREIGN KEY (`vai_tro_id`) REFERENCES `vai_tro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phuong_thuc_thanh_toan` ADD CONSTRAINT `fk_thanhtoan_datban` FOREIGN KEY (`dat_ban_id`) REFERENCES `dat_ban`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phuong_thuc_thanh_toan` ADD CONSTRAINT `fk_thanhtoan_nguoidung` FOREIGN KEY (`nguoi_thanh_toan_id`) REFERENCES `nguoi_dung`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `san_pham` ADD CONSTRAINT `fk_sanpham_danhmuc` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc_san_pham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `san_pham` ADD CONSTRAINT `fk_sanpham_media` FOREIGN KEY (`hinh_anh_id`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thay_doi_mon_an` ADD CONSTRAINT `fk_thaydoi_datban` FOREIGN KEY (`dat_ban_id`) REFERENCES `dat_ban`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thay_doi_mon_an` ADD CONSTRAINT `fk_thaydoi_sanpham` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `the_thanh_vien` ADD CONSTRAINT `fk_thethanhvien_hang` FOREIGN KEY (`hang_thanh_vien_id`) REFERENCES `hang_thanh_vien`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `the_thanh_vien` ADD CONSTRAINT `fk_thethanhvien_khachhang` FOREIGN KEY (`khach_hang_id`) REFERENCES `nguoi_dung`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vai_tro_quyen` ADD CONSTRAINT `fk_vaitroquyen_quyen` FOREIGN KEY (`quyen_id`) REFERENCES `quyen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vai_tro_quyen` ADD CONSTRAINT `fk_vaitroquyen_vaitro` FOREIGN KEY (`vai_tro_id`) REFERENCES `vai_tro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
