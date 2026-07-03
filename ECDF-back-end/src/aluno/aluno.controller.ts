import { Body, Post,Get,Delete,Put, Controller, Param } from '@nestjs/common';
import type { AlunoDTO } from './dto/aluno.dto';
import { AlunoService } from './aluno.service';

@Controller('aluno')
export class AlunoController {

    constructor(private readonly AlunoService:AlunoService){}

    @Post()
    async create(@Body() data: AlunoDTO){
        return this.AlunoService.create(data);
    }
    
    @Get()
    async findAll(){
        return this.AlunoService.findAll();
    }

    @Get(":id")
    async findUnique(@Param("id") id:number){
            return await this.AlunoService.findUnique(Number(id));
    }

    @Put(":id")
    async update(@Param("id") id:number, @Body() data:AlunoDTO){
        return this.AlunoService.update(Number(id), data);
    }
    @Delete(":id")
    async delete(@Param("id") id:number){
        return this.AlunoService.delete(Number(id));
    }
    @Delete()
    async deleteAll(){
        return this.AlunoService.deleteAll();
    }


}
