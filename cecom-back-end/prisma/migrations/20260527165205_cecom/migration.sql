/*
  Warnings:

  - The primary key for the `fim_sem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `fim_sem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fim_semestre]` on the table `fim_sem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "fim_sem" DROP CONSTRAINT "fim_sem_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "fim_sem_pkey" PRIMARY KEY ("fim_semestre");

-- CreateTable
CREATE TABLE "url" (
    "url" VARCHAR(9999) NOT NULL,
    "vai_ser_usado" VARCHAR(3) NOT NULL,

    CONSTRAINT "url_pkey" PRIMARY KEY ("url")
);

-- CreateIndex
CREATE UNIQUE INDEX "fim_sem_fim_semestre_key" ON "fim_sem"("fim_semestre");
