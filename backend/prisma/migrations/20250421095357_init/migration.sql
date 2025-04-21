/*
  Warnings:

  - You are about to alter the column `isRead` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `Notification` MODIFY `isRead` BOOLEAN NOT NULL;
