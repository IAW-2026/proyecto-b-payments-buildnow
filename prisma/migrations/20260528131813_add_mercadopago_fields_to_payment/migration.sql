-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "payerEmail" TEXT,
ADD COLUMN     "statusDetail" TEXT;
