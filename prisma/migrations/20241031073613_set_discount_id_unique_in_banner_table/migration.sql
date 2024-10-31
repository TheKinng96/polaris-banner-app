/*
  Warnings:

  - A unique constraint covering the columns `[discountId]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Banner_discountId_key" ON "Banner"("discountId");
