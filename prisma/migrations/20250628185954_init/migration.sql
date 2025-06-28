/*
  Warnings:

  - You are about to drop the column `courseId` on the `Slugdata` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Slugdata` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Slugdata" DROP CONSTRAINT "Slugdata_courseId_fkey";

-- DropIndex
DROP INDEX "Slugdata_slug_key";

-- AlterTable
ALTER TABLE "Slugdata" DROP COLUMN "courseId",
DROP COLUMN "slug",
ADD COLUMN     "coursesId" INTEGER,
ADD COLUMN     "organish" TEXT[];

-- AddForeignKey
ALTER TABLE "Slugdata" ADD CONSTRAINT "Slugdata_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "Courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
