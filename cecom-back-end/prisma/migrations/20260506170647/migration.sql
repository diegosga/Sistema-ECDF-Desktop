-- CreateTable
CREATE TABLE "FimSemestre" (
    "id" SERIAL NOT NULL,
    "fim_semestre" VARCHAR(10) NOT NULL,

    CONSTRAINT "FimSemestre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atendimentos" (
    "id" SERIAL NOT NULL,
    "atividade" VARCHAR(200) NOT NULL,
    "qtd_atendidos" INTEGER NOT NULL,

    CONSTRAINT "atendimentos_pkey" PRIMARY KEY ("id")
);
