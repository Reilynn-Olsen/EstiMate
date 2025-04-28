-- CreateTable
CREATE TABLE "quoteitems" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "quoteId" TEXT NOT NULL,

    CONSTRAINT "quoteitems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quoteitems" ADD CONSTRAINT "quoteitems_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
