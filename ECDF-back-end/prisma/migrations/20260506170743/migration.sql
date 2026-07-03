/*
  Warnings:

  - You are about to drop the `FimSemestre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FimSemestre";

-- CreateTable
CREATE TABLE "fim_sem" (
    "id" SERIAL NOT NULL,
    "fim_semestre" VARCHAR(10) NOT NULL,

    CONSTRAINT "fim_sem_pkey" PRIMARY KEY ("id")
);
