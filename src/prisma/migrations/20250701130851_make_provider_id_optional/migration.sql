-- DropForeignKey
ALTER TABLE "Gigs" DROP CONSTRAINT "Gigs_provider_id_fkey";

-- AlterTable
ALTER TABLE "Gigs" ALTER COLUMN "provider_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Gigs" ADD CONSTRAINT "Gigs_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
