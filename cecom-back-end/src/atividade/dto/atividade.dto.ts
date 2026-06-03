import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsString, IsNumber, isNotEmpty, isNumber } from 'class-validator';

export type AlunosAtiv ={
  id:number;
  nome:string;
  idade:number;
  turno:string;
}

export type AtividadeDTO = {
  id?: number;
  atividade: string[];
  dia: string;
  horario: string;
  sera_dividido:boolean;
  hora_lanche?: string;
  grupo: string;
  alunos: AlunosAtiv[];
  tempo_acolhida?: string;
  resp_acolhida?: string;
  tempo_lanche?: string;
  resp_lanche?: string;
  tempo_saida?: string;
  resp_saida?: string;
}