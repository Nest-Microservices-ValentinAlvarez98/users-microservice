-- CreateTable
CREATE TABLE "login_info" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "login_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password" (
    "login_info_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "password_pkey" PRIMARY KEY ("login_info_id")
);

-- CreateTable
CREATE TABLE "activity" (
    "login_info_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_activity" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("login_info_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "login_info_email_key" ON "login_info"("email");

-- AddForeignKey
ALTER TABLE "password" ADD CONSTRAINT "password_login_info_id_fkey" FOREIGN KEY ("login_info_id") REFERENCES "login_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_login_info_id_fkey" FOREIGN KEY ("login_info_id") REFERENCES "login_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
