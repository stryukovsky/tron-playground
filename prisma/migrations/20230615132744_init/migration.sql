-- CreateTable
CREATE TABLE "Transfer" (
    "tx" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" BIGINT NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("tx")
);
