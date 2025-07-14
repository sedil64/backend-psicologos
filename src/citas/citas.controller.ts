// src/citas/citas.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';

import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { Cita } from './entities/citas.entity';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  async create(
    @Body() dto: CreateCitaDto,
  ): Promise<Cita> {
    return this.citasService.create(dto);
  }

  @Get()
  async findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Cita> {
    return this.citasService.findOne(id);
  }

  @Post(':id/confirmar')
  async confirmar(@Param('id') id: number): Promise<Cita> {
    return this.citasService.confirmar(id);
  }

  @Post(':id/cancelar')
  async cancelar(@Param('id') id: number): Promise<Cita> {
    return this.citasService.cancelar(id);
  }
}
