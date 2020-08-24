import { Controller, Get, Query, Param, Post, Body, Put, Delete, ParseIntPipe, Res, HttpStatus, UseGuards, BadRequestException, HttpCode, NotFoundException } from '@nestjs/common';
import { AcronymService } from './acronym.service';
import { AcronymDto } from './dtos/acronym.dto';
import { AcronymItem } from './interfaces/acronymItem.interface';
import { Acronym } from './schemas/acronym.schema';
import { Response } from 'express';
import { AcronymGuard } from 'src/acronym.guard';

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
        let pattern: RegExp;

        try {
            pattern = RegExp(search);
        } catch {
            throw new BadRequestException(`The search parameter '${search}' is not in the expected RegExp format`);
        }

        const acronyms = await this.acronymService.findPaginated(from, limit, pattern);

        if (acronyms.length === limit + 1) {
            acronyms.pop();
            response.set('X-Has-More-Acronyms', 'true');
        } else {
            response.set('X-Has-More-Acronyms', 'false');
        }
        return response.status(HttpStatus.OK).json(acronyms);
    }

    @Get(':acronym')
    async findOne(@Param('acronym') acronym): Promise<Acronym> {
        const result = await this.acronymService.findOne(acronym);

        if (!result) {
            throw new NotFoundException(`There is no acronym with '${acronym}' name`);
        }
        return result;
    }

    @Post()
    create(@Body() acronym: AcronymDto): Promise<Acronym> {
        return this.acronymService.create(acronym);
    }

    @UseGuards(AcronymGuard)
    @Put(':acronym')
    @HttpCode(204)
    async update(@Param('acronym') acronym, @Body('definition') acronymDefinition): Promise<void> {
        await this.acronymService.update(acronym, acronymDefinition);
    }

    @UseGuards(AcronymGuard)
    @Delete(':acronym')
    @HttpCode(204)
    async delete(@Param('acronym') acronym): Promise<void> {
        await this.acronymService.delete(acronym);
    }
}
