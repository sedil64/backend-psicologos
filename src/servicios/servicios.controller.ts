import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  create(@Body() dto: CreateServicioDto) {
    return this.serviciosService.create(dto);
  }

  @Get()
  findAll() {
    return this.serviciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.serviciosService.findOne(id);
  }
}
