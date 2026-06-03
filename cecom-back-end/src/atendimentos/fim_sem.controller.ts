import { Body, Post,Get,Delete,Put, Controller, Param } from '@nestjs/common';
import type { fimSemDTO } from './dto/atendimentos.dto';
import { AtendimentosService } from './atendimentos.service';

@Controller('fim-sem')
    export class FimSemController {
        constructor(private readonly fimsem:AtendimentosService){};
    
        @Post()
        async create(@Body() data:fimSemDTO){
            return this.fimsem.createFim(data);
        }
        @Get()
        async findFimSem(){
            return this.fimsem.findFimSem();
        }
        @Put(":id")
        async update(@Param("id") fim_semestre:string, @Body() data:fimSemDTO){
            return this.fimsem.updateFim(fim_semestre, data);
        }
        @Delete(":id")
        async delete(@Param("id") fim_semestre:string){
            return this.fimsem.deleteFim(fim_semestre);
        }
    }

