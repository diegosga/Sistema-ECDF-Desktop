import { Module} from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { AlunoController } from './aluno.controller';
import { PrismaService } from 'src/database/prisma.service';
import { UrlController } from '../url/url.controller';
import { UrlService } from '../url/url.service';

@Module({
    providers:[AlunoService,UrlService, PrismaService],
    controllers: [AlunoController, UrlController]

})
export class AlunoModule {}
