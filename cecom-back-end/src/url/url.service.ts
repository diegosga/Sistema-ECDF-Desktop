import { Injectable } from '@nestjs/common';
import { urlDTO } from './dto/url.dto';
import { PrismaService } from 'src/database/prisma.service';
import { AlunoService } from '../aluno/aluno.service';
const xlsx = require('xlsx');
const path = require('path');
@Injectable()
export class UrlService {

    constructor (private prisma: PrismaService){
    
        }

        async create(data:urlDTO){
            
            if(data.vai_ser_usado ==="Sim"){
                const wb = xlsx.readFile(data.url);
                const alunos = wb.SheetNames[0];
                const ativ = wb.SheetNames[1];
                const ws_alunos = wb.Sheets[alunos];
                const ws_ativ = wb.Sheets[ativ];
                const dados_alunos = xlsx.utils.sheet_to_json(ws_alunos);
                const dados_ativ = xlsx.utils.sheet_to_json(ws_ativ);

                const dadosF_aluno =  dados_alunos.map(item=>{
                    return{
                        nome: item["NOME DO EDUCANDO/A"],
                        turno: item["TURNO NA ECDF"],
                        idade: item["IDADE DO EDUCANDO/A"],
                        data_nasc: item["DATA DE NASCIMENTO DO EDUCANDO/A"], 
                        responsavel: item["RESPONSÁVEL PELO EDUCANDO/A"], 
                        contato: item["CONTATO DO RESPONSÁVEL"],
                        unidade: item["UNIDADE ESCOLAR (ONDE O EDUCANDO ESTUDA)"],
                        endereco_moradia: item["ENDEREÇO DE MORADIA"],
                        nis_crianca: item["Nº NIS CRIANÇA"],
                        nis_mae: item["Nº NIS MÃE"],
                        atipicidade: item["ATIPICIDADE (TEM NECESSIDADES ESPECIAIS)"]
                    }
                    
                })
                const dadosF_atividades = dados_ativ.map(item => {
                        return {
                            atividade: item["ATIVIDADES"],
                            dia: item["DIA DA ATIVIDADE"],
                            horario: item["HORARIO"],
                            hora_lanche: item["HORARIO DO LANCHE"],
                            grupo: item["GRUPO"],
                            alunos: item["ALUNOS"],
                            sera_dividido: item["DIVIDIDO"],
                            tempo_acolhida: item["ACOLHER AO PORTÃO"],
                            resp_acolhida: item["RESPONSÁVEL PELO ACOLHIMENTO"],
                            tempo_lanche: item["ACOMPANHAR LANCHE"],
                            resp_lanche: item["RESPONSAVEL PELO ACOMPANHAMENTO"],
                            tempo_saida: item["ACOMPANHAR A SAÍDA"],
                            resp_saida: item["RESPONSAVEL PELO ACOMPANHAMENTO"]
                        }
                    });
                dadosF_aluno.map(aluno => 
                            this.prisma.aluno.create(aluno)
                                );
                
                dadosF_atividades.map(ativ =>{
                    this.prisma.atividades.create(ativ)
                });
                            }
                
                else{
                    const dadosAlunos = [[
                                    "NOME DO EDUCANDO/A",
                                    "TURNO NA ECDF",
                                    "IDADE DO EDUCANDO/A",
                                    "DATA DE NASCIMENTO DO EDUCANDO/A",
                                    "RESPONSÁVEL PELO EDUCANDO/A",
                                    "CONTATO DO RESPONSÁVEL",
                                    "UNIDADE ESCOLAR (ONDE O EDUCANDO ESTUDA)",
                                    "ENDEREÇO DE MORADIA",
                                    "Nº NIS CRIANÇA",
                                    "Nº NIS MÃE",
                                    "ATIPICIDADE (TEM NECESSIDADES ESPECIAIS)"
                                    ]];
                    const dadosAtividades =[[
                                                "ATIVIDADES",
                                                "DIA DA ATIVIDADE",
                                                "HORARIO",
                                                "HORARIO DO LANCHE",
                                                "GRUPO",
                                                "ALUNOS",
                                                "DIVIDIDO",
                                                "ACOLHER AO PORTÃO",
                                                "RESPONSÁVEL PELO ACOLHIMENTO",
                                                "ACOMPANHAR LANCHE",
                                                "RESPONSAVEL PELO ACOMPANHAMENTO",
                                                "ACOMPANHAR A SAÍDA",
                                                "RESPONSAVEL PELO ACOMPANHAMENTO"
                                                ]];          
                    const ws_alunos = xlsx.utils.aoa_to_sheet(dadosAlunos);
                    const ws_ativ = xlsx.utils.aoa_to_sheet(dadosAtividades);
                    const wb = xlsx.utils.book_new();
                    xlsx.utils.book_append_sheet(wb,ws_alunos,"Alunos");
                    xlsx.utils.book_append_sheet(wb,ws_ativ,"Atividades");
                    const caminho_esp = path.join(data.url, "planilha_cecom.xlsx");
                    xlsx.writeFile(wb, caminho_esp);
                    data.url= caminho_esp;
                }
                const url = await this.prisma.url.create({
                data
            }); 
                 return url;
                    }
            
            
            
            
        
        async delete(){
            return await this.prisma.url.deleteMany()
        }
        
        async update(url:string, data:urlDTO){
            const urlExiste = await this.prisma.url.findUnique({
                where:{
                    url
                }
            })
            if(!urlExiste) throw new Error("Url inexistente!");
            return await this.prisma.url.update({
                where:{
                    url,
                },
                data
            })
        }
        async findOnly(){
            const resp = await this.prisma.url.findFirst({
                select:{
                    url: true,
                }
            });
            return resp?.url;
        }
        async findAll(){
            const resp = await this.prisma.url.findMany();
            return resp;
        }
}
