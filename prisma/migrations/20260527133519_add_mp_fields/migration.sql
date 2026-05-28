/*
  Warnings:

  - A unique constraint covering the columns `[mercadopagoId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[preferenceId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "mercadopagoId" TEXT,
ADD COLUMN     "preferenceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_mercadopagoId_key" ON "payments"("mercadopagoId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_preferenceId_key" ON "payments"("preferenceId");
