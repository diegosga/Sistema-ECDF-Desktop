import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AtividadeDTO } from './dto/atividade.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as XLSX from "xlsx";
import * as fs from 'fs';
import * as path from 'path';
let caminho_config = path.join(String(process.env.USER_DATA_PATH), "config.json");
let caminho_excel:string;


const pegarValor = async ()=>{
            if(fs.existsSync(caminho_config)){
             const response = fs.readFileSync(caminho_config, 'utf-8');
             const config = JSON.parse(response);
             if(config){
                    caminho_excel = config.url;
                    return caminho_excel;
                }
             else{
                console.log("caminho não encontrado")
                
            }
            };
           }

        

const traduzir=(traduzido, traducao)=>{
    const colunas={
         atividade:"ATIVIDADES",
         dia: "DIA DA ATIVIDADE",
         horario:"HORARIO",
         hora_lanche: "HORARIO DO LANCHE",
         grupo:"GRUPO",
         alunos:"ALUNOS",
         sera_dividido: "DIVIDIDO",
         tempo_acolhida:"ACOLHER AO PORTÃO",
         resp_acolhida:"RESPONSÁVEL PELO ACOLHIMENTO",
         tempo_lanche:"ACOMPANHAR LANCHE",
         resp_lanche:"RESPONSAVEL PELO ACOMPANHAMENTO",
         tempo_saida:"ACOMPANHAR A SAÍDA",
         resp_saida:"RESPONSAVEL PELO ACOMPANHAMENTO"
    }
    Object.entries(traduzido).forEach(([colunaDTO, valor]) => {
                
                const colunaTraduzida = colunas[colunaDTO];
                let valorFormatado=valor;
                if (colunaTraduzida === "ATIVIDADES") {
            // Log para entender por que a atividade falha
            console.log(`[DEBUG Atividade] É array? ${Array.isArray(valor)}. Conteúdo:`, valor);
            
            if (Array.isArray(valor)) {
                valorFormatado = valor.join("\n");
            } else if (typeof valor === "string") {
                valorFormatado = valor; // Se já veio como string, mantém
            }
        } 
        
        else if (colunaTraduzida === "ALUNOS") {
            // Log para entender por que o aluno falha
            console.log(`[DEBUG Alunos] É array? ${Array.isArray(valor)}. Conteúdo:`, valor);
            
            if (Array.isArray(valor)) {
                valorFormatado = valor.map(aluno => {
                    if (!aluno) return "Aluno Nulo/Indefinido";
                    // Se o banco trouxe uma string direto ao invés de objeto:
                    if (typeof aluno === "string") return aluno; 
                    return aluno.nome || aluno.Nome || "Nome não encontrado";
                }).join("\n");
            }
        } 
 
                traducao[colunaTraduzida] = valorFormatado;
        });
}

@Injectable()
export class AtividadeService {

    constructor (private prisma: PrismaService){
          console.log(fs.existsSync(caminho_config));
                  if(fs.existsSync(caminho_config)){
                      pegarValor();
        }
    }

        async create(data: AtividadeDTO){
            if (!fs.existsSync(caminho_excel)) {
                    throw new Error(`Arquivo não encontrado no caminho: ${caminho_excel}`);
                }
                    const dadoExcel = {};
                    const wb = XLSX.readFile(caminho_excel);
                    let nome;
                    const hora = parseInt(data.horario.split(":")[0]);
                    hora<12?nome =  wb.SheetNames[1]:nome =  wb.SheetNames[2];
                    const sheet = wb.Sheets[nome];
                    
            
                    
                    traduzir(data, dadoExcel);
                    
                        try{
            const atividade = await this.prisma.atividades.create({
                data
            });
            const dados = XLSX.utils.sheet_to_json(sheet);
            const dadosAtuais = [...dados, dadoExcel];
            
            const new_sheet = XLSX.utils.json_to_sheet(dadosAtuais);
            wb.Sheets[nome] = new_sheet;
            XLSX.writeFile(wb, caminho_excel);
            return atividade;
        }catch(error){
            throw new InternalServerErrorException(`Erro ao salvar os dados: ${error}`); 
        }
        }

        async findAll(){
            return await this.prisma.atividades.findMany();
        }
        async findUnique(id:number){
            const atividadeExiste = await this.prisma.atividades.findUnique({
    
                where:{
                    id,
                }
            });
            if(!atividadeExiste){
                throw new Error("Atividade Não encontrada");
            }

            return await this.prisma.atividades.findUnique({
                where:{id}
            });
        }
    
        async update(id: number, data:AtividadeDTO){
            const atividadeExiste = await this.prisma.atividades.findUnique({
    
                where:{
                    id,
                }
            });
            
            const ativTraduzida = {};
            const ativExisteTraduzida = {};
            const wb = XLSX.readFile(caminho_excel);
            let nome;
            let sheet;
            if(atividadeExiste){
                const hora = parseInt(atividadeExiste.horario.split(":")[0]);
                hora<12?nome =  wb.SheetNames[1]:nome =  wb.SheetNames[2];
                sheet = wb.Sheets[nome];
                const dadoExcel= XLSX.utils.sheet_to_json(sheet) as any [];
                traduzir(data,ativTraduzida);
                traduzir(atividadeExiste,ativExisteTraduzida);
                
                const novosDados = dadoExcel.map(linha => {
                if(Object.keys(linha).every(campo => String(linha[campo]) === String(ativExisteTraduzida[campo]))){
                        return {...linha, ...ativTraduzida};
                    }else{
                        return linha;
                    }
            });
                

                const novo_arquivo= XLSX.utils.json_to_sheet(novosDados);
                
                wb.Sheets[nome] = novo_arquivo;
                XLSX.writeFile(wb, caminho_excel);

            }else{
            throw new Error("Atividade não encontrado");
        }
            return await this.prisma.atividades.update({
                    data,
                    where :{
                        id,
                    }
                }
            );
        }
    
         async delete(id: number){
            const atividadeExiste = await this.prisma.atividades.findUnique({
    
                where:{
                    id,
                }
            });
            const ativTraduzida = {};
            const wb = XLSX.readFile(caminho_excel);
            let nome;
            
            if(atividadeExiste){
                const hora = parseInt(atividadeExiste.horario.split(":")[0]);
                hora<12?nome =  wb.SheetNames[1]:nome =  wb.SheetNames[2];
                const sheet = wb.Sheets[nome];
                const dadoExcel= XLSX.utils.sheet_to_json(sheet) as any [];
                traduzir(atividadeExiste, ativTraduzida);
                const deletado =dadoExcel.filter(linha=>{
                    return !Object.keys(linha).every(campo=>
                        String(linha[campo]) ===String(ativTraduzida[campo])
                    )
                });
                const nova_plan = XLSX.utils.json_to_sheet(deletado);
                wb.Sheets[nome] = nova_plan;
                XLSX.writeFile(wb,caminho_excel);
            }else{
                throw new Error("Atividade não encontrada");
            }
            return await this.prisma.atividades.delete({
                    
                    where :{
                        id,
                    }
                }
            );
        }
        async deleteAll(){
        return await this.prisma.atividades.deleteMany();
    }

}
