-- CreateTable
CREATE TABLE "alunos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "turno" VARCHAR(10) NOT NULL,
    "idade" INTEGER NOT NULL,
    "data_nasc" VARCHAR(10) NOT NULL,
    "responsavel" VARCHAR(200) NOT NULL,
    "contato" VARCHAR(17) NOT NULL,
    "unidade" VARCHAR(200) NOT NULL,
    "endereco_moradia" VARCHAR(200) NOT NULL,
    "nis_crianca" VARCHAR(12),
    "nis_mae" VARCHAR(12),
    "atipicidade" VARCHAR(200),

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atividades" (
    "id" SERIAL NOT NULL,
    "atividade" TEXT[],
    "dia" VARCHAR(20) NOT NULL,
    "horario" VARCHAR(5) NOT NULL,
    "hora_lanche" VARCHAR(5),
    "grupo" VARCHAR(1) NOT NULL,
    "sera_dividido" BOOLEAN NOT NULL,
    "alunos" JSONB[],
    "tempo_acolhida" VARCHAR(14),
    "resp_acolhida" VARCHAR(200),
    "tempo_lanche" VARCHAR(14),
    "resp_lanche" VARCHAR(200),
    "tempo_saida" VARCHAR(14),
    "resp_saida" VARCHAR(200),

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id")
);
