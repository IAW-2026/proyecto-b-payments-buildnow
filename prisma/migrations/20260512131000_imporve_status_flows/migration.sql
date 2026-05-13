/*
  Warnings:

  - The values [COMPLETED] on the enum `PayoutStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `externalReference` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `financial_history` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'PAYOUT', 'COMMISSION');

-- AlterEnum
BEGIN;
CREATE TYPE "PayoutStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."payouts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payouts" ALTER COLUMN "status" TYPE "PayoutStatus_new" USING ("status"::text::"PayoutStatus_new");
ALTER TYPE "PayoutStatus" RENAME TO "PayoutStatus_old";
ALTER TYPE "PayoutStatus_new" RENAME TO "PayoutStatus";
DROP TYPE "public"."PayoutStatus_old";
ALTER TABLE "payouts" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "financial_history" DROP CONSTRAINT "financial_history_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_paymentId_fkey";

-- DropIndex
DROP INDEX "transactions_externalReference_key";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "externalReference",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "payoutId" TEXT,
ADD COLUMN     "type" "TransactionType" NOT NULL,
ALTER COLUMN "paymentId" DROP NOT NULL;

-- DropTable
DROP TABLE "financial_history";

-- DropEnum
DROP TYPE "FinancialHistoryStatus";

-- DropEnum
DROP TYPE "MovementType";

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "payouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
