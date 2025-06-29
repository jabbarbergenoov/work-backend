/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Slugdata` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Slugdata" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Slugdata_slug_key" ON "Slugdata"("slug");
