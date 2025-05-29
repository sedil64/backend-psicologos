import { Controller, Post, Body, Get } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { Match } from './match.entity';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() data: Partial<Match>) {
    return this.matchesService.create(data);
  }

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }
}
