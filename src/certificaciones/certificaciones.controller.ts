import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CertificacionesService } from './certificaciones.service';
import { CreateCertificacionDto } from './dto/create-certificacion.dto';

@Controller('certificaciones')
export class CertificacionesController {
  constructor(private readonly service: CertificacionesService) {}

  @Post(':psicologoId')
  async agregar(@Param('psicologoId') psicologoId: number, @Body() dto: CreateCertificacionDto) {
    return this.service.agregarCertificacion(psicologoId, dto);
  }

  @Get(':psicologoId')
  async ver(@Param('psicologoId') psicologoId: number) {
    return this.service.obtenerPorPsicologo(psicologoId);
  }
}
