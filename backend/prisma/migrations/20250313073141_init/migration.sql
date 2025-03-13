-- AlterTable
ALTER TABLE `Contact` MODIFY `citizenId` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `province` VARCHAR(191) NULL,
    MODIFY `zipCode` VARCHAR(191) NULL,
    MODIFY `country` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Social` MODIFY `line` VARCHAR(191) NULL,
    MODIFY `facebook` VARCHAR(191) NULL,
    MODIFY `website` VARCHAR(191) NULL,
    MODIFY `instagram` VARCHAR(191) NULL,
    MODIFY `tiktok` VARCHAR(191) NULL;
