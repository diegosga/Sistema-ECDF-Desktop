import { Body, Post,Get,Delete,Put, Controller, Param } from '@nestjs/common';
import type { urlDTO } from './dto/url.dto';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
constructor(private readonly url:UrlService){};

@Post()
async create(@Body() data:urlDTO){
    return this.url.create(data);
}

@Get()
async findURL(){
    return this.url.findAll();
}
@Put(":id")
async update(@Param("id") url:string, @Body() data:urlDTO){
    return this.update(url, data);
}
@Delete()
        async delete(){
            return this.url.delete();
        }
    
}
