/*
  Warnings:

  - You are about to drop the column `created_at` on the `activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activity" DROP COLUMN "created_at",
ADD COLUMN     "last_resetEmail" TIMESTAMP(3),
ADD COLUMN     "last_resetPassword" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "login_info" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
