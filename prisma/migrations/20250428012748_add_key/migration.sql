-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'default-user-id';

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
