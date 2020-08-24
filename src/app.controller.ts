import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AcronymService } from './acronym/acronym.service';
import { Acronym } from './acronym/schemas/acronym.schema';

@Controller()
export class AppController {
  constructor(private readonly acronymService: AcronymService) {}

  @Get('random/:count')
  findRandom(@Param('count', ParseIntPipe) count: number): Promise<Acronym[]> {
    return this.acronymService.findRandom(count);
  }
}
