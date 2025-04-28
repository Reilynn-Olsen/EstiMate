/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified",
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "defaultCurrency" TEXT NOT NULL DEFAULT 'usd',
ADD COLUMN     "logoUrl" TEXT;
