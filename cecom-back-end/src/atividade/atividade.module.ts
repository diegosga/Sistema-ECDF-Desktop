import { Module } from '@nestjs/common';
import { AtividadeService } from './atividade.service';
import { AtividadeController } from './atividade.controller';
import { PrismaService } from 'src/database/prisma.service';
import { UrlService } from 'src/url/url.service';
import { UrlController } from 'src/url/url.controller';

@Module({
  providers: [AtividadeService,UrlService, PrismaService],
  controllers: [AtividadeController,UrlController]
})
export class AtividadeModule {}
