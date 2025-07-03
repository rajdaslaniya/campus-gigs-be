/*
  Warnings:

  - You are about to drop the `GigsCategorySkills` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `GigsCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Skills` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "GigsCategorySkills" DROP CONSTRAINT "GigsCategorySkills_gigs_category_id_fkey";

-- DropForeignKey
ALTER TABLE "GigsCategorySkills" DROP CONSTRAINT "GigsCategorySkills_skill_id_fkey";

-- AlterTable
ALTER TABLE "Skills" ADD COLUMN     "categoryId" INTEGER;

-- DropTable
DROP TABLE "GigsCategorySkills";

-- CreateIndex
CREATE UNIQUE INDEX "GigsCategory_name_key" ON "GigsCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skills_name_key" ON "Skills"("name");

-- AddForeignKey
ALTER TABLE "Skills" ADD CONSTRAINT "Skills_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GigsCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
