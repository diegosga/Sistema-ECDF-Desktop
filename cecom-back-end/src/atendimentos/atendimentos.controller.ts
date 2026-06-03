import { Body, Post,Get,Delete,Put, Controller, Param } from '@nestjs/common';
import type{ AtendimentoDTO } from './dto/atendimentos.dto';
import { AtendimentosService } from './atendimentos.service';



@Controller('atendimentos')
export class AtendimentosController {
    constructor(private readonly atend:AtendimentosService){};
    @Post()
    async create(@Body() data:AtendimentoDTO){
        return this.atend.create(data);
    }
    @Put(":id")
    async update(@Param("id") id:number, @Body() data:AtendimentoDTO){
        return this.atend.update(Number(id), data);
    }
    @Get()
    async getAll(){
        return this.atend.findAll();
    }
    @Get(":id")
    async getUnique(@Param("id") id:number){
        return this.atend.findUnique(Number(id));
    }

    @Delete(":id")
    async delete(@Param("id") id:number){
        return this.atend.delete(Number(id));
    }
}



