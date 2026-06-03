import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlunoModule } from './aluno/aluno.module';
import { AtividadeService } from './atividade/atividade.service';
import { AtividadeModule } from './atividade/atividade.module';
import { PrismaModule } from './database/prisma.module';
import { AtendimentosService } from './atendimentos/atendimentos.service';
import { AtendimentosController } from './atendimentos/atendimentos.controller';
import { AtendimentosModule } from './atendimentos/atendimentos.module';
import { UrlService } from './url/url.service';

@Module({
  imports: [AlunoModule, AtividadeModule,PrismaModule, AtendimentosModule],
  controllers: [AppController],
  providers: [AppService, UrlService],
})
export class AppModule {}
