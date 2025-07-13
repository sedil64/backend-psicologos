import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Controller('citas')
export class CitasController {
  constructor(private readonly service: CitasService) {}

  @Post()
  crear(@Body() dto: CreateCitaDto) {
    return this.service.crear(dto);
  }

  @Get()
  todas() {
    return this.service.todas();
  }

  @Get(':id')
  porId(@Param('id') id: number) {
    return this.service.porId(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: number, @Body() dto: UpdateCitaDto) {
    return this.service.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.service.eliminar(id);
  }
}
