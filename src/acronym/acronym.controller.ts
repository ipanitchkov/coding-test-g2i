import { Controller, Get, Query, Param, Post, Body, Put, Delete, ParseIntPipe, Res, HttpStatus } from '@nestjs/common';
import { AcronymService } from './acronym.service';
import { AcronymDto } from './dtos/acronym.dto';
import { AcronymItem } from './interfaces/acronymItem.interface';
import { Acronym } from './schemas/acronym.schema';
import { Response } from 'express';

@Controller('acronym')
export class AcronymController {
    constructor(private readonly acronymService: AcronymService) { }

    @Post('import')
    import(@Body() acronyms: AcronymItem[]): Promise<void> {
        return this.acronymService.import(acronyms);
    }

    @Get()
    async findPaginated(
        @Query('from', ParseIntPipe) from: number, 
        @Query('limit', ParseIntPipe) limit: number, 
        @Query('search') search,
        @Res() response: Response,
    ): Promise<any> {
        const acronyms = await this.acronymService.findPaginated(from, limit, search);

        if (acronyms.length === limit + 1) {
            acronyms.pop();
            response.set('X-Has-More-Acronyms', 'true');
        } else {
            response.set('X-Has-More-Acronyms', 'false');
        }
        return response.status(HttpStatus.OK).json(acronyms);
    }

    @Get(':acronym')
    findOne(@Param('acronym') acronym): Promise<Acronym> {
        return this.acronymService.findOne(acronym);
    }

    @Post()
    create(@Body() acronym: AcronymDto): Promise<Acronym> {
        return this.acronymService.create(acronym);
    }

    @Put(':acronym')
    update(@Param('acronym') acronym, @Body('definition') acronymDefinition): Promise<void> {
        return this.acronymService.update(acronym, acronymDefinition);
    }

    @Delete(':acronym')
    delete(@Param('acronym') acronym): Promise<void> {
        return this.acronymService.delete(acronym);
    }
}
