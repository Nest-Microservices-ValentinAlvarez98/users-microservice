-- CreateTable
CREATE TABLE "profile" (
    "login_info_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("login_info_id")
);

-- CreateTable
CREATE TABLE "shipping_address" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "commentary" TEXT,
    "login_info_id" TEXT NOT NULL,

    CONSTRAINT "shipping_address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_login_info_id_fkey" FOREIGN KEY ("login_info_id") REFERENCES "login_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_address" ADD CONSTRAINT "shipping_address_login_info_id_fkey" FOREIGN KEY ("login_info_id") REFERENCES "login_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
