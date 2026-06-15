import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { AlunoDTO } from './dto/aluno.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UrlService } from '../url/url.service';

import * as XLSX from "xlsx";
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';


//teste
let caminho_config = path.join(__dirname, '..', '..','..','..', 'dist-electron','config.json');
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


const traduzir= (traduzido,traducao)=>{
    const colunas ={
    nome:"NOME DO EDUCANDO/A",
    turno:"TURNO NA ECDF",
    idade: "IDADE DO EDUCANDO/A",
    data_nasc: "DATA DE NASCIMENTO DO EDUCANDO/A", 
    responsavel: "RESPONSÁVEL PELO EDUCANDO/A", 
    contato:"CONTATO DO RESPONSÁVEL",
    unidade: "UNIDADE ESCOLAR (ONDE O EDUCANDO ESTUDA)",
    endereco_moradia: "ENDEREÇO DE MORADIA",
    nis_crianca: "Nº NIS CRIANÇA",
    nis_mae: "Nº NIS MÃE",
    atipicidade:"ATIPICIDADE (TEM NECESSIDADES ESPECIAIS)"

}
    Object.entries(traduzido).forEach(([colunaDTO, valor]) => {
                const colunaTraduzida = colunas[colunaDTO];
                traducao[colunaTraduzida] = valor;
        });
        
}


@Injectable()
export class AlunoService {

    constructor (private prisma: PrismaService){
        console.log(fs.existsSync(caminho_config));
        if(fs.existsSync(caminho_config)){
            pegarValor();
}
        
    }
    
    async create(data: AlunoDTO){
      if (!fs.existsSync(caminho_excel)) {
        const response = fs.readFileSync(caminho_config, 'utf-8');
        const config = JSON.parse(response);
         console.log(config.url);
        throw new Error(`Arquivo não encontrado no caminho: ${caminho_excel}`);
        
    }
       
        const dadoExcel = {};
        const wb = XLSX.readFile(caminho_excel);
        const nome = wb.SheetNames[0];
        const sheet = wb.Sheets[nome];
        

        
        traduzir(data, dadoExcel);
        
            try{
            const aluno = await this.prisma.aluno.create({
                data
            });

            const dados = XLSX.utils.sheet_to_json(sheet);
            const dadosAtuais = [...dados, dadoExcel];

            const new_sheet = XLSX.utils.json_to_sheet(dadosAtuais);
            wb.Sheets[nome] = new_sheet;
            XLSX.writeFile(wb, caminho_excel);
            
            
            return aluno;
        }catch(error){
            throw new InternalServerErrorException(`Erro ao salvar os dados: ${error}`); 
        }
    }


    //front end
    async findAll(){
        return await this.prisma.aluno.findMany();
    }
    //função pra fins de teste
    async deleteAll(){
        return await this.prisma.aluno.deleteMany();
    }

    async findUnique(id:number){
            const alunoExiste = await this.prisma.aluno.findUnique({

            where:{
                id,
            }
        });
        if(!alunoExiste){
            throw new Error("Aluno não encontrado");
        }
        return await this.prisma.aluno.findUnique({
                where :{
                    id,
                }
            }
        );
    
        }

    async update(id: number, data:AlunoDTO){
        const alunoExiste = await this.prisma.aluno.findUnique({
            
            where:{
                id,
            }
        });

        const alunoTraduzido = {};
        const alunoExisteTraduzido = {};
        const wb = XLSX.readFile(caminho_excel);
        const nome = wb.SheetNames[0];
        const sheet = wb.Sheets[nome];
        const dadoExcel= XLSX.utils.sheet_to_json(sheet) as any [];

        if(alunoExiste){
            traduzir(data, alunoTraduzido);
            traduzir(alunoExiste, alunoExisteTraduzido);
            
        
        const novosDados = dadoExcel.map(linha => {
                if(Object.keys(linha).every(campo => String(linha[campo]) === String(alunoExisteTraduzido[campo]))){
                        return {...linha, ...alunoTraduzido};
                    }else{
                        return linha;
                    }
            });

        const novo_arquivo= XLSX.utils.json_to_sheet(novosDados);
        
        wb.Sheets[nome] = novo_arquivo;
        console.log(`Arquivos escritos com ${novosDados.values()}`);
        XLSX.writeFile(wb, caminho_excel);
        
        }else{
            throw new Error("Aluno não encontrado");
        }
        return await this.prisma.aluno.update({
                data,
                where :{
                    id,
                }
            }
        );
    }

     async delete(id: number){
        const alunoExiste = await this.prisma.aluno.findUnique({

            where:{
                id,
            }
        });

        const alunoTraduzido = {}
        const wb = XLSX.readFile(caminho_excel);
        const nome = wb.SheetNames[0];
        const sheet = wb.Sheets[nome];
        const dadoExcel = XLSX.utils.sheet_to_json(sheet) as any[];
        if(alunoExiste){
            traduzir(alunoExiste, alunoTraduzido);
            const deletado = dadoExcel.filter(linha => {
                return !Object.keys(linha).every(campo => 
                    String(linha[campo]) === String(alunoTraduzido[campo]));
            });
        
            const nova_plan = XLSX.utils.json_to_sheet(deletado);
            wb.Sheets[nome] = nova_plan;
            XLSX.writeFile(wb, caminho_excel);
        }else{
        throw new Error("Aluno não encontrado");
     }
        return await this.prisma.aluno.delete({
                
                where :{
                    id
                }
            }
        );
    }
}
