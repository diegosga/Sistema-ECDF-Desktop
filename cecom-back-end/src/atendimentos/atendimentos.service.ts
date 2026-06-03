import { Injectable } from '@nestjs/common';
import { fimSemDTO } from './dto/atendimentos.dto';
import { AtendimentoDTO } from './dto/atendimentos.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AtendimentosService {
    constructor (private prisma: PrismaService){}

    async createFim(data:fimSemDTO){
        const fim_sem = await this.prisma.fimSemestre.create({
            data
        });
        return fim_sem;
    }

    async updateFim(fim_semestre:string, data:fimSemDTO){
        
        return await this.prisma.fimSemestre.update({
            where:{
                fim_semestre,
            }, 
            data
        })
    }
    async deleteFim(fim_semestre:string){
        const fimExiste = await this.prisma.fimSemestre.findUnique({
                where:{
                    fim_semestre
                }
            })
        return await this.prisma.fimSemestre.delete({
            where:{
                fim_semestre
            }
        });
    }
    async findFimSem(){
        return await this.prisma.fimSemestre.findMany();

    }

    async create(data:AtendimentoDTO){
        const atendimentos = await this.prisma.atendimentos.create({
            data
        });
        return atendimentos;
    }

    async findAll(){
        return await this.prisma.atendimentos.findMany();

    }

    async findUnique(id:number){
        const atend_exist = await this.prisma.atendimentos.findUnique({
            where:{
                id
            }
        });
        if(!atend_exist){
            throw new Error("Atendimento não existe!");
        }
        return await this.prisma.atendimentos.findUnique({
            where:{
                id
            }
        });
    }
    async update(id:number, data:AtendimentoDTO){
        const atend_exist = await this.prisma.atendimentos.findUnique({
            where:{
                id
            }
        });
        if(!atend_exist){
            throw new Error("Atendimento não existe!");
        }
        return await this.prisma.atendimentos.update({
            where:{
                id,
            }, 
            data
        })
    }
    
    async delete(id:number){
        const atend_exist = await this.prisma.atendimentos.findUnique({
            where:{
                id
            }
        });
        if(!atend_exist){
            throw new Error("Atendimento não existe!");
        }
        return await this.prisma.atendimentos.delete({
            where:{
                id
            }
        });
    }

}

    
