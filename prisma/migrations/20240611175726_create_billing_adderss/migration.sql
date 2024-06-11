-- CreateTable
CREATE TABLE "billing_address" (
    "login_info_id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "full_address" TEXT NOT NULL,

    CONSTRAINT "billing_address_pkey" PRIMARY KEY ("login_info_id")
);

-- AddForeignKey
ALTER TABLE "billing_address" ADD CONSTRAINT "billing_address_login_info_id_fkey" FOREIGN KEY ("login_info_id") REFERENCES "login_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
