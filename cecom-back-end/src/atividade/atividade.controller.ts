import {  Body, Post,Get,Delete,Put, Controller, Param  } from '@nestjs/common';
import type { AtividadeDTO } from './dto/atividade.dto';
import { AtividadeService } from './atividade.service';

@Controller('atividade')
export class AtividadeController {
    
    constructor(private readonly AtividadeService:AtividadeService){}
    
        @Post()
        async create(@Body() data: AtividadeDTO){
            return this.AtividadeService.create(data);
        }
        
        @Get()
        async findAll(){
            return await this.AtividadeService.findAll();
        }
        @Get(":id")
        async findUnique(@Param("id") id:number){
            return await this.AtividadeService.findUnique(Number(id));
        }
        @Put(":id")
        async update(@Param("id") id:number, @Body() data:AtividadeDTO){
            return this.AtividadeService.update(Number(id), data);
        }
        @Delete(":id")
        async delete(@Param("id") id:number){
            return this.AtividadeService.delete(Number(id));
        }

}
