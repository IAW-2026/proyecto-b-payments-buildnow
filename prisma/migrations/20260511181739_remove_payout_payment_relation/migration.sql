/*
  Warnings:

  - You are about to drop the column `paymentId` on the `payouts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payouts" DROP CONSTRAINT "payouts_paymentId_fkey";

-- AlterTable
ALTER TABLE "payouts" DROP COLUMN "paymentId";
