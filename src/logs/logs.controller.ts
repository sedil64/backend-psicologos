import { Controller, Get, Post, Body } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  create(@Body() data: { accion: string; fecha: Date; usuarioId: number }) {
    return this.logsService.create(data);
  }

  @Get()
  findAll() {
    return this.logsService.findAll();
  }
}
