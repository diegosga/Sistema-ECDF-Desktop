import { Module } from '@nestjs/common';
import { AtendimentosService } from './atendimentos.service';
import { PrismaService } from 'src/database/prisma.service';
import { AtendimentosController } from './atendimentos.controller';
import { FimSemController } from './fim_sem.controller';

@Module({
    providers:[AtendimentosService, PrismaService],
    controllers: [AtendimentosController,FimSemController]
})
export class AtendimentosModule {}
