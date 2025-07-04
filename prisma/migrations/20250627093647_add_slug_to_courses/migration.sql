/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Courses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Courses_name_key" ON "Courses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Courses_slug_key" ON "Courses"("slug");
