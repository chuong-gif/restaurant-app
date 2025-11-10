/*
  Warnings:

  - You are about to drop the column `ban_an_id` on the `dat_ban` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `dat_ban` DROP FOREIGN KEY `fk_datban_banan`;

-- DropIndex
DROP INDEX `fk_datban_banan` ON `dat_ban`;

-- AlterTable
ALTER TABLE `dat_ban` DROP COLUMN `ban_an_id`;

-- CreateTable
CREATE TABLE `_ban_anTodat_ban` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ban_anTodat_ban_AB_unique`(`A`, `B`),
    INDEX `_ban_anTodat_ban_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ban_anTodat_ban` ADD CONSTRAINT `_ban_anTodat_ban_A_fkey` FOREIGN KEY (`A`) REFERENCES `ban_an`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ban_anTodat_ban` ADD CONSTRAINT `_ban_anTodat_ban_B_fkey` FOREIGN KEY (`B`) REFERENCES `dat_ban`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
