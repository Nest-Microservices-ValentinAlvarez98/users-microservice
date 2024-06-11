/*
  Warnings:

  - You are about to drop the column `created_at` on the `login_info` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "login_info" DROP COLUMN "created_at";
