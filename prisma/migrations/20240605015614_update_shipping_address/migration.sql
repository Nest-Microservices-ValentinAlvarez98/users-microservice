/*
  Warnings:

  - You are about to drop the column `address` on the `shipping_address` table. All the data in the column will be lost.
  - Added the required column `street_name` to the `shipping_address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street_number` to the `shipping_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shipping_address" DROP COLUMN "address",
ADD COLUMN     "street_name" TEXT NOT NULL,
ADD COLUMN     "street_number" TEXT NOT NULL;
