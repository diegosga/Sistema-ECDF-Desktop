// model FimSemestre{
//   id            Int @id @default(autoincrement())
//   fim_semestre String @db.VarChar(10)
//   @@map("fim_sem")
// }

// model Atendimentos{
//   id            Int @id @default(autoincrement())
//   atividade     String @db.VarChar(200)
//   qtd_atendidos Int
//   @@map("atendimentos")
// }

export type fimSemDTO ={
    fim_semestre: string;
}
export type AtendimentoDTO = {

    id?: number;
    atividade: string;
    qtd_atendidos: number;

}