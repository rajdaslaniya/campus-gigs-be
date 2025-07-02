/*
  Warnings:

  - You are about to drop the column `image` on the `Gigs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gigs" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
